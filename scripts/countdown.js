 // Zet de show data uit de database om naar JavaScript Date object.
 // Werkt zowel met Firebase Timestamps als met standaard datum strings.
export function getShowDate(show) {
  let baseDate;

  // Controleer of de datum een Firebase Timestamp is (met .toDate() methode)
  if (show.date?.toDate) {
    baseDate = show.date.toDate();
  } else {
    // Zo niet, ga uit van een string (bijv. "2024-12-31") en maak er een Date van
    baseDate = new Date(show.date + "T00:00:00");
  }

  // Als er een specifieke tijd is ingevuld (bijv. "20:30"), voeg deze toe aan de datum
  if (show.time && show.time.includes(":")) {
    const [h, m] = show.time.split(":").map(Number);
    baseDate.setHours(h, m, 0, 0);
  } else {
    // Geen tijd bekend? Zet de tijd standaard op 12:00 's middags
    baseDate.setHours(12, 0, 0, 0);
  }

  return baseDate;
}

// Start een timer die de tekst in het element bijwerkt op basis van de resterende dagen.
export function startCountdown(targetDate, element) {
  // Stop de functie als het HTML element niet bestaat
  if (!element) return;

   // Hulpfunctie om alleen de datum te vergelijken (jaar, maand, dag)
   // zonder dat de exacte tijd (uren/minuten) de berekening beïnvloedt.
  function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function update() {
    const now = new Date();

    const today = stripTime(now);
    const showDay = stripTime(targetDate);

    // Bereken het verschil in dagen door het verschil in milliseconden te delen
    const diffDays = Math.round(
      (showDay - today) / (1000 * 60 * 60 * 24)
    );

    // Logica voor de tekst
    if (diffDays === 0) {
      element.textContent = "🎉 Vandaag speelt Strak Plan!";
      return;
    }

    if (diffDays === 1) {
      element.textContent = "⏳ Morgen speelt Strak Plan!";
      return;
    }

    if (diffDays > 1) {
      element.textContent = `⏳ Volgende optreden over ${diffDays} dagen`;
      return;
    }

    // Als de show al is geweest, toon dan niets in het countdown veld
    element.textContent = "";
  }

  // Voer de update direct uit bij aanroepen
  update();

  // Herhaal de controle elke minuut (60.000 ms) voor het geval de dag verspringt
  setInterval(update, 60 * 1000);
}