import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/apiResponse";
import * as progressService from "../services/progress.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const listMyProgress = catchAsync(async (req: AuthRequest, res: Response) => {
  const records = await progressService.listUserProgressDetails(req.user!.id);
  return success(res, records);
});

export const getMyOverallProgress = catchAsync(async (req: AuthRequest, res: Response) => {
  const overall = await progressService.computeOverallProgress(req.user!.id);
  return success(res, overall);
});

export const getLectureProgress = catchAsync(async (req: AuthRequest, res: Response) => {
  const progress = await progressService.getLectureProgress(req.user!.id, req.params.lectureId);
  return success(res, progress);
});

export const updateLectureProgress = catchAsync(async (req: AuthRequest, res: Response) => {
  const progress = await progressService.updateProgress(req.user!.id, req.params.lectureId, req.body);
  return success(res, progress);
});
