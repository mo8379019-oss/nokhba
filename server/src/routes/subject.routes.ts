import { Router } from "express";
import * as subjectController from "../controllers/subject.controller";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { validate } from "../middleware/validate.middleware";
import { createSubjectSchema, updateSubjectSchema } from "../validators/subject.validator";
import lectureRouter from "./lecture.routes";

const router = Router({ mergeParams: true });

router.get("/", optionalAuthenticate, subjectController.listSubjects);

router.post("/", authenticate, requireAdmin, validate(createSubjectSchema), subjectController.createSubject);

router.use("/:subjectId/lectures", lectureRouter);

export default router;

export const standaloneSubjectRouter = Router();
standaloneSubjectRouter.get("/:id", optionalAuthenticate, subjectController.getSubject);
standaloneSubjectRouter.patch(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateSubjectSchema),
  subjectController.updateSubject
);
standaloneSubjectRouter.delete("/:id", authenticate, requireAdmin, subjectController.deleteSubject);
standaloneSubjectRouter.use("/:subjectId/lectures", lectureRouter);