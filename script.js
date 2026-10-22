const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const scrollProgress = document.querySelector(".scroll-progress span");
const heroArt = document.querySelector(".hero-art");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setMenuExpanded = (expanded) => {
  menuToggle.setAttribute("aria-expanded", String(expanded));
  menuToggle.querySelector(".sr-only").textContent = expanded ? "Tutup navigasi" : "Buka navigasi";
  siteNav.classList.toggle("is-open", expanded);
};

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuExpanded(!isExpanded);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuExpanded(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuExpanded(false);
    menuToggle.focus();
  }
});

const updateScrollEffects = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  heroArt.style.setProperty("--parallax-y", `${Math.min(window.scrollY * 0.08, 48)}px`);
};

let scrollFrame = 0;
window.addEventListener("scroll", () => {
  if (!scrollFrame) {
    scrollFrame = window.requestAnimationFrame(() => {
      updateScrollEffects();
      scrollFrame = 0;
    });
  }
}, { passive: true });
updateScrollEffects();

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealTargets = document.querySelectorAll(
    ".intro-content, .stats-row, .section-heading, .work-card, .quote-band, .approach-layout, .closing .eyebrow, .closing h2, .closing > p, .closing-link"
  );
  document.body.classList.add("reveal-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("p");

document.querySelectorAll(".image-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    lightboxImage.src = trigger.dataset.image;
    lightboxImage.alt = trigger.querySelector("img").alt;
    lightboxCaption.textContent = trigger.dataset.caption;
    lightbox.showModal();
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760 && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuExpanded(false);
  }
});
