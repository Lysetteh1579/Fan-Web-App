# Lash Pro Summit 2026

A responsive, single-page event portal for a virtual global masterclass bringing artistry, ocular health, chemistry, and business strategy together.

## Local preview

This project uses plain HTML, CSS, and vanilla JavaScript ES modules. Because ES modules are loaded by the browser, serve the project over HTTP rather than opening `index.html` directly.

From the project root, run either:

```sh
python3 -m http.server 8000
```

or, if Python is unavailable:

```sh
npx serve .
```

Visit `http://localhost:8000` (or the URL printed by `serve`). No build step or dependencies are required.

## Test interactions

- Use the header links to scroll to Speakers, Agenda, and About; at mobile widths, open and close the menu with its button.
- Select each speaker category, then select **All**, to check the directory filters without a page reload.
- Expand and collapse agenda rows. Schedule details intentionally remain “To be announced” until verified content is supplied.
- Open **Claim Your Seat** and submit empty/invalid values to see inline errors and focus movement. Then submit a valid name, email, and role to see the demo confirmation. Also test Escape, overlay click, Tab focus trapping, and focus restoration.
- The countdown targets December 1, 2026 at 09:00 EST. Its date is configured in `js/timer.js`.
- Resize to 320px, 768px, 1024px, and 1440px and check that no horizontal scrollbar appears. Enable reduced motion in the operating system to confirm motion is suppressed.

## Content notes

Speaker information is copied from the supplied specification. Speaker image paths are retained in the data, but no image files were provided, so cards use initials and a designed gradient rather than requesting unavailable portraits. The agenda has four TBD records because no session details were supplied. Social links are not fabricated; the footer notes that they will be announced. Registration is a front-end demonstration and does not send or store data.
