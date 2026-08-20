import { Router } from "express";
import * as teamController from "../controllers/team.controller";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTeamSchema, updateTeamSchema } from "../validators/team.validator";
import { uploadImage } from "../middleware/upload.middleware";
import subjectRouter from "./subject.routes";

const router = Router();

// Public (with optional auth to enrich with student progress)
router.get("/", optionalAuthenticate, teamController.listTeams);
router.get("/:id", optionalAuthenticate, teamController.getTeam);

// Nested: /api/teams/:teamId/subjects
router.use("/:teamId/subjects", subjectRouter);

// Admin only
router.post(
  "/",
  authenticate,
  requireAdmin,
  uploadImage.single("image"),
  validate(createTeamSchema),
  teamController.createTeam
);
router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  uploadImage.single("image"),
  validate(updateTeamSchema),
  teamController.updateTeam
);
router.delete("/:id", authenticate, requireAdmin, teamController.deleteTeam);

export default router;
