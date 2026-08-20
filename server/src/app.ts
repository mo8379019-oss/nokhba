import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { env } from "./config/env";
import apiRouter from "./routes/index";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

// ------------------------------------------------------------
// Security & Core Middleware
// ------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan(env.isProd ? "combined" : "dev"));

// Rate limiting (protects against brute-force / abuse)
const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "عدد كبير من الطلبات، برجاء المحاولة لاحقًا" },
});
app.use("/api", limiter);

// ------------------------------------------------------------
// Health check
// ------------------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is running", timestamp: new Date().toISOString() });
});

// ------------------------------------------------------------
// API Routes
// ------------------------------------------------------------
app.use("/api", apiRouter);

// ------------------------------------------------------------
// 404 + Error Handling (must be last)
// ------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
