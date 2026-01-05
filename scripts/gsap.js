import { gsap } from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initGSAP() {
  gsap.set("h1", { autoAlpha: 0, y: 100 });

  gsap.to("h1", {
    autoAlpha: 1,
    y: 0,
    duration: 1.2,
    ease: "power4.out",
  });

  gsap.fromTo(
    "h1 .h1-muziek",
    { autoAlpha: 0, y: 100 },
    {
      autoAlpha: 1,
      y: 0,
      delay: 0.2,
      duration: 0.8,
      ease: "power3.out",
    }
  );

  gsap.fromTo(
    "h1 .h1-voor",
    { autoAlpha: 0, y: 50 },
    {
      autoAlpha: 1,
      y: 0,
      delay: 0.4,
      duration: 1,
      ease: "power3.out",
    }
  );
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
