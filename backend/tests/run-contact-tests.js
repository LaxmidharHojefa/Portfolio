import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

function withEnv(overrides) {
  const previous = new Map();
  for (const [key, value] of Object.entries(overrides)) {
    previous.set(key, process.env[key]);
    if (value === undefined || value === null) {
      delete process.env[key];
    } else {
      process.env[key] = String(value);
    }
  }

  return () => {
    for (const [key, value] of previous.entries()) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  };
}

async function createClient(envOverrides = {}) {
  const restoreEnv = withEnv(envOverrides);
  const app = createApp();
  const server = app.listen(0);

  await new Promise((resolve) => server.once("listening", resolve));

  const address = server.address();
  if (!address || typeof address !== "object") {
    throw new Error("Unable to start test server.");
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  async function request(path, options = {}) {
    const response = await fetch(`${baseUrl}${path}`, options);
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    return { response, text, json };
  }

  async function close() {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
    restoreEnv();
  }

  return { request, close };
}

function buildPayload() {
  return {
    name: "Test User",
    email: "test@example.com",
    phone: "+1 (555) 123-4567",
    message: "Hello, I need a full-stack web app for my business.",
    formStartedAt: Date.now() - 5000,
    website: "",
  };
}

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`PASS: ${name}`);
  } catch (error) {
    console.error(`FAIL: ${name}`);
    throw error;
  }
}

await runTest("contact rejects invalid email", async () => {
  const client = await createClient({
    FRONTEND_ORIGIN: "http://localhost:5173",
    CONTACT_RATE_LIMIT_MAX: 10,
  });

  try {
    const payload = { ...buildPayload(), email: "bad-email" };
    const { response, json } = await client.request("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    assert.equal(response.status, 400);
    assert.equal(json?.error, "Please enter a valid email address.");
  } finally {
    await client.close();
  }
});

await runTest("contact honeypot returns success", async () => {
  const client = await createClient({
    FRONTEND_ORIGIN: "http://localhost:5173",
    CONTACT_RATE_LIMIT_MAX: 10,
  });

  try {
    const payload = { ...buildPayload(), website: "spam.example" };
    const { response, json } = await client.request("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    assert.equal(response.status, 200);
    assert.equal(json?.success, true);
  } finally {
    await client.close();
  }
});

await runTest("contact rate limiting returns 429", async () => {
  const client = await createClient({
    FRONTEND_ORIGIN: "http://localhost:5173",
    CONTACT_RATE_LIMIT_MAX: 2,
    CONTACT_RATE_LIMIT_WINDOW_MS: 60000,
  });

  try {
    const payload = buildPayload();

    const first = await client.request("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    assert.equal(first.response.status, 200);

    const second = await client.request("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    assert.equal(second.response.status, 200);

    const third = await client.request("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    assert.equal(third.response.status, 429);
    assert.ok(Number(third.json?.retryAfter) > 0);
  } finally {
    await client.close();
  }
});

await runTest("contact requires captcha token when turnstile secret is configured", async () => {
  const client = await createClient({
    FRONTEND_ORIGIN: "http://localhost:5173",
    CONTACT_RATE_LIMIT_MAX: 10,
    TURNSTILE_SECRET_KEY: "test-secret",
  });

  try {
    const payload = buildPayload();
    const { response, json } = await client.request("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    assert.equal(response.status, 400);
    assert.equal(json?.error, "Please complete the CAPTCHA challenge.");
  } finally {
    await client.close();
  }
});

await runTest("cors disallowed origin returns json 403", async () => {
  const client = await createClient({
    FRONTEND_ORIGIN: "http://localhost:5173",
  });

  try {
    const { response, json } = await client.request("/api/health", {
      headers: {
        Origin: "https://not-allowed.example",
      },
    });

    assert.equal(response.status, 403);
    assert.equal(json?.error, "Request origin is not allowed.");
  } finally {
    await client.close();
  }
});

console.log("All backend contact API tests passed.");
