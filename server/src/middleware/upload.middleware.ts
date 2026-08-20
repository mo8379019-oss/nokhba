import multer from "multer";
import { Request } from "express";
import { AppError } from "../utils/appError";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const PDF_TYPES = ["application/pdf"];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a"];

function fileFilterFactory(allowed: string[]) {
  return (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!allowed.includes(file.mimetype)) {
      return cb(new AppError(`نوع الملف غير مدعوم: ${file.mimetype}`, 415));
    }
    cb(null, true);
  };
}

const memoryStorage = multer.memoryStorage();

export const uploadImage = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: fileFilterFactory(IMAGE_TYPES),
});

export const uploadPdf = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_PDF_SIZE },
  fileFilter: fileFilterFactory(PDF_TYPES),
});

export const uploadAudio = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_AUDIO_SIZE },
  fileFilter: fileFilterFactory(AUDIO_TYPES),
});

// Combined uploader for the lecture form (pdf + audio + thumbnail in one request)
export const uploadLectureFiles = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_AUDIO_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowed = [...IMAGE_TYPES, ...PDF_TYPES, ...AUDIO_TYPES];
    if (!allowed.includes(file.mimetype)) {
      return cb(new AppError(`نوع الملف غير مدعوم: ${file.mimetype}`, 415));
    }
    cb(null, true);
  },
}).fields([
  { name: "pdf", maxCount: 1 },
  { name: "audio", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);
