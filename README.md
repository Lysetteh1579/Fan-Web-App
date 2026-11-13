# Lash Pro Summit 2026

A responsive event site and member portal for a virtual global masterclass bringing artistry, ocular health, chemistry, and business strategy together.

## Run locally

```sh
npm run dev
```

The Replit preview runs on port 5000. For a production build, run `npm run build` and then `npm start`.

## Pages

- `/` — public summit overview
- `/sign-in` and `/sign-up` — managed Clerk account access
- `/dashboard` — protected member overview
- `/agenda` — event schedule
- `/registration` — protected event RSVP

Sign-in uses the Replit-managed Clerk app. Development and production have separate user stores. RSVP records are stored in the Replit PostgreSQL database and associated with the authenticated Clerk user; the app does not collect names or email addresses again.

## Content notes

Speaker information is copied from the supplied specification. The agenda has four “To be announced” entries because confirmed session details were not supplied. Social links are not fabricated. Speaker cards use initials and a designed gradient because approved photo files were not supplied.

## Checks

Run `npm run check` for TypeScript validation and `npm run build` for a production build. Test account creation, sign in/out, protected routes, RSVP submission and returning registration state, plus responsive layouts at 320px, 768px, 1024px, and 1440px.
