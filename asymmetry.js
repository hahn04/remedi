(() => {
  "use strict";

  const checklist = document.getElementById("self-check");
  if (!checklist) return;

  const inputs = Array.from(checklist.querySelectorAll('.guide-checklist input[type="checkbox"]'));
  const controls = checklist.querySelector("[data-check-controls]");
  const count = checklist.querySelector("[data-check-count]");
  const showButton = checklist.querySelector("[data-check-show]");
  const resetButton = checklist.querySelector("[data-check-reset]");
  const result = checklist.querySelector("#check-result");
  const resultTitle = checklist.querySelector("#check-result-title");
  const empty = checklist.querySelector("[data-check-empty]");
  const details = checklist.querySelector("[data-check-details]");
  const selectedList = checklist.querySelector("[data-check-selected]");
  const selectedDisclosure = checklist.querySelector(".guide-check-selected");
  const groups = Array.from(checklist.querySelectorAll("[data-check-group]"));
  const advice = Array.from(checklist.querySelectorAll("[data-check-advice]"));
  if (!inputs.length || !controls || !count || !showButton || !resetButton ||
      !result || !resultTitle || !empty || !details || !selectedList || !selectedDisclosure) return;

  function updateSummary() {
    const selected = inputs.filter((input) => input.checked);
    const values = new Set(selected.map((input) => input.value));
    count.textContent = `${inputs.length}개 중 ${selected.length}개 선택`;
    resetButton.disabled = selected.length === 0;
    empty.hidden = selected.length > 0;
    details.hidden = selected.length === 0;

    groups.forEach((group) => {
      const total = checklist.querySelector(`[data-check-total="${group.dataset.checkGroup}"]`);
      if (total) total.textContent = group.querySelectorAll('input[type="checkbox"]:checked').length;
    });

    // Show every relevant topic. Counts are a summary, never a severity score.
    advice.forEach((card) => {
      card.hidden = !card.dataset.checkAdvice.split(/\s+/).some((value) => values.has(value));
    });
    selectedList.replaceChildren(...selected.map((input) => {
      const item = document.createElement("li");
      item.textContent = input.closest("label").querySelector("span").textContent;
      return item;
    }));
  }

  inputs.forEach((input) => input.addEventListener("change", updateSummary));
  showButton.addEventListener("click", () => {
    updateSummary();
    result.hidden = false;
    resultTitle.focus({ preventScroll: true });
    result.scrollIntoView({ block: "start", behavior: "instant" });
  });
  resetButton.addEventListener("click", () => {
    inputs.forEach((input) => { input.checked = false; });
    selectedDisclosure.open = false;
    updateSummary();
    showButton.focus({ preventScroll: true });
  });
  window.addEventListener("pageshow", updateSummary);
  updateSummary();
  controls.hidden = false;
})();

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
