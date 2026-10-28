(() => {
  "use strict";

  const navigation = document.querySelector("[data-guide-nav]");
  if (!navigation) return;

  const root = document.documentElement;
  const pageHeader = document.querySelector("[data-header]");
  const links = Array.from(navigation.querySelectorAll('a[href^="#"]'));
  const entries = links
    .map((link) => ({
      link,
      section: document.getElementById(link.getAttribute("href").slice(1))
    }))
    .filter((entry) => entry.section?.matches("section[data-guide-section]"));

  if (!entries.length) return;

  let headerHeight = 0;
  let navigationHeight = 0;
  let framePending = false;

  function measureOffsets() {
    headerHeight = Math.ceil(pageHeader?.getBoundingClientRect().height || 0);
    navigationHeight = Math.ceil(navigation.getBoundingClientRect().height);
    root.style.setProperty("--header-offset", `${headerHeight}px`);
    root.style.setProperty("--guide-nav-height", `${navigationHeight}px`);
  }

  function updateCurrentSection() {
    framePending = false;
    const readingLine = headerHeight + navigationHeight + 25;
    let current = entries[0];

    for (const entry of entries) {
      if (entry.section.getBoundingClientRect().top <= readingLine) current = entry;
    }

    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= root.scrollHeight - 2) {
      current = entries[entries.length - 1];
    }

    links.forEach((link) => {
      if (link === current.link) {
        if (link.getAttribute("aria-current") !== "location") {
          link.setAttribute("aria-current", "location");
        }
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateCurrentSection);
  }

  function updateLayout() {
    measureOffsets();
    scheduleUpdate();
  }

  measureOffsets();
  updateCurrentSection();

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(updateLayout);
    if (pageHeader) observer.observe(pageHeader);
    observer.observe(navigation);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", updateLayout);
  window.addEventListener("hashchange", scheduleUpdate);
  window.addEventListener("pageshow", updateLayout);
  document.fonts?.ready.then(updateLayout);

  // Preserve native anchor links, history, keyboard behavior and restored scrolling.
  const initialHash = window.location.hash;
  const initialTarget = document.getElementById(initialHash.slice(1));
  const navigationType = window.performance?.getEntriesByType?.("navigation")?.[0]?.type;
  if (!initialTarget?.matches("section[data-guide-section], .guide-subsection[id], .guide-faq article[id], .guide-sources li[id]") ||
      navigationType !== "navigate") return;

  let userInteracted = false;
  const interactionEvents = ["pointerdown", "touchstart", "wheel", "keydown"];
  const stopInitialCorrection = () => { userInteracted = true; };
  interactionEvents.forEach((eventName) => {
    window.addEventListener(eventName, stopInitialCorrection, { passive: true, capture: true });
  });

  function correctInitialAnchor() {
    const fontsReady = document.fonts?.ready || Promise.resolve();
    fontsReady.then(() => {
      window.requestAnimationFrame(() => {
        interactionEvents.forEach((eventName) => {
          window.removeEventListener(eventName, stopInitialCorrection, true);
        });
        updateLayout();
        if (userInteracted || window.location.hash !== initialHash) return;

        // Late font/header sizing can hide a direct fragment's heading.
        const visibleTop = headerHeight + navigationHeight + 24;
        if (initialTarget.getBoundingClientRect().top < visibleTop - 2) {
          initialTarget.scrollIntoView({ block: "start", behavior: "instant" });
        }
      });
    });
  }

  if (document.readyState === "complete") {
    correctInitialAnchor();
  } else {
    window.addEventListener("load", correctInitialAnchor, { once: true });
  }
})();
