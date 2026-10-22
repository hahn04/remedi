const translations = {
  ko: {
    languageLabel: "언어 선택",
    menuOpen: "메뉴 열기"
  },
  en: {
    languageLabel: "Language",
    menuOpen: "Open menu"
  },
  zh: {
    languageLabel: "语言选择",
    menuOpen: "打开菜单"
  },
  ja: {
    languageLabel: "言語選択",
    menuOpen: "メニューを開く"
  }
};

const header = document.querySelector("[data-header]");
const progressBar = document.querySelector(".scroll-progress span");
const languageSelect = document.querySelector("#language-select");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll("[data-nav-target]");
const sectionItems = document.querySelectorAll("[data-section]");
const revealItems = document.querySelectorAll("[data-reveal]");
const countItems = document.querySelectorAll("[data-count]");
const backTop = document.querySelector(".back-top");
const menuThemeById = {
  top: "soft",
  intro: "soft",
  asymmetry: "green",
  posture: "taupe",
  diet: "line",
  bride: "brown",
  pain: "dark",
  reviews: "soft",
  contact: "line"
};

function getMenuThemeForElement(element) {
  if (!element) return "soft";
  if (element.classList.contains("hero-carousel")) return "soft";
  if (element.classList.contains("decoction-section")) return "green";
  if (element.id && menuThemeById[element.id]) return menuThemeById[element.id];
  if (document.body.dataset.page && menuThemeById[document.body.dataset.page]) return menuThemeById[document.body.dataset.page];
  return "soft";
}

function updateMenuTheme() {
  const targets = Array.from(
    document.querySelectorAll(
      ".hero-carousel, .hero, .intro-section, .asymmetry-section, .posture-section, .diet-section, .bride-section, .pain-section, .decoction-section, .reviews-section, .contact-section, .page-hero"
    )
  );

  if (!targets.length) {
    document.body.dataset.menuTheme = "soft";
    header?.setAttribute("data-menu-theme", "soft");
    return;
  }

  const headerBottom = header?.getBoundingClientRect().bottom || 0;
  const samplePoint = Math.min(window.innerHeight - 1, headerBottom + 8);
  let current = targets[0];

  for (const target of targets) {
    const rect = target.getBoundingClientRect();
    if (rect.top <= samplePoint && rect.bottom > samplePoint) {
      current = target;
      break;
    }

    if (rect.top <= samplePoint) current = target;
  }

  const theme = getMenuThemeForElement(current);
  document.body.dataset.menuTheme = theme;
  header?.setAttribute("data-menu-theme", theme);
}
function getPagePath(pathname) {
  return pathname.replace(/\/+$/, "").replace(/\/index(?:\.html)?$/, "").replace(/\.html$/, "") || "/";
}

function setCurrentPageNavigation() {
  const currentPath = getPagePath(window.location.pathname);

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    const linkUrl = new URL(href, window.location.href);
    const isCurrentPage = linkUrl.origin === window.location.origin && getPagePath(linkUrl.pathname) === currentPath;
    link.classList.toggle("is-active", isCurrentPage);
    if (isCurrentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

setCurrentPageNavigation();

function applyLanguage(language) {
  const dictionary = translations[language] || translations.ko;
  // Only interface labels are translated; the page content remains Korean.

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!key || !dictionary[key]) return;
    element.textContent = dictionary[key];
  });

  if (languageSelect && dictionary.languageLabel) {
    languageSelect.setAttribute("aria-label", dictionary.languageLabel);
  }

  try {
    localStorage.setItem("remedi-language", language);
  } catch {
    // The interface still works when browser storage is unavailable.
  }
}

function updateScrollState() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min((scrollTop / scrollable) * 100, 100) : 0;

  header?.classList.toggle("is-scrolled", scrollTop > 24);
  if (progressBar) progressBar.style.width = `${progress}%`;
  backTop?.classList.toggle("is-visible", scrollTop > 520);
  updateMenuTheme();
}

function animateCount(element) {
  if (element.dataset.counted === "true") return;

  const target = Number(element.dataset.count || 0);
  const duration = 650;
  const start = performance.now();
  element.dataset.counted = "true";

  function tick(now) {
    const ratio = Math.min((now - start) / duration, 1);
    element.textContent = String(Math.round(target * ratio));
    if (ratio < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

if (languageSelect) {
  const params = new URLSearchParams(window.location.search);
  let savedLanguage = null;
  try {
    savedLanguage = localStorage.getItem("remedi-language");
  } catch {
    // Use the URL preference or Korean when browser storage is unavailable.
  }
  const initialLanguage = params.get("lang") || savedLanguage || "ko";
  languageSelect.value = translations[initialLanguage] ? initialLanguage : "ko";
  applyLanguage(languageSelect.value);

  languageSelect.addEventListener("change", (event) => {
    applyLanguage(event.target.value);
  });
}

if (navToggle && navMenu) {
  function closeNavigation() {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !navMenu.classList.contains("is-open")) return;
    closeNavigation();
    if (navToggle.getClientRects().length) navToggle.focus();
  });
}

if (typeof window.IntersectionObserver === "function") {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.classList.remove("is-reveal-pending");
        entry.target.querySelectorAll?.("[data-count]").forEach(animateCount);
        if (entry.target.matches("[data-count]")) animateCount(entry.target);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8%" }
  );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
    item.classList.add("is-reveal-pending");
  });
  countItems.forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.dataset.navTarget === id);
        });
      });
    },
    { threshold: 0.36, rootMargin: "-18% 0px -48%" }
  );

  sectionItems.forEach((section) => sectionObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  countItems.forEach(animateCount);
}

backTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();

function initKakaoMapIfAvailable() {
  const panel = document.querySelector(".map-panel[data-map-address]");
  if (!panel || !window.kakao?.maps?.services) return;

  const address = panel.dataset.mapAddress;
  const geocoder = new kakao.maps.services.Geocoder();
  geocoder.addressSearch(address, (result, status) => {
    if (status !== kakao.maps.services.Status.OK || !result[0]) return;

    const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
    panel.innerHTML = "";
    const map = new kakao.maps.Map(panel, { center: coords, level: 3 });
    new kakao.maps.Marker({ map, position: coords });
  });
}

initKakaoMapIfAvailable();
function initHeroCarousel() {
  const track = document.querySelector("[data-carousel-track]");
  const prev = document.querySelector("[data-carousel-prev]");
  const next = document.querySelector("[data-carousel-next]");
  if (!track || !prev || !next) return;

  function getScrollAmount() {
    const slide = track.querySelector(".hero-slide");
    if (!slide) return track.clientWidth;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || "0");
    return slide.getBoundingClientRect().width + gap;
  }

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });
}

initHeroCarousel();
