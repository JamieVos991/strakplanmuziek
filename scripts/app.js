import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

import { initGSAP } from "./gsap.js";
import { getShowDate, startCountdown } from "./countdown.js";

// Voorkomt dat de browser de scroll positie onthoudt bij het refreshen. Dit zorgt ervoor dat de gebruiker altijd bovenaan de pagina begint.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Forceer scroll naar boven bij laden en kort daarna
window.scrollTo(0, 0);
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);
});

// Selectors & Variablen 
const showsContainer = document.getElementById("shows-container");
const countdownEl = document.getElementById("countdown");

let allFutureShows = []; // Buffer voor alle gefilterde optredens uit de database
let currentIndex = 0;    // Houdt bij hoeveel shows er al getoond worden
const showsPerPage = 5;  // Aantal shows dat per keer (batch) wordt ingeladen

// Controleert of de datum van een show in de toekomst ligt
function isFutureShow(show) {
  return getShowDate(show) > new Date();
}


// Haalt de shows op uit Firebase en maakt de lijst
async function loadFutureShows() {

  // Maak de container leeg voor het geval er al oude data staat
  showsContainer.innerHTML = "";
  if (countdownEl) countdownEl.textContent = "";

  // Haal alle documenten op uit de 'shows' collectie in Firestore
  const snapshot = await getDocs(collection(db, "shows"));

  // Transformeer de data: voeg ID toe, filter op toekomst, en sorteer op datum (dichtstbijzijnde eerst)
  allFutureShows = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(isFutureShow)
    .sort((a, b) => getShowDate(a) - getShowDate(b));

  // Toon een melding als er geen shows zijn gevonden
  if (allFutureShows.length === 0) {
    showsContainer.innerHTML = "<p>Er staan momenteel geen geplande shows.</p>";
    return;
  }

  // Start de countdown timer voor de allereerste show in de lijst
  const firstShow = allFutureShows[0];
  startCountdown(getShowDate(firstShow), countdownEl);

  // Begin met het tonen van de eerste set (batch) shows
  currentIndex = 0;
  renderNextBatch();
}

// Tekent de lijst met shows op het scherm in groepjes.
function renderNextBatch() {

  // Selecteer een deel van de lijst op basis van de huidige index
  const batch = allFutureShows.slice(currentIndex, currentIndex + showsPerPage);

  batch.forEach(show => {
    const li = document.createElement("li");
    li.classList.add("show-item");

    const dateObj = getShowDate(show);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("nl-NL", { month: "long" });

    // Maakt de HTML voor elk item
    li.innerHTML = `
      <h3>${show.name} - ${show.place}</h3>
      <div>
        <p>${day} ${month}</p>
        <p>${show.time ? show.time : "Tijd nog niet bekend"}</p>
      </div>
    `;

    showsContainer.appendChild(li);
  });

  // Update de index voor de volgende batch
  currentIndex += showsPerPage;

  // Verwijder de oude "Laad meer" knop als die er was
  const existingBtn = document.getElementById("loadMoreBtn");
  if (existingBtn) existingBtn.remove();

  // Voeg een nieuwe "Laad meer" knop toe als er nog meer shows in de lijst staan
  if (currentIndex < allFutureShows.length) {
    const btn = document.createElement("button");
    btn.id = "loadMoreBtn";
    btn.textContent = "Laad meer optredens";
    btn.addEventListener("click", renderNextBatch);
    showsContainer.appendChild(btn);
  }
}

// Beveiligt het e-mailadres tegen simpele spam-bots door het samen te voegen bij een klik.
const mailLink = document.getElementById("contact-mail");

if (mailLink) {
  const user = "info";
  const domain = "strakplanmuziek.nl";

  mailLink.addEventListener("click", (e) => {
    e.preventDefault(); // Voorkom de standaard link actie

    const email = `${user}@${domain}`;
    window.location.href = `mailto:${email}?subject=Boeking Strak Plan`;
  });
}

// Start de functies zodra de structuur van de pagina geladen is.
document.addEventListener("DOMContentLoaded", () => {
  initGSAP();         
  loadFutureShows();  
});