import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/apiResponse";
import * as subjectService from "../services/subject.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const listSubjects = catchAsync(async (req: AuthRequest, res: Response) => {
  const includeInactive = req.user?.role === "ADMIN" && req.query.all === "true";
  const subjects = await subjectService.listSubjectsByTeam(req.params.teamId, req.user?.id, includeInactive);
  return success(res, subjects);
});

export const getSubject = catchAsync(async (req: AuthRequest, res: Response) => {
  const subject = await subjectService.getSubjectById(req.params.id, req.user?.id);
  return success(res, subject);
});

export const createSubject = catchAsync(async (req: AuthRequest, res: Response) => {
  const subject = await subjectService.createSubject(req.params.teamId, req.body);
  return success(res, subject, 201);
});

export const updateSubject = catchAsync(async (req: AuthRequest, res: Response) => {
  const subject = await subjectService.updateSubject(req.params.id, req.body);
  return success(res, subject);
});

export const deleteSubject = catchAsync(async (req: AuthRequest, res: Response) => {
  await subjectService.deleteSubject(req.params.id);
  return success(res, { message: "تم حذف المادة بنجاح" });
});