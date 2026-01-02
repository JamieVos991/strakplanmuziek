import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const welcomeMsg = document.getElementById("welcomeMsg");
const logoutBtn = document.getElementById("logoutBtn");
const upcomingList = document.getElementById("upcoming-shows");
const pastList = document.getElementById("past-shows");
const showForm = document.getElementById("showForm");

let editId = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "./login.html";
  } else {
    // welcomeMsg.textContent = `Welkom, ${user.email}`;
    loadShows();
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "./login.html";
  } catch (error) {
    console.error("Fout bij uitloggen:", error);
  }
});

function parseShowDate(show) {
  const [y, m, d] = show.date.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (show.time) {
    const [h, min] = show.time.split(":");
    date.setHours(h, min, 0, 0);
  } else {
    date.setHours(23, 59, 59, 999);
  }
  return date;
}

function isFuture(show) {
  return parseShowDate(show) > new Date();
}

showForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("show-name").value.trim();
  const place = document.getElementById("show-place").value.trim();
  const dateStr = document.getElementById("show-date").value; 
  const time = document.getElementById("show-time").value.trim();

  if (!name || !place || !dateStr) return;

  const dateObj = new Date(dateStr);
  const date_day = dateObj.getDate();
  const day_month = dateObj.toLocaleString('nl-NL', { month: 'long' });

  const showData = { name, place, date: dateStr, date_day, day_month, time };

  try {
    if (editId) {
      const docRef = doc(db, "shows", editId);
      await updateDoc(docRef, showData);
      editId = null;
    } else {
      await addDoc(collection(db, "shows"), showData);
    }

    showForm.reset();
    loadShows();
  } catch (error) {
    console.error("Fout bij opslaan show:", error);
  }
});

async function loadShows() {
  upcomingList.innerHTML = "";
  pastList.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "shows"));
    if (snapshot.empty) {
      upcomingList.innerHTML = "<li>Geen shows</li>";
      return;
    }

    const shows = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => parseShowDate(a) - parseShowDate(b));

    shows.forEach(show => {
      const li = document.createElement("li");
      const date = parseShowDate(show);
      const dateStr = `${show.date_day} ${show.day_month} ${show.time ?? ""}`;

      li.innerHTML = `
        <strong>${show.name}</strong> - ${show.place} <br/>
        <em>${dateStr}</em>
        <br/>
        ${isFuture(show) ? `<button class="edit" data-id="${show.id}">Bewerken</button>` : ""}
        <button class="delete" data-id="${show.id}">Verwijderen</button>
      `;

      if (isFuture(show)) upcomingList.appendChild(li);
      else pastList.appendChild(li);
    });

    document.querySelectorAll(".edit").forEach(btn => {
      btn.addEventListener("click", () => editShow(btn.dataset.id));
    });
    document.querySelectorAll(".delete").forEach(btn => {
      btn.addEventListener("click", () => deleteShow(btn.dataset.id));
    });

  } catch (error) {
    console.error("Fout bij laden shows:", error);
  }
}

async function editShow(id) {
  const docRef = doc(db, "shows", id);
  const snapshot = await getDocs(collection(db, "shows"));
  const show = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).find(s => s.id === id);

  if (!show) return;

  document.getElementById("show-name").value = show.name;
  document.getElementById("show-place").value = show.place;
  document.getElementById("show-date").value = show.date;
  document.getElementById("show-time").value = show.time ?? "";
  editId = id;
}

async function deleteShow(id) {
  if (!confirm("Weet je zeker dat je deze show wilt verwijderen?")) return;
  try {
    await deleteDoc(doc(db, "shows", id));
    loadShows();
  } catch (error) {
    console.error("Fout bij verwijderen show:", error);
  }
}
