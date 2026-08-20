import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/apiResponse";
import * as teamService from "../services/team.service";
import { uploadBuffer } from "../config/storage";
import { AuthRequest } from "../middleware/auth.middleware";

export const listTeams = catchAsync(async (req: AuthRequest, res: Response) => {
  const includeInactive = req.user?.role === "ADMIN" && req.query.all === "true";
  const teams = await teamService.listTeams(includeInactive);
  return success(res, teams);
});

export const getTeam = catchAsync(async (req: AuthRequest, res: Response) => {
  const team = await teamService.getTeamById(req.params.id, req.user?.id);
  return success(res, team);
});

export const createTeam = catchAsync(async (req: AuthRequest, res: Response) => {
  let imageUrl = req.body.imageUrl;

  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer, { folder: "teams", resourceType: "image" });
    imageUrl = uploaded.url;
  }

  const team = await teamService.createTeam({ ...req.body, imageUrl });
  return success(res, team, 201);
});

export const updateTeam = catchAsync(async (req: AuthRequest, res: Response) => {
  let imageUrl = req.body.imageUrl;

  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer, { folder: "teams", resourceType: "image" });
    imageUrl = uploaded.url;
  }

  const team = await teamService.updateTeam(req.params.id, { ...req.body, ...(imageUrl ? { imageUrl } : {}) });
  return success(res, team);
});

export const deleteTeam = catchAsync(async (req: AuthRequest, res: Response) => {
  await teamService.deleteTeam(req.params.id);
  return success(res, { message: "تم حذف الفرقة بنجاح" });
});
