import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success, fail } from "../utils/apiResponse";
import { prisma } from "../config/database";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * GET /api/search?q=keyword&team=teamId&subject=subjectId&type=pdf|audio|both
 */
export const search = catchAsync(async (req: AuthRequest, res: Response) => {
  const q = (req.query.q as string | undefined)?.trim();
  const teamId = req.query.team as string | undefined;
  const subjectId = req.query.subject as string | undefined;
  const contentType = req.query.type as "pdf" | "audio" | "both" | undefined;

  if (!q || q.length < 2) {
    return fail(res, "يجب إدخال كلمة بحث لا تقل عن حرفين", 422);
  }

  const lectureWhere: Record<string, unknown> = {
    status: "ACTIVE",
    OR: [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ],
    ...(subjectId ? { subjectId } : {}),
    ...(teamId ? { subject: { teamId } } : {}),
    ...(contentType === "pdf" ? { pdfUrl: { not: null } } : {}),
    ...(contentType === "audio" ? { audioUrl: { not: null } } : {}),
    ...(contentType === "both" ? { AND: [{ pdfUrl: { not: null } }, { audioUrl: { not: null } }] } : {}),
  };

  const [lectures, subjects, teams] = await Promise.all([
    prisma.lecture.findMany({
      where: lectureWhere,
      include: { subject: { include: { team: true } } },
      take: 30,
    }),
    prisma.subject.findMany({
      where: {
        status: "ACTIVE",
        name: { contains: q, mode: "insensitive" },
        ...(teamId ? { teamId } : {}),
      },
      include: { team: true },
      take: 10,
    }),
    prisma.team.findMany({
      where: { status: "ACTIVE", name: { contains: q, mode: "insensitive" } },
      take: 10,
    }),
  ]);

  return success(res, {
    lectures: lectures.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      subject: l.subject.name,
      team: l.subject.team.name,
      teamId: l.subject.teamId,
      subjectId: l.subjectId,
      hasPdf: !!l.pdfUrl,
      hasAudio: !!l.audioUrl,
    })),
    subjects,
    teams,
  });
});
