const knownSections = new Set([
  "services",
  "projects",
  "experience",
  "about",
  "contact",
]);

export function normalizeSection(section: string): string {
  // Normalize different URL forms like "/Contact/" into "contact".
  return section.replace(/^\/+|\/+$/g, "").toLowerCase();
}

export function sectionFromPath(pathname: string): string | null {
  const section = normalizeSection(pathname);
  if (!section) {
    return "home";
  }
  return knownSections.has(section) ? section : null;
}

export function scrollToSection(section: string, behavior: ScrollBehavior = "smooth") {
  if (section === "home") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const target = document.getElementById(section);
  if (!target) {
    return;
  }

  // Fixed navbar overlaps content; this offset keeps section headings visible.
  const navbarOffset = 88;
  const top = target.getBoundingClientRect().top + window.scrollY - navbarOffset;
  window.scrollTo({ top, behavior });
}

export function navigateToSection(section: string) {
  const normalized = normalizeSection(section) || "home";
  const path = normalized === "home" ? "/" : `/${normalized}`;

  if (window.location.pathname !== path) {
    // Update URL without page reload and avoid #hash based routes.
    window.history.pushState({}, "", path);
  }

  scrollToSection(normalized, "smooth");
}

export function syncSectionFromCurrentPath() {
  const section = sectionFromPath(window.location.pathname);
  if (!section) {
    return;
  }

  requestAnimationFrame(() => {
    // Delay scroll until browser paints the section elements.
    scrollToSection(section, "auto");
  });
}
