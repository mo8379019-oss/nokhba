import { prisma } from "../config/database";
import { NotFoundError } from "../utils/appError";
import { computeTeamProgress } from "./progress.service";

export async function listTeams(includeInactive = false) {
  const teams = await prisma.team.findMany({
    where: includeInactive ? {} : { status: "ACTIVE" },
    orderBy: { order: "asc" },
    include: { _count: { select: { subjects: true } } },
  });
  return teams;
}

export async function getTeamById(id: string, userId?: string) {
  const team = await prisma.team.findUnique({
    where: { id },
    include: { _count: { select: { subjects: true } } },
  });
  if (!team) throw new NotFoundError("الفرقة");

  const progress = userId ? await computeTeamProgress(userId, id) : null;
  return { ...team, progress };
}

export async function createTeam(data: {
  name: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  status?: "ACTIVE" | "INACTIVE";
}) {
  return prisma.team.create({ data });
}

export async function updateTeam(id: string, data: Partial<Parameters<typeof createTeam>[0]>) {
  const team = await prisma.team.findUnique({ where: { id } });
  if (!team) throw new NotFoundError("الفرقة");
  return prisma.team.update({ where: { id }, data });
}

export async function deleteTeam(id: string) {
  const team = await prisma.team.findUnique({ where: { id } });
  if (!team) throw new NotFoundError("الفرقة");
  await prisma.team.delete({ where: { id } });
}
