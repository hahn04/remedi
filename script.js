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
  if (element.classList.contains("hero-carousel")) return "dark";
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
function setCurrentPageNavigation() {
  const currentFile = window.location.pathname.split("/").filter(Boolean).pop() || "index.html";

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    const linkUrl = new URL(href, window.location.href);
    const linkFile = linkUrl.pathname.split("/").filter(Boolean).pop() || "index.html";
    link.classList.toggle("is-active", linkFile === currentFile);
  });
}

setCurrentPageNavigation();

function applyLanguage(language) {
  const dictionary = translations[language] || translations.ko;
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!key || !dictionary[key]) return;
    element.textContent = dictionary[key];
  });

  if (languageSelect && dictionary.languageLabel) {
    languageSelect.setAttribute("aria-label", dictionary.languageLabel);
  }

  localStorage.setItem("remedi-language", language);
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
  const savedLanguage = localStorage.getItem("remedi-language");
  const initialLanguage = params.get("lang") || savedLanguage || "ko";
  languageSelect.value = translations[initialLanguage] ? initialLanguage : "ko";
  applyLanguage(languageSelect.value);

  languageSelect.addEventListener("change", (event) => {
    applyLanguage(event.target.value);
  });
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll?.("[data-count]").forEach(animateCount);
        if (entry.target.matches("[data-count]")) animateCount(entry.target);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8%" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
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
const eventPopupImages = [
  {
    src: "assets/event_aug1.jpeg",
    alt: "리메디 한의원 8월 이벤트 안내 1"
  },
  {
    src: "assets/event_aug2.jpeg",
    alt: "리메디 한의원 8월 이벤트 안내 2"
  }
];

const eventReservationUrl = "https://m.booking.naver.com/booking/16/bizes/1692308?theme=place&lang=ko&area=pll";
const eventPopupStorageKey = "remedi-event-aug-2026-hidden-date";

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isEventPopupHiddenToday() {
  try {
    return localStorage.getItem(eventPopupStorageKey) === getLocalDateKey();
  } catch {
    return false;
  }
}

function hideEventPopupToday() {
  try {
    localStorage.setItem(eventPopupStorageKey, getLocalDateKey());
  } catch {
    // Storage can be blocked in some privacy modes; closing still works.
  }
}

function initEventPopup() {
  if (!eventPopupImages.length || isEventPopupHiddenToday()) return;

  const popup = document.createElement("aside");
  popup.className = "event-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");
  popup.setAttribute("aria-labelledby", "event-popup-title");

  popup.innerHTML = `
    <div class="event-popup-panel">
      <div class="event-popup-head">
        <div>
          <p class="event-popup-kicker">re:medi event</p>
          <h2 id="event-popup-title">8월 이벤트 안내</h2>
        </div>
        <button type="button" class="event-popup-close" data-event-close aria-label="이벤트 팝업 닫기">닫기</button>
      </div>
      <div class="event-popup-stage">
        <div class="event-popup-slides">
          ${eventPopupImages
            .map(
              (image, index) => `
                <a class="event-popup-slide${index === 0 ? " is-active" : ""}" href="${eventReservationUrl}" target="_blank" rel="noopener" data-event-slide>
                  <img src="${image.src}" alt="${image.alt}" />
                </a>
              `
            )
            .join("")}
        </div>
        <button type="button" class="event-popup-nav event-popup-prev" data-event-prev aria-label="이전 이벤트 이미지">&lt;</button>
        <button type="button" class="event-popup-nav event-popup-next" data-event-next aria-label="다음 이벤트 이미지">&gt;</button>
      </div>
      <div class="event-popup-footer">
        <div class="event-popup-dots" aria-label="이벤트 이미지 선택">
          ${eventPopupImages
            .map(
              (_, index) => `<button type="button" class="event-popup-dot${index === 0 ? " is-active" : ""}" data-event-dot="${index}" aria-label="${index + 1}번째 이벤트 이미지 보기"></button>`
            )
            .join("")}
        </div>
        <div class="event-popup-actions">
          <button type="button" class="event-popup-today" data-event-today>오늘 하루 보지 않기</button>
          <a class="event-popup-book" href="${eventReservationUrl}" target="_blank" rel="noopener">예약하기</a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
  document.body.classList.add("has-event-popup");

  const slides = Array.from(popup.querySelectorAll("[data-event-slide]"));
  const dots = Array.from(popup.querySelectorAll("[data-event-dot]"));
  const closeButton = popup.querySelector("[data-event-close]");
  const todayButton = popup.querySelector("[data-event-today]");
  let currentIndex = 0;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });
  }

  function closePopup() {
    popup.classList.remove("is-visible");
    document.body.classList.remove("has-event-popup");
    document.removeEventListener("keydown", handleKeydown);
    window.setTimeout(() => popup.remove(), 180);
  }

  function handleKeydown(event) {
    if (event.key === "Escape") closePopup();
    if (event.key === "ArrowLeft") showSlide(currentIndex - 1);
    if (event.key === "ArrowRight") showSlide(currentIndex + 1);
  }

  popup.querySelector("[data-event-prev]")?.addEventListener("click", () => showSlide(currentIndex - 1));
  popup.querySelector("[data-event-next]")?.addEventListener("click", () => showSlide(currentIndex + 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => showSlide(Number(dot.dataset.eventDot || 0)));
  });
  closeButton?.addEventListener("click", closePopup);
  todayButton?.addEventListener("click", () => {
    hideEventPopupToday();
    closePopup();
  });
  popup.addEventListener("click", (event) => {
    if (event.target === popup) closePopup();
  });
  document.addEventListener("keydown", handleKeydown);

  window.setTimeout(() => {
    popup.classList.add("is-visible");
    closeButton?.focus({ preventScroll: true });
  }, 80);
}

initEventPopup();
