import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { env } from "./config/env";
import apiRouter from "./routes/index";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware";

const app = express();

// ------------------------------------------------------------
// CORS
// ------------------------------------------------------------

const allowedOrigins = [
  "http://localhost:5173",
  "https://nokhba-neon.vercel.app",
];

function isAllowedOrigin(origin: string): boolean {
  // Local development
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Vercel Preview deployments
  if (
    origin.startsWith("https://nokhba-") &&
    origin.endsWith("-mohamed-bd8c.vercel.app")
  ) {
    return true;
  }

  return false;
}

// ------------------------------------------------------------
// Security & Core Middleware
// ------------------------------------------------------------

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without Origin
      // (Postman, server-to-server, health checks, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

app.use(morgan(env.isProd ? "combined" : "dev"));

// ------------------------------------------------------------
// Rate Limiting
// ------------------------------------------------------------

const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "عدد كبير من الطلبات، برجاء المحاولة لاحقًا",
  },
});

app.use("/api", limiter);

// ------------------------------------------------------------
// Health Check
// ------------------------------------------------------------

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------------------------------
// API Routes
// ------------------------------------------------------------

app.use("/api", apiRouter);

// ------------------------------------------------------------
// 404 + Error Handling
// Must be last
// ------------------------------------------------------------

app.use(notFoundHandler);

app.use(errorHandler);

export default app;