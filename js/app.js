import { panelists } from "../data/speakers.js";
import { agendaSessions } from "../data/agenda.js";
import { initSpeakerFilters } from "./filter.js";
import { initRegistrationModal } from "./modal.js";
import { initCountdown } from "./timer.js";

function createSpeakerCard(person, index) {
  const initials = person.name.split(/\s+/).filter((part) => !["Dr.", "OD", "PhD"].includes(part)).slice(0, 2).map((part) => part[0]).join("");
  return `
    <article class="speaker-card" id="${person.id}" data-category="${person.category}" data-speaker-id="${person.id}">
      <div class="speaker-portrait" role="img" aria-label="Portrait unavailable for ${person.name}; initials placeholder">
        <span class="portrait-index">0${index + 1} / 04</span>
        <span class="speaker-initials" aria-hidden="true">${initials}</span>
      </div>
      <div class="speaker-card-body">
        <span class="speaker-category">${person.categoryLabel}</span>
        <h3 class="speaker-name">${person.name}</h3>
        <p class="speaker-title">${person.title}</p>
        <p class="speaker-bio">${person.bio}</p>
      </div>
    </article>`;
}

function renderSpeakers() {
  const grid = document.querySelector("#speaker-grid");
  if (!grid) return;
  grid.innerHTML = panelists.map(createSpeakerCard).join("");
}

function renderAgenda() {
  const list = document.querySelector("#agenda-list");
  if (!list) return;
  const renderSpeaker = (session) => {
    const assignedSpeaker = panelists.find((person) => person.id === session.speakerId)
      ?? panelists.find((person) => person.name === session.speaker);
    return assignedSpeaker
      ? `<a href="#${assignedSpeaker.id}">${assignedSpeaker.name}</a>`
      : session.speaker;
  };
  list.innerHTML = agendaSessions.map((session, index) => `
    <article class="agenda-item">
      <button class="agenda-trigger" type="button" aria-expanded="false" aria-controls="${session.id}-detail">
        <span class="agenda-number">0${index + 1}</span>
        <span class="agenda-label"><strong>${session.topic}</strong><small>${session.time}</small></span>
        <span class="agenda-toggle" aria-hidden="true">+</span>
      </button>
      <div class="agenda-detail" id="${session.id}-detail" hidden>
        <p><strong>Time</strong> &nbsp; ${session.time}</p>
        <p><strong>Topic</strong> &nbsp; ${session.topic}</p>
         <p><strong>Speaker</strong> &nbsp; ${renderSpeaker(session)}</p>
      </div>
    </article>`).join("");

  list.addEventListener("click", (event) => {
    const button = event.target.closest(".agenda-trigger");
    if (!button) return;
    const detail = document.getElementById(button.getAttribute("aria-controls"));
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    button.closest(".agenda-item").classList.toggle("is-open", !expanded);
    detail.hidden = expanded;
  });
}

function initNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-navigation");
  if (!toggle || !nav) return;
  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    nav.classList.remove("is-open");
  };
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    nav.classList.toggle("is-open", !isOpen);
  });
  nav.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", close));
  nav.querySelectorAll("[data-open-registration]").forEach((button) => button.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      close();
      toggle.focus();
    }
  });
}

renderSpeakers();
renderAgenda();
initSpeakerFilters();
initRegistrationModal();
initCountdown();
initNavigation();
