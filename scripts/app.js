import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { initGSAP } from "./gsap.js";
import { getShowDate, startCountdown } from "./countdown.js";

// DOM
const showsContainer = document.getElementById("shows-container");
const countdownEl = document.getElementById("countdown");

// Pagination
let allFutureShows = [];
let currentIndex = 0;
const showsPerPage = 5;

// Helpers
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function isFutureShow(show) {
  return getShowDate(show) > new Date();
}

// Load shows functie
async function loadFutureShows() {
  showsContainer.innerHTML = "";
  if (countdownEl) countdownEl.textContent = "";

  const snapshot = await getDocs(collection(db, "shows"));

  allFutureShows = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(isFutureShow)
    .sort((a, b) => getShowDate(a) - getShowDate(b));

  if (allFutureShows.length === 0) {
    showsContainer.innerHTML = "<p>Er staan momenteel geen geplande shows.</p>";
    return;
  }

  // Countdown eerst volgende show
  const firstShow = allFutureShows[0];
  startCountdown(getShowDate(firstShow), countdownEl);

  currentIndex = 0;
  renderNextBatch();
}

// Render batches
function renderNextBatch() {
  const batch = allFutureShows.slice(currentIndex, currentIndex + showsPerPage);

  batch.forEach(show => {
    const li = document.createElement("li");
    li.classList.add("show-item");

    const dateObj = getShowDate(show);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("nl-NL", { month: "long" });

    li.innerHTML = `
      <h3>${capitalize(show.name)} - ${capitalize(show.place)}</h3>
      <div>
        <p>${day} ${capitalize(month)}</p>
        <p>${show.time ? show.time : "Tijd nog niet bekend"}</p>
      </div>
    `;

    showsContainer.appendChild(li);
  });

  currentIndex += showsPerPage;

  const existingBtn = document.getElementById("loadMoreBtn");
  if (existingBtn) existingBtn.remove();

  if (currentIndex < allFutureShows.length) {
    const btn = document.createElement("button");
    btn.id = "loadMoreBtn";
    btn.textContent = "Laad meer optredens";
    btn.addEventListener("click", renderNextBatch);
    showsContainer.appendChild(btn);
  }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  initGSAP();
  loadFutureShows();
});
