import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/apiResponse";
import * as lectureService from "../services/lecture.service";
import { touchProgress } from "../services/progress.service";
import { uploadBuffer } from "../config/storage";
import { AuthRequest } from "../middleware/auth.middleware";

type UploadedFiles = { [fieldname: string]: Express.Multer.File[] };

export const listLectures = catchAsync(async (req: AuthRequest, res: Response) => {
  const includeInactive = req.user?.role === "ADMIN" && req.query.all === "true";
  const lectures = await lectureService.listLecturesBySubject(req.params.subjectId, req.user?.id, includeInactive);
  return success(res, lectures);
});

export const getLecture = catchAsync(async (req: AuthRequest, res: Response) => {
  const lecture = await lectureService.getLectureById(req.params.id, req.user?.id);

  // Track that the student opened this lecture
  if (req.user && req.user.role === "STUDENT") {
    await touchProgress(req.user.id, req.params.id);
  }

  return success(res, lecture);
});

export const createLecture = catchAsync(async (req: AuthRequest, res: Response) => {
  const files = req.files as UploadedFiles | undefined;
  const data = { ...req.body };

  if (files?.pdf?.[0]) {
    const uploaded = await uploadBuffer(files.pdf[0].buffer, { folder: "lectures/pdf", resourceType: "raw" });
    data.pdfUrl = uploaded.url;
  }
  if (files?.audio?.[0]) {
    const uploaded = await uploadBuffer(files.audio[0].buffer, { folder: "lectures/audio", resourceType: "video" });
    data.audioUrl = uploaded.url;
  }
  if (files?.thumbnail?.[0]) {
    const uploaded = await uploadBuffer(files.thumbnail[0].buffer, {
      folder: "lectures/thumbnails",
      resourceType: "image",
    });
    data.thumbnailUrl = uploaded.url;
  }

  const lecture = await lectureService.createLecture(req.params.subjectId, data);
  return success(res, lecture, 201);
});

export const updateLecture = catchAsync(async (req: AuthRequest, res: Response) => {
  const files = req.files as UploadedFiles | undefined;
  const data = { ...req.body };

  if (files?.pdf?.[0]) {
    const uploaded = await uploadBuffer(files.pdf[0].buffer, { folder: "lectures/pdf", resourceType: "raw" });
    data.pdfUrl = uploaded.url;
  }
  if (files?.audio?.[0]) {
    const uploaded = await uploadBuffer(files.audio[0].buffer, { folder: "lectures/audio", resourceType: "video" });
    data.audioUrl = uploaded.url;
  }
  if (files?.thumbnail?.[0]) {
    const uploaded = await uploadBuffer(files.thumbnail[0].buffer, {
      folder: "lectures/thumbnails",
      resourceType: "image",
    });
    data.thumbnailUrl = uploaded.url;
  }

  const lecture = await lectureService.updateLecture(req.params.id, data);
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
