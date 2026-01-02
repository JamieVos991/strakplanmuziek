import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
