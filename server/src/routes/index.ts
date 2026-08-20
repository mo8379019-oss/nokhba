import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import teamRoutes from "./team.routes";
import { standaloneSubjectRouter } from "./subject.routes";
import { standaloneLectureRouter } from "./lecture.routes";
import progressRoutes from "./progress.routes";
import searchRoutes from "./search.routes";
import bannerRoutes from "./banner.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

// /api/teams  and nested /api/teams/:teamId/subjects
router.use("/teams", teamRoutes);

// /api/subjects/:id  and nested /api/subjects/:subjectId/lectures
router.use("/subjects", standaloneSubjectRouter);

// /api/lectures/:id
router.use("/lectures", standaloneLectureRouter);

router.use("/progress", progressRoutes);
router.use("/search", searchRoutes);
router.use("/banners", bannerRoutes);
router.use("/admin/dashboard", dashboardRoutes);

export default router;
