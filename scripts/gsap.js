import { gsap } from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initGSAP() {
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

  gsap.from(
    "section:nth-of-type(3) p, section:nth-of-type(3) a, section:nth-of-type(3) h2",
    {
      scrollTrigger: {
        trigger: "section:nth-of-type(3) p",
        start: "top 90%",
        toggleActions: "play none none none",
      },
      y: 50,
      autoAlpha: 0,
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
