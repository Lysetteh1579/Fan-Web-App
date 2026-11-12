export function initSpeakerFilters() {
  const grid = document.querySelector("#speaker-grid");
  const filters = [...document.querySelectorAll("[data-filter]")];
  if (!grid || filters.length === 0) return;

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      grid.querySelectorAll(".speaker-card").forEach((card) => {
        card.hidden = selected !== "all" && card.dataset.category !== selected;
      });
    });
  });
}
