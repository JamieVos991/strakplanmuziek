import { initPopup } from "./gsap.js";

document.addEventListener("DOMContentLoaded", () => {
  initPopup();
});

function startCountdown() {
  // Stel de datum in waar we naar aftellen (21 februari 2026)
  const countDownDate = new Date("Feb 21, 2026 00:00:00").getTime();

  // Update de countdown elke 1 seconde
  const x = setInterval(function() {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      // Tijd berekeningen voor dagen, uren, minuten en seconden
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Toon het resultaat in het element met id="countdown-timer"
      const timerElement = document.getElementById("countdown-timer");
      
      if (timerElement) {
          timerElement.innerHTML = days + "d " + hours + "u " + minutes + "m " + seconds + "s ";
      }

      // Als de countdown klaar is, toon dan een tekst
      if (distance < 0) {
          clearInterval(x);
          timerElement.innerHTML = "NU BESCHIKBAAR!";
          document.getElementById("popup-title").innerHTML = "Eindelijk buiten!";
      }
  }, 1000);
}

// Start de countdown zodra de pagina geladen is
document.addEventListener("DOMContentLoaded", startCountdown);