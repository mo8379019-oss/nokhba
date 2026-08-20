import { Router } from "express";
import * as bannerController from "../controllers/banner.controller";
import { authenticate, optionalAuthenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { validate } from "../middleware/validate.middleware";
import { createBannerSchema, updateBannerSchema } from "../validators/banner.validator";
import { uploadImage } from "../middleware/upload.middleware";

const router = Router();

router.get("/", optionalAuthenticate, bannerController.listBanners);

router.post(
  "/",
  authenticate,
  requireAdmin,
  uploadImage.single("image"),
  validate(createBannerSchema),
  bannerController.createBanner
);
router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  uploadImage.single("image"),
  validate(updateBannerSchema),
  bannerController.updateBanner
);
router.delete("/:id", authenticate, requireAdmin, bannerController.deleteBanner);

export default router;
