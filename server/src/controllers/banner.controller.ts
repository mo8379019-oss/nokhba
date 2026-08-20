import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/apiResponse";
import { prisma } from "../config/database";
import { NotFoundError } from "../utils/appError";
import { uploadBuffer } from "../config/storage";
import { AuthRequest } from "../middleware/auth.middleware";

export const listBanners = catchAsync(async (req: AuthRequest, res: Response) => {
  const includeInactive = req.user?.role === "ADMIN" && req.query.all === "true";
  const banners = await prisma.banner.findMany({
    where: includeInactive ? {} : { status: "ACTIVE" },
    orderBy: { order: "asc" },
  });
  return success(res, banners);
});

export const createBanner = catchAsync(async (req: AuthRequest, res: Response) => {
  let imageUrl = req.body.imageUrl;
  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer, { folder: "banners", resourceType: "image" });
    imageUrl = uploaded.url;
  }
  const banner = await prisma.banner.create({ data: { ...req.body, imageUrl } });
  return success(res, banner, 201);
});

export const updateBanner = catchAsync(async (req: AuthRequest, res: Response) => {
  const existing = await prisma.banner.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("البانر");

  let imageUrl = req.body.imageUrl;
  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer, { folder: "banners", resourceType: "image" });
    imageUrl = uploaded.url;
  }

  const banner = await prisma.banner.update({
    where: { id: req.params.id },
    data: { ...req.body, ...(imageUrl ? { imageUrl } : {}) },
  });
  return success(res, banner);
});

export const deleteBanner = catchAsync(async (req: AuthRequest, res: Response) => {
  const existing = await prisma.banner.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError("البانر");
  await prisma.banner.delete({ where: { id: req.params.id } });
  return success(res, { message: "تم حذف البانر بنجاح" });
});
