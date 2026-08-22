import { Router } from "express";
import * as teamController from "../controllers/team.controller";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTeamSchema, updateTeamSchema } from "../validators/team.validator";
import subjectRouter from "./subject.routes";

const router = Router();

router.get("/", optionalAuthenticate, teamController.listTeams);
router.get("/:id", optionalAuthenticate, teamController.getTeam);

router.use("/:teamId/subjects", subjectRouter);

router.post("/", authenticate, requireAdmin, validate(createTeamSchema), teamController.createTeam);
router.patch("/:id", authenticate, requireAdmin, validate(updateTeamSchema), teamController.updateTeam);
router.delete("/:id", authenticate, requireAdmin, teamController.deleteTeam);

export default router;