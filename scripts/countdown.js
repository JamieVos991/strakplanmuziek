export function getShowDate(show) {
    let baseDate;
  
    if (show.date?.toDate) {
      baseDate = show.date.toDate();
    } else {
      baseDate = new Date(show.date + "T00:00:00");
    }
  
    if (show.time && show.time.includes(":")) {
      const [h, m] = show.time.split(":").map(Number);
      baseDate.setHours(h, m, 0, 0);
    } else {
      baseDate.setHours(12, 0, 0, 0);
    }
  
    return baseDate;
  }
  
  export function startCountdown(targetDate, element) {
    if (!element) return;
  
    function stripTime(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
  
    function update() {
      const now = new Date();
  
      const today = stripTime(now);
      const showDay = stripTime(targetDate);
  
      const diffDays = Math.round(
        (showDay - today) / (1000 * 60 * 60 * 24)
      );
  
      if (diffDays === 0) {
        element.textContent = "🎉 Vandaag speelt Strak Plan!";
        return;
      }
  
      if (diffDays === 1) {
        element.textContent = "⏳ Morgen speelt Strak Plan!";
        return;
      }
  
      if (diffDays > 1) {
        element.textContent = `⏳ Volgende show over ${diffDays} dagen`;
        return;
      }
  
      element.textContent = "";
    }
  
    update();
    setInterval(update, 60 * 1000);
  }
  