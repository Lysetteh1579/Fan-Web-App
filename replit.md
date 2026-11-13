# Replit run notes

This app uses React, Vite, Express, managed Clerk authentication, and the built-in PostgreSQL database.

The **Start application** workflow runs `npm run dev` on port 5000. Do not replace it with a static file server; it handles both Vite routes and the authenticated RSVP API.

Clerk has dedicated sign-in and sign-up routes. Keep `/` public for signed-out visitors and route signed-in members to `/dashboard`. Protect `/dashboard` and `/registration` with Clerk state, and keep the API endpoints protected with Express Clerk middleware. Do not add manual bearer-token handling to browser requests.

Event RSVPs are stored by authenticated Clerk user ID in the development database. Production schema changes are managed by Replit's Publish flow. Do not add startup-time DDL or custom production migration scripts.

The agenda remains pending until confirmed session details are supplied. Social links and speaker photos should remain absent until the user provides official URLs and approved assets.
