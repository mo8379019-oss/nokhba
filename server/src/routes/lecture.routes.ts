import { Router } from "express";
import * as lectureController from "../controllers/lecture.controller";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createLectureSchema,
  updateLectureSchema,
  reorderLecturesSchema,
} from "../validators/lecture.validator";
import { uploadLectureFiles } from "../middleware/upload.middleware";

const router = Router({ mergeParams: true });

router.get("/", optionalAuthenticate, lectureController.listLectures);

router.post(
  "/",
  authenticate,
  requireAdmin,
  uploadLectureFiles,
  validate(createLectureSchema),
  lectureController.createLecture
);

router.patch("/reorder", authenticate, requireAdmin, validate(reorderLecturesSchema), lectureController.reorderLectures);

export default router;

// Standalone router for direct /api/lectures/:id access
export const standaloneLectureRouter = Router();
standaloneLectureRouter.get("/:id", optionalAuthenticate, lectureController.getLecture);
standaloneLectureRouter.patch(
  "/:id",
  authenticate,
  requireAdmin,
  uploadLectureFiles,
  validate(updateLectureSchema),
  lectureController.updateLecture
);
standaloneLectureRouter.delete("/:id", authenticate, requireAdmin, lectureController.deleteLecture);
