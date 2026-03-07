import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { Resend } from "resend";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env regardless of the process working directory.
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// Fallback for environments that rely on default dotenv behavior.
dotenv.config();

function cleanString(input) {
  return String(input || "").trim();
}

function resolveTrustProxySetting(value) {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  const hops = Number(value);
  if (Number.isFinite(hops) && hops >= 0) {
    return hops;
  }
  return false;
}

function normalizeMultiline(input) {
  return cleanString(input).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function escapeHtml(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getClientIp(req) {
  return cleanString(req.ip || req.socket?.remoteAddress || "unknown");
}

async function verifyTurnstileToken({ secret, token, ip }) {
  if (!secret) {
    return { ok: true, skipped: true };
  }

  if (!token) {
    return { ok: false, reason: "missing_token" };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip || "",
  });

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      return { ok: false, reason: "provider_unavailable" };
    }

    const data = await response.json();
    if (!data?.success) {
      return { ok: false, reason: "verification_failed", errorCodes: data?.["error-codes"] || [] };
    }

    return { ok: true, skipped: false };
  } catch {
    return { ok: false, reason: "provider_unavailable" };
  }
}

export function createApp() {
  const app = express();

  const rawOrigins = process.env.FRONTEND_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173";
  const trustProxyRaw = String(process.env.TRUST_PROXY || "0").trim().toLowerCase();
  const allowedOrigins = rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const resendApiKey = process.env.RESEND_API_KEY || "";
  const contactToEmail = process.env.CONTACT_TO_EMAIL || "";
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  const resend = resendApiKey ? new Resend(resendApiKey) : null;
  const submissionsDir = path.resolve(__dirname, "../data");
  const submissionsFile = path.resolve(submissionsDir, "contact-submissions.json");
  const captchaSecret = cleanString(process.env.TURNSTILE_SECRET_KEY);
  const captchaEnabled = Boolean(captchaSecret);

  const maxNameLength = 80;
  const maxEmailLength = 254;
  const maxPhoneLength = 32;
  const maxMessageLength = 3000;
  const minMessageLength = 10;
  const minHumanFillMs = Number(process.env.CONTACT_MIN_FILL_MS || 1500);
  const rateLimitWindowMs = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
  const rateLimitMaxRequests = Number(process.env.CONTACT_RATE_LIMIT_MAX || 5);
  const requestBucketByIp = new Map();

  function applyRateLimit(ip) {
    const now = Date.now();
    const bucket = requestBucketByIp.get(ip);

    if (!bucket || now >= bucket.resetAt) {
      const resetAt = now + rateLimitWindowMs;
      requestBucketByIp.set(ip, { count: 1, resetAt });
      return {
        allowed: true,
        retryAfterSeconds: Math.ceil(rateLimitWindowMs / 1000),
      };
    }

    bucket.count += 1;
    if (bucket.count > rateLimitMaxRequests) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      };
    }

    return {
      allowed: true,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  function pruneRateLimitBuckets() {
    const now = Date.now();
    for (const [ip, bucket] of requestBucketByIp.entries()) {
      if (now >= bucket.resetAt) {
        requestBucketByIp.delete(ip);
      }
    }
  }

  setInterval(pruneRateLimitBuckets, Math.max(30 * 1000, rateLimitWindowMs)).unref();

  async function saveSubmissionLocally(submission) {
    try {
      await fs.mkdir(submissionsDir, { recursive: true });
      let current = [];

      try {
        const existing = await fs.readFile(submissionsFile, "utf8");
        current = JSON.parse(existing);
        if (!Array.isArray(current)) {
          current = [];
        }
      } catch {
        current = [];
      }

      current.push(submission);
      await fs.writeFile(submissionsFile, JSON.stringify(current, null, 2), "utf8");
    } catch (error) {
      console.error("Failed to save local contact submission:", error);
    }
  }

  app.disable("x-powered-by");
  app.set("trust proxy", resolveTrustProxySetting(trustProxyRaw));
  app.use(morgan("dev"));
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
    next();
  });
  app.use(express.json({ limit: "50kb" }));
  app.use(
    cors({
      origin(origin, callback) {
        // Allow server-to-server tools (no origin) and configured frontend origins.
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Origin not allowed by CORS"));
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      mode: resend && contactToEmail ? "email" : "local",
      captchaEnabled,
      uptimeSeconds: Math.floor(process.uptime()),
    });
  });

  app.post("/api/contact", async (req, res) => {
    const name = cleanString(req.body?.name);
    const email = cleanString(req.body?.email).toLowerCase();
    const phone = cleanString(req.body?.phone);
    const message = normalizeMultiline(req.body?.message);
    const website = cleanString(req.body?.website);
    const captchaToken = cleanString(req.body?.captchaToken);
    const formStartedAtRaw = req.body?.formStartedAt;
    const userAgent = cleanString(req.headers["user-agent"]);
    const ip = getClientIp(req);

    if (website) {
      // Honeypot trap for bots. Return success so bot behavior is not reinforced.
      res.json({
        success: true,
        message: "Your message has been sent successfully. I will contact you soon.",
      });
      return;
    }

    const rateLimitResult = applyRateLimit(ip);
    if (!rateLimitResult.allowed) {
      res.setHeader("Retry-After", String(rateLimitResult.retryAfterSeconds));
      res.status(429).json({
        error: `Too many submissions. Please wait ${rateLimitResult.retryAfterSeconds} seconds and try again.`,
        retryAfter: rateLimitResult.retryAfterSeconds,
      });
      return;
    }

    if (Number.isFinite(Number(formStartedAtRaw))) {
      const startedAt = Number(formStartedAtRaw);
      const timeSpentMs = Date.now() - startedAt;
      if (timeSpentMs < minHumanFillMs) {
        res.status(400).json({ error: "Please take a moment to complete the form before submitting." });
        return;
      }
    }

    if (!name || !email || !phone || !message) {
      res.status(400).json({ error: "Please fill in all fields before sending." });
      return;
    }

    if (name.length > maxNameLength) {
      res.status(400).json({ error: `Name is too long. Maximum ${maxNameLength} characters.` });
      return;
    }

    if (email.length > maxEmailLength) {
      res.status(400).json({ error: `Email is too long. Maximum ${maxEmailLength} characters.` });
      return;
    }

    if (phone.length > maxPhoneLength) {
      res.status(400).json({ error: `Phone number is too long. Maximum ${maxPhoneLength} characters.` });
      return;
    }

    if (message.length < minMessageLength) {
      res.status(400).json({ error: `Message is too short. Please use at least ${minMessageLength} characters.` });
      return;
    }

    if (message.length > maxMessageLength) {
      res.status(400).json({ error: `Message is too long. Maximum ${maxMessageLength} characters.` });
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      res.status(400).json({ error: "Please enter a valid email address." });
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    const isValidPhone = /^[+\d().\-\s]{7,32}$/.test(phone) && phoneDigits.length >= 7;
    if (!isValidPhone) {
      res.status(400).json({ error: "Please enter a valid phone number." });
      return;
    }

    if (captchaEnabled && !captchaToken) {
      res.status(400).json({ error: "Please complete the CAPTCHA challenge." });
      return;
    }

    if (captchaEnabled) {
      const captchaResult = await verifyTurnstileToken({
        secret: captchaSecret,
        token: captchaToken,
        ip,
      });

      if (!captchaResult.ok && captchaResult.reason === "provider_unavailable") {
        res.status(503).json({ error: "Captcha verification service is temporarily unavailable. Please retry shortly." });
        return;
      }

      if (!captchaResult.ok) {
        res.status(400).json({ error: "CAPTCHA verification failed. Please try again." });
        return;
      }
    }

    try {
      const submittedAt = new Date().toISOString();
      const submission = { name, email, phone, message, submittedAt, ip, userAgent };

      // If email credentials are missing, keep local development unblocked.
    if (!resend || !contactToEmail) {
      await saveSubmissionLocally(submission);
      res.json({
        success: true,
        mode: "local",
        emailDelivered: false,
        message: "Your message was saved locally. Email delivery is not configured yet.",
      });
      return;
    }

      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safePhone = escapeHtml(phone);
      const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");
      const safeSubmittedAt = escapeHtml(submittedAt);

      // Send to site owner and set replyTo so replies go to the visitor's email.
      const response = await resend.emails.send({
        from: contactFromEmail,
        to: [contactToEmail],
        subject: `New contact form message from ${name}`,
        replyTo: email,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
          <p><strong>Submitted at:</strong> ${safeSubmittedAt}</p>
        `,
        text: [
          "New Contact Form Submission",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
          `Message: ${message}`,
          `Submitted at: ${submittedAt}`,
        ].join("\n"),
      });

    if (response.error) {
      console.error("Resend returned an error:", response.error);
      await saveSubmissionLocally({ ...submission, deliveryStatus: "email_failed" });
      res.json({
        success: true,
        mode: "fallback",
        emailDelivered: false,
        message: "Your message was saved, but email delivery failed temporarily.",
      });
      return;
    }

    res.json({
      success: true,
      mode: "email",
      emailDelivered: true,
      message: "Your message was delivered successfully. I will contact you soon.",
    });
    } catch (error) {
      console.error("Contact form submission failed:", error);
      res.status(500).json({ error: "Failed to process your message. Please try again later." });
    }
  });

  app.use((error, _req, res, next) => {
    if (error?.message === "Origin not allowed by CORS") {
      res.status(403).json({ error: "Request origin is not allowed." });
      return;
    }

    if (error?.type === "entity.too.large") {
      res.status(413).json({ error: "Request payload is too large." });
      return;
    }

    if (error instanceof SyntaxError && "body" in error) {
      res.status(400).json({ error: "Invalid JSON payload." });
      return;
    }

    next(error);
  });

  app.use((error, _req, res, _next) => {
    console.error("Unhandled API error:", error);
    res.status(500).json({ error: "Unexpected server error. Please try again later." });
  });

  return app;
}
