import { gsap } from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Splitst tekst op in individuele letters voor de span-animaties.
 */
const prepareText = () => {
  const selectors = [".h1-muziek", ".h1-iedereen"];
  selectors.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
      const text = el.innerText.trim();
      el.innerHTML = text
        .split("")
        .map(letter => `<span class="char" style="display: inline-block; will-change: transform, filter;">${letter === " " ? "&nbsp;" : letter}</span>`)
        .join("");
    }
  });
};

/**
 * Initialiseert alle GSAP animaties (Intro, Vinyl & Scroll)
 */
export function initGSAP() {
  // Blokkeer scrollen tijdens de introductie
  document.documentElement.classList.add("no-scroll");
  
  prepareText();

  // --- 1. Oneindig draaiende vinylplaat ---
  const vinyl = document.getElementById("vinyl");
  if (vinyl) {
    // Gebruik gsap.set om hem direct 50% omlaag te duwen (zoals je CSS deed)
    gsap.set(vinyl, { yPercent: 50 });
  
    // Start de rotatie
    gsap.to(vinyl, {
      rotation: 360,
      duration: 5,
      repeat: -1,
      ease: "none"
    });
  }

  // --- 2. De Intro Animatie (Timeline) ---
  const headerTl = gsap.timeline({
    onComplete: () => {
      // Zet scrollen weer aan en refresh triggers
      document.documentElement.classList.remove("no-scroll");
      ScrollTrigger.refresh();
    }
  });

  headerTl
    // Stap A: De algemene H1 titel komt binnen
    .fromTo(".font-h1", 
      { autoAlpha: 0, y: 30 }, 
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power4.out" }
    )

    // Stap B: "MUZIEK" letters met Equalizer effect
    .from(".h1-muziek .char", {
      opacity: 0,
      y: (i) => (i % 2 === 0 ? 60 : 100), // Verschillende hoogtes
      scaleY: 3,                         // Stretch
      transformOrigin: "bottom",
      stagger: 0.05,
      duration: 0.8,
      ease: "power4.out",
    }, "-=0.6")

    // Stap C: "IEDEREEN" letters met Surround Sound effect
    .from(".h1-iedereen .char", {
      opacity: 0,
      filter: "blur(10px)",
      x: (i, targets) => 25 * (i - targets.length / 2), // Vliegt van buiten naar binnen
      scale: 1.5,
      stagger: {
        each: 0.04,
        from: "center"
      },
      duration: 1.2,
      ease: "expo.out",
    }, "-=0.7");

  // --- 3. ScrollTrigger animaties voor secties verderop ---
 // --- 3. ScrollTrigger animaties voor secties verderop ---
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
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        // Voeg deze regels toe:
        onStart: () => {
          element.style.pointerEvents = "none"; // Blokkeer interactie
        },
        onComplete: () => {
          element.style.pointerEvents = "auto"; // Zet interactie weer aan
        }
      });
    }
  });
}

/**
 * Initialiseert de Promo Popup met LocalStorage check
 */
export function initPopup() {
  const popup = document.getElementById("promo-popup");
  const closeBtn = document.getElementById("popup-close");
  const STORAGE_KEY = "promoPopupClosed";

  if (!popup) return;

  // Check of de gebruiker de popup al eerder heeft gesloten
  if (!localStorage.getItem(STORAGE_KEY)) {
    // Toon de popup na een vertraging van 3.5 seconden
    setTimeout(() => {
      popup.classList.add("is-visible");

      gsap.fromTo(popup, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }, 3500);
  }

  // Event listener voor het sluiten
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      gsap.to(popup, {
        y: 40,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          popup.classList.remove("is-visible");
          localStorage.setItem(STORAGE_KEY, "true"); // Onthoud dat de popup gesloten is
        },
      });
    });
  }
}