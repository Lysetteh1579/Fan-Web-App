const focusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
const emailPattern = /^\S+@\S+\.\S+$/;

export function initRegistrationModal() {
  const modal = document.querySelector("#registration-modal");
  const dialog = modal?.querySelector(".registration-dialog");
  const form = document.querySelector("#registration-form");
  const confirmation = document.querySelector("#confirmation-state");
  const openers = [...document.querySelectorAll("[data-open-registration]")];
  const closeButton = modal?.querySelector(".modal-close");
  if (!modal || !dialog || !form || !confirmation) return;

  let previousFocus = null;
  const fields = [
    { input: form.elements.fullName, error: document.querySelector("#full-name-error"), message: "Enter your full name using at least 2 characters." },
    { input: form.elements.email, error: document.querySelector("#email-error"), message: "Enter a valid email address." },
    { input: form.elements.userRole, error: document.querySelector("#user-role-error"), message: "Select the role that best describes you." }
  ];

  function openModal() {
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    form.reset();
    fields.forEach((field) => setError(field, ""));
    form.hidden = false;
    confirmation.hidden = true;
    window.requestAnimationFrame(() => form.elements.fullName.focus());
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  function setError(field, message) {
    field.error.textContent = message;
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
  }

  openers.forEach((button) => button.addEventListener("click", openModal));
  closeButton?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll(focusableSelector)].filter((element) => !element.closest("[hidden]"));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  fields.forEach(({ input }, index) => {
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") setError(fields[index], "");
    });
    input.addEventListener("change", () => {
      if (input.getAttribute("aria-invalid") === "true") setError(fields[index], "");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = {
      fullName: form.elements.fullName.value.trim(),
      email: form.elements.email.value.trim(),
      userRole: form.elements.userRole.value
    };
    const errors = [
      values.fullName.length >= 2 ? "" : fields[0].message,
      emailPattern.test(values.email) ? "" : fields[1].message,
      values.userRole ? "" : fields[2].message
    ];
    fields.forEach((field, index) => setError(field, errors[index]));
    const firstInvalid = errors.findIndex(Boolean);
    if (firstInvalid !== -1) {
      fields[firstInvalid].input.focus();
      return;
    }
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
  });

  modal.addEventListener("close-registration", closeModal);
  confirmation.querySelector(".confirmation-close")?.addEventListener("click", closeModal);
}
