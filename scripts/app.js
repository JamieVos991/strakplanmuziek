// ===================
// GSAP ANIMATIONS
// ===================
gsap.from("h1", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
  });
  
  gsap.from("h1 .h1-muziek", {
    y: 100,
    opacity: 0,
    delay: 0.2,
    duration: 0.8,
    ease: "power3.out",
  });
  
  gsap.from("h1 .h1-voor", {
    y: 50,
    opacity: 0,
    delay: 0.4,
    duration: 1,
    ease: "power3.out",
  });
  
  gsap.from("section:nth-of-type(3) p, section:nth-of-type(3) a, section:nth-of-type(3) h2", {
    scrollTrigger: {
      trigger: "section:nth-of-type(3) p",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });
  
  // ===================
  // FIREBASE (CDN)
  // ===================
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
  import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
  
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
  
  // ===================
  // SHOWS LOGIC
  // ===================
  const showsContainer = document.getElementById("shows-container");
  
  async function loadFutureShows() {
    showsContainer.innerHTML = "";
  
    const showsRef = collection(db, "shows");
    const snapshot = await getDocs(showsRef);
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    let hasFutureShows = false;
  
    snapshot.forEach(doc => {
      const show = doc.data();
      const showDate = new Date(show.date); // YYYY-MM-DD
  
      if (showDate >= today) {
        hasFutureShows = true;
  
        const el = document.createElement("li");
        el.classList.add("show-item");
        el.innerHTML = `
  <h3>${show.date_day} ${show.day_month} - ${show.place}</h3>
  <p> ${show.time && show.time.trim() !== "" ? show.time : "Tijd onbekend"}</p>
`;

  
        showsContainer.appendChild(el);
  
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    });
  
    if (!hasFutureShows) {
      const p = document.createElement("p");
      p.textContent = "Geen shows";
      showsContainer.appendChild(p);
    }
  }
  
  document.addEventListener("DOMContentLoaded", loadFutureShows);
  