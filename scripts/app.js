import { gsap } from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.from("h1", { y: 100, opacity: 0, duration: 1.2, ease: "power4.out" });
gsap.from("h1 .h1-muziek", { y: 100, opacity: 0, delay: 0.2, duration: 0.8, ease: "power3.out" });
gsap.from("h1 .h1-voor", { y: 50, opacity: 0, delay: 0.4, duration: 1, ease: "power3.out" });

gsap.from("section:nth-of-type(3) p, section:nth-of-type(3) a, section:nth-of-type(3) h2", {
  scrollTrigger: {
    trigger: "section:nth-of-type(3) p",
    start: "top 90%",
    toggleActions: "play none none none",
  },
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
});

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAhE4fixjgNtBGCyr_Lz7M5HPQ4YfQeaDQ",
  authDomain: "strakplan-e0953.firebaseapp.com",
  projectId: "strakplan-e0953",
  storageBucket: "strakplan-e0953.firebasestorage.app",
  messagingSenderId: "1033656552155",
  appId: "1:1033656552155:web:74106be10a92249f6d1afe",
  measurementId: "G-EBEC1QRRYW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const showsContainer = document.getElementById("shows-container");

async function loadFutureShows() {
    console.log("loadFutureShows gestart");
    showsContainer.innerHTML = "";
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log("Vandaag:", today);
  
    // Ophalen van ALLE shows, omdat strings niet werken met 'where'
    const snapshot = await getDocs(collection(db, "shows"));
    console.log("Snapshot:", snapshot);
  
    // Filter de shows die in de toekomst liggen
    const futureShows = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(show => {
        let showDate;
        if (show.date?.toDate) {
          // Timestamp
          showDate = show.date.toDate();
        } else {
          // String
          showDate = new Date(show.date);
        }
        return showDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // chronologisch
      .slice(0, 5); // max 5
  
    if (futureShows.length === 0) {
      console.log("Geen shows gevonden");
      const p = document.createElement("p");
      p.textContent = "Geen shows";
      showsContainer.appendChild(p);
      return;
    }
  
    // Shows toevoegen aan de DOM
    futureShows.forEach(show => {
      console.log("Show document:", show);
  
      const artikel = document.createElement("li");
      artikel.classList.add("show-item");
  
      artikel.innerHTML = `
        <h3>${show.place}</h3>
        <div>
          <p>${show.date_day} ${show.day_month}</p>
          <p>${show.time && show.time.trim() !== "" ? show.time : "Tijd is nog niet bekend"}</p>
        </div>
      `;
  
      showsContainer.appendChild(artikel);
    });
  }
  
  

document.addEventListener("DOMContentLoaded", loadFutureShows);


// ================= POPUP =================

const popup = document.getElementById("promo-popup");
const sluitKnop = document.getElementById("popup-close");

const STORAGE_KEY = "promoPopupClosed";

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

sluitKnop.addEventListener("click", () => {
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
