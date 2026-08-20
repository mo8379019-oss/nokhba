import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import { ForbiddenError, UnauthorizedError } from "../utils/appError";

/**
 * Must be used AFTER `authenticate`.
 * Flow: Authenticated User -> Is Admin? -> YES: Allow / NO: 403 Forbidden
 */
export function requireAdmin(req: AuthRequest, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new UnauthorizedError());
  }
  if (req.user.role !== "ADMIN") {
    return next(new ForbiddenError("هذه العملية متاحة للأدمن فقط"));
  }
  next();
}
