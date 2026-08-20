import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth";
import { env } from "../config/env";
import { UnauthorizedError } from "../utils/appError";
import { prisma } from "../config/database";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "STUDENT" | "ADMIN";
  };
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const tokenFromCookie = req.cookies?.[env.cookieName];
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;

    const token = tokenFromCookie ?? tokenFromHeader;

    if (!token) {
      throw new UnauthorizedError("يجب تسجيل الدخول أولاً");
    }

    const payload = verifyToken(token);

    // Confirm the user still exists and is active
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedError("الحساب غير موجود أو تم تعطيله");
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    next(new UnauthorizedError("جلسة الدخول غير صالحة أو منتهية"));
  }
}

/** Optional auth: attaches user if token present, but never blocks the request */
export async function optionalAuthenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const tokenFromCookie = req.cookies?.[env.cookieName];
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
    const token = tokenFromCookie ?? tokenFromHeader;

    if (token) {
      const payload = verifyToken(token);
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (user && user.status === "ACTIVE") {
        req.user = { id: user.id, role: user.role };
      }
    }
  } catch {
    // ignore invalid token in optional auth
  }
  next();
}
