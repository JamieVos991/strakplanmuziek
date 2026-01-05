import { gsap } from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initGSAP() {
  // Lock scroll immediately
  document.documentElement.classList.add("no-scroll");

  // Run animations
  gsap.fromTo(
    "h1",
    { y: 100, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 1.2,
      ease: "power4.out",
    }
  );

  gsap.fromTo(
    "h1 .h1-muziek",
    { y: 100, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      delay: 0.2,
      duration: 0.8,
      ease: "power3.out",
    }
  );

  gsap.fromTo(
    "h1 .h1-voor",
    { y: 50, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      delay: 0.4,
      duration: 1,
      ease: "power3.out",
    }
  );

  setTimeout(() => {
    document.documentElement.classList.remove("no-scroll");
  }, 700); 
}





export function initPopup() {
  const popup = document.getElementById("promo-popup");
  const closeBtn = document.getElementById("popup-close");
  const STORAGE_KEY = "promoPopupClosed";

  if (!popup) return;

  if (!localStorage.getItem(STORAGE_KEY)) {
    setTimeout(() => {
      popup.classList.add("is-visible");

      gsap.to(popup, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      });
    }, 3500);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
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
}
