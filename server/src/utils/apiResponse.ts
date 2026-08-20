import { Response } from "express";

export function success<T>(res: Response, data: T, status = 200, meta?: Record<string, unknown>) {
  return res.status(status).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function fail(res: Response, message: string, status = 400, errors?: unknown) {
  return res.status(status).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}
