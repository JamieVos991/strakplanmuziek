import { gsap } from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import { isShowToday } from "./countdown.js";

gsap.registerPlugin(ScrollTrigger);

const prepareText = () => {
  const selectors = [".h1-muziek", ".h1-iedereen"];
  selectors.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
      const text = el.innerText.trim();
      el.innerHTML = text
        .split("")
        .map(letter => `<span class="char" style="display: inline-block;">${letter === " " ? " " : letter}</span>`)
        .join("");
    }
  });
};

export function initGSAP() {
  document.documentElement.classList.add("no-scroll");
  prepareText();

  // Vinyl rotatie
  const vinyl = document.getElementById("vinyl");
  if (vinyl) {
    gsap.set(vinyl, { yPercent: 50 });
    gsap.to(vinyl, { rotation: 360, duration: 5, repeat: -1, ease: "none" });
  }

  // Intro Timeline
  const headerTl = gsap.timeline({
    onComplete: () => {
      document.documentElement.classList.remove("no-scroll");
      ScrollTrigger.refresh();
    }
  });

  headerTl
    .fromTo(".font-h1", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8 })
    .from(".h1-muziek .char", { opacity: 0, y: 60, stagger: 0.05 }, "-=0.6")
    .from(".h1-iedereen .char", { opacity: 0, scale: 1.5, stagger: { each: 0.04, from: "center" } }, "-=0.7");

  // Sectie Fade-ups
  ['#ul-gsap', '#ul-gsap-overons'].forEach((selector) => {
    const el = document.querySelector(selector);
    if (el) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%" },
        y: 60, opacity: 0, duration: 1
      });
    }
  });

  // Confetti trigger
  const countdownEl = document.getElementById("countdown");
  if (countdownEl) {
    ScrollTrigger.create({
      trigger: countdownEl,
      start: "top 70%",
      onEnter: () => {
        if (isShowToday) launchConfetti();
      }
    });
  }
}

function launchConfetti() {
  const end = Date.now() + 400;
  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff0000', '#ffffff', '#00ff00'] });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff0000', '#ffffff', '#00ff00'] });
    if (Date.now() < end) requestAnimationFrame(frame);
  }());
}