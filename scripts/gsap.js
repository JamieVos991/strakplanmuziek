import { gsap } from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initGSAP() {
  document.documentElement.classList.add("no-scroll");

  const headerTl = gsap.timeline({
    onComplete: () => {
      document.documentElement.classList.remove("no-scroll");
      ScrollTrigger.refresh();
    }
  });

  headerTl
    .fromTo("h1", { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power4.out" })
    .fromTo("h1 .h1-muziek", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.8")
    .fromTo("h1 .h1-voor", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, "-=0.6")
    .fromTo("h1 .h1-iedereen", { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.2 }, "-=0.5");

  const fadeUpElements = ['#ul-gsap', '#ul-gsap-overons'];

  fadeUpElements.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: "top 85%", 
          toggleActions: "play none none none",
        },
        y: 100,
        opacity: 0,
        duration: .8,
        ease: "power2.out",
      });
    }
  });
}

export function initPopup() {
  const popup = document.getElementById("promo-popup");
  const closeBtn = document.getElementById("popup-close");
  const STORAGE_KEY = "promoPopupClosed";

  if (!popup || localStorage.getItem(STORAGE_KEY)) return;

  setTimeout(() => {
    popup.classList.add("is-visible");
    gsap.to(popup, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    });
  }, 3500);

  closeBtn?.addEventListener("click", () => {
    gsap.to(popup, {
      y: 40,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        popup.classList.remove("is-visible");
        localStorage.setItem(STORAGE_KEY, "true");
      },
    });
  });
}