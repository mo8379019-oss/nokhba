import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = Router();

// All user-management endpoints are admin-only
router.use(authenticate, requireAdmin);

router.get("/", userController.listUsers);
router.get("/:id", userController.getUser);
router.get("/:id/progress", userController.getUserProgress);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
