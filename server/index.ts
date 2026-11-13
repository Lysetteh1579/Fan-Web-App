import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Request, type Response } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import { Pool } from "pg";
import { createServer as createViteServer } from "vite";
import { CLERK_PROXY_PATH, clerkProxyMiddleware, getClerkProxyHost } from "./middlewares/clerkProxyMiddleware";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");
const eventSlug = "lash-pro-summit-2026";
const port = Number(process.env.PORT || 5000);
const app = express();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
app.use(express.json({ limit: "32kb" }));
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

function authenticatedUserId(req: Request, res: Response): string | null {
  const userId = getAuth(req).userId;
  if (!userId) {
    res.status(401).json({ error: "Sign in required." });
    return null;
  }
  return userId;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/registrations/me", async (req, res) => {
  const userId = authenticatedUserId(req, res);
  if (!userId) return;

  try {
    const result = await pool.query(
      `SELECT id::text AS id, event_slug AS "eventSlug", created_at AS "createdAt"
       FROM event_registrations
       WHERE clerk_user_id = $1 AND event_slug = $2
       LIMIT 1`,
      [userId, eventSlug],
    );
    res.json({ registration: result.rows[0] ?? null });
  } catch (error) {
    console.error("Could not load event registration:", error);
    res.status(500).json({ error: "Registration status is temporarily unavailable." });
  }
});

app.post("/api/registrations", async (req, res) => {
  const userId = authenticatedUserId(req, res);
  if (!userId) return;

  try {
    const created = await pool.query(
      `INSERT INTO event_registrations (clerk_user_id, event_slug)
       VALUES ($1, $2)
       ON CONFLICT (clerk_user_id, event_slug) DO NOTHING
       RETURNING id::text AS id, event_slug AS "eventSlug", created_at AS "createdAt"`,
      [userId, eventSlug],
    );
    if (created.rows[0]) {
      res.status(201).json({ registration: created.rows[0] });
      return;
    }

    const existing = await pool.query(
      `SELECT id::text AS id, event_slug AS "eventSlug", created_at AS "createdAt"
       FROM event_registrations
       WHERE clerk_user_id = $1 AND event_slug = $2
       LIMIT 1`,
      [userId, eventSlug],
    );
    res.json({ registration: existing.rows[0] ?? null });
  } catch (error) {
    console.error("Could not save event registration:", error);
    res.status(500).json({ error: "Your RSVP could not be saved. Please try again." });
  }
});

async function start() {
  if (process.env.NODE_ENV === "production") {
    const distDir = path.join(projectRoot, "dist");
    app.use(express.static(distDir));
    app.use((req, res, next) => {
      if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
      res.sendFile(path.join(distDir, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      configFile: path.join(projectRoot, "vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Lash Pro Summit server listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
