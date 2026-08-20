import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/apiResponse";
import * as userService from "../services/user.service";
import { listUserProgressDetails } from "../services/progress.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const listUsers = catchAsync(async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const search = req.query.search as string | undefined;
  const teamId = req.query.teamId as string | undefined;

  const result = await userService.listUsers({ page, limit, search, teamId });
  return success(res, result.items, 200, {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  });
});

export const getUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  return success(res, user);
});

export const getUserProgress = catchAsync(async (req: AuthRequest, res: Response) => {
  const records = await listUserProgressDetails(req.params.id);
  return success(res, records);
});

export const updateUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return success(res, user);
});

export const deleteUser = catchAsync(async (req: AuthRequest, res: Response) => {
  await userService.deleteUser(req.params.id);
  return success(res, { message: "تم حذف المستخدم بنجاح" });
});
