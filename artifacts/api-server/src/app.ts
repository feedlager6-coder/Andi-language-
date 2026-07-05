import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";

const isProduction = process.env.NODE_ENV === "production";

// CORS: in production restrict to CORS_ORIGIN env var (comma-separated list).
// In development allow everything (Replit proxied iframe, localhost, etc.).
const corsOrigin: string | string[] | boolean = isProduction
  ? (process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
      : false)  // no CORS_ORIGIN set → allow same-origin only (served by this server)
  : true;

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// In production, serve the built frontend (Vite output) and handle SPA fallback.
// The frontend is built to artifacts/andi-language/dist/public relative to repo root.
// At runtime this file lives at artifacts/api-server/dist/index.mjs, so:
//   __dirname → artifacts/api-server/dist
//   frontend  → artifacts/api-server/dist/../../andi-language/dist/public
if (isProduction) {
  const selfDir = path.dirname(fileURLToPath(import.meta.url));
  const frontendDist = path.resolve(selfDir, "../../andi-language/dist/public");

  if (existsSync(frontendDist)) {
    app.use(express.static(frontendDist, { index: "index.html" }));

    // SPA fallback — any non-API route serves index.html
    app.use((_req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });

    logger.info({ frontendDist }, "Serving frontend static files");
  } else {
    logger.warn(
      { frontendDist },
      "Frontend dist not found — did you run `pnpm --filter @workspace/andi-language run build`?",
    );
  }
}

export default app;
