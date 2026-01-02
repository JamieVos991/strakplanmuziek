import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");
const togglePassword = document.getElementById("togglePassword");

togglePassword?.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Ingelogd:", userCredential.user);

    window.location.href = "../dashboard.html";

  } catch (error) {
    console.error(error);
    switch (error.code) {
      case "auth/invalid-email":
        errorMsg.textContent = "Ongeldig e-mailadres.";
        break;
      case "auth/user-not-found":
        errorMsg.textContent = "Gebruiker niet gevonden.";
        break;
      case "auth/wrong-password":
        errorMsg.textContent = "Ongeldig wachtwoord.";
        break;
      default:
        errorMsg.textContent = "Er is een fout opgetreden. Probeer het opnieuw.";
    }
  }
});
