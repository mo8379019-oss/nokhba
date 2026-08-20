import { prisma } from "../config/database";
import { NotFoundError } from "../utils/appError";
import { computeSubjectProgress } from "./progress.service";

export async function listSubjectsByTeam(teamId: string, userId?: string, includeInactive = false) {
  const subjects = await prisma.subject.findMany({
    where: { teamId, ...(includeInactive ? {} : { status: "ACTIVE" }) },
    orderBy: { order: "asc" },
    include: { _count: { select: { lectures: true } } },
  });

  if (!userId) return subjects;

  return Promise.all(
    subjects.map(async (s) => ({
      ...s,
      progress: await computeSubjectProgress(userId, s.id),
    }))
  );
}

export async function getSubjectById(id: string, userId?: string) {
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: { team: true, _count: { select: { lectures: true } } },
  });
  if (!subject) throw new NotFoundError("المادة");

  const progress = userId ? await computeSubjectProgress(userId, id) : null;
  return { ...subject, progress };
}

export async function createSubject(
  teamId: string,
  data: { name: string; description?: string; imageUrl?: string; order?: number; status?: "ACTIVE" | "INACTIVE" }
) {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) throw new NotFoundError("الفرقة");

  return prisma.subject.create({ data: { ...data, teamId } });
}

export async function updateSubject(id: string, data: Partial<Omit<Parameters<typeof createSubject>[1], never>>) {
  const subject = await prisma.subject.findUnique({ where: { id } });
  if (!subject) throw new NotFoundError("المادة");
  return prisma.subject.update({ where: { id }, data });
}

export async function deleteSubject(id: string) {
  const subject = await prisma.subject.findUnique({ where: { id } });
  if (!subject) throw new NotFoundError("المادة");
  await prisma.subject.delete({ where: { id } });
}
