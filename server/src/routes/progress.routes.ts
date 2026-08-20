import { Router } from "express";
import * as progressController from "../controllers/progress.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateProgressSchema } from "../validators/progress.validator";

const router = Router();

router.use(authenticate);

router.get("/", progressController.listMyProgress);
router.get("/overall", progressController.getMyOverallProgress);
router.get("/:lectureId", progressController.getLectureProgress);
router.patch("/:lectureId", validate(updateProgressSchema), progressController.updateLectureProgress);

export default router;
