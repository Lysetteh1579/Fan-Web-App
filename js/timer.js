export function initCountdown() {
  const countdown = document.querySelector("#countdown");
  const liveMessage = document.querySelector("#live-message");
  if (!countdown || !liveMessage) return;

  const targetTime = Date.UTC(2026, 11, 1, 14, 0, 0); // December 1, 2026, 09:00 EST (UTC−5)
  const units = {
    days: countdown.querySelector('[data-time="days"]'),
    hours: countdown.querySelector('[data-time="hours"]'),
    minutes: countdown.querySelector('[data-time="minutes"]'),
    seconds: countdown.querySelector('[data-time="seconds"]')
  };
  let interval;

  function update() {
    const remaining = targetTime - Date.now();
    if (remaining <= 0) {
      window.clearInterval(interval);
      countdown.hidden = true;
      liveMessage.hidden = false;
      return;
    }
    const totalSeconds = Math.floor(remaining / 1000);
    units.days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
    units.hours.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
    units.minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    units.seconds.textContent = String(totalSeconds % 60).padStart(2, "0");
  }

  update();
  interval = window.setInterval(update, 1000);
}
