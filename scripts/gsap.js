import { gsap } from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

export function initGSAP() {
  document.documentElement.classList.add("no-scroll");
  prepareText();

  const headerTl = gsap.timeline({
    onComplete: () => {
      document.documentElement.classList.remove("no-scroll");
      ScrollTrigger.refresh();
    }
  });

  headerTl
    // 1. De basis tekst ("STRAK PLAN" / "VOOR")
    .fromTo(".font-h1", 
      { autoAlpha: 0, scale: 0.9 }, 
      { autoAlpha: 1, scale: 1, duration: 1, ease: "expo.out" }
    )

    // 2. "MUZIEK" - Equalizer Effect
    // Letters springen op verschillende hoogtes in met een "overshoot"
    .from(".h1-muziek .char", {
      opacity: 0,
      y: (i) => (i % 2 === 0 ? 60 : 100), // Afwisselende hoogtes voor equalizer look
      scaleY: 3,                         // Stretch effect bij de start
      transformOrigin: "bottom",
      stagger: 0.05,
      duration: 0.8,
      ease: "power4.out",
    }, "-=0.7")

    // 3. "IEDEREEN" - Surround Sound Effect
    // Letters komen van wijd naar smal met een blur die wegtrekt
    .from(".h1-iedereen .char", {
      opacity: 0,
      filter: "blur(15px)",
      x: (i, targets) => 20 * (i - targets.length / 2), // Letters vliegen van buiten naar binnen
      scale: 1.5,
      stagger: {
        each: 0.04,
        from: "center" // Begint in het midden van het woord
      },
      duration: 1.2,
      ease: "expo.out",
    }, "-=0.6");

  // ScrollTrigger gedeelte voor de rest van de pagina
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
        ease: "power2.out"
      });
    }
  });
}

// initPopup blijft ongewijzigd...