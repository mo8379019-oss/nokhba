import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/apiResponse";
import * as authService from "../services/auth.service";
import { env } from "../config/env";
import { AuthRequest } from "../middleware/auth.middleware";

const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? ("none" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = catchAsync(async (req: AuthRequest, res: Response) => {
  const { user, token } = await authService.registerStudent(req.body);
  res.cookie(env.cookieName, token, cookieOptions);
  return success(res, { user, token }, 201);
});

export const login = catchAsync(async (req: AuthRequest, res: Response) => {
  const { user, token } = await authService.loginUser(req.body);
  res.cookie(env.cookieName, token, cookieOptions);
  return success(res, { user, token });
});

export const logout = catchAsync(async (_req: AuthRequest, res: Response) => {
  res.clearCookie(env.cookieName);
  return success(res, { message: "تم تسجيل الخروج بنجاح" });
});

export const me = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.id);
  return success(res, user);
});
