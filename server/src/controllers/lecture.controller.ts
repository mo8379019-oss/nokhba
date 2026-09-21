import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/apiResponse";
import * as lectureService from "../services/lecture.service";
import { touchProgress } from "../services/progress.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { UnauthorizedError } from "../utils/appError";

export const listLectures = catchAsync(async (req: AuthRequest, res: Response) => {
  const includeInactive = req.user?.role === "ADMIN" && req.query.all === "true";
  const lectures = await lectureService.listLecturesBySubject(req.params.subjectId, req.user?.id, includeInactive);
  return success(res, lectures);
});

export const getLecture = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedError("يجب تسجيل الدخول لمشاهدة المحاضرة");
  }

  const lecture = await lectureService.getLectureById(req.params.id, req.user.id);

  if (req.user.role === "STUDENT") {
    await touchProgress(req.user.id, req.params.id);
  }

  return success(res, lecture);
});

export const createLecture = catchAsync(async (req: AuthRequest, res: Response) => {
  const lecture = await lectureService.createLecture(req.params.subjectId, req.body);
  return success(res, lecture, 201);
});

export const updateLecture = catchAsync(async (req: AuthRequest, res: Response) => {
  const lecture = await lectureService.updateLecture(req.params.id, req.body);
  return success(res, lecture);
});

export const deleteLecture = catchAsync(async (req: AuthRequest, res: Response) => {
  await lectureService.deleteLecture(req.params.id);
  return success(res, { message: "تم حذف المحاضرة بنجاح" });
});

export const reorderLectures = catchAsync(async (req: AuthRequest, res: Response) => {
  const lectures = await lectureService.reorderLectures(req.params.subjectId, req.body.items);
  return success(res, lectures);
});