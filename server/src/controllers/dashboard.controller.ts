import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { success } from "../utils/apiResponse";
import { prisma } from "../config/database";
import { AuthRequest } from "../middleware/auth.middleware";

export const getOverview = catchAsync(async (_req: AuthRequest, res: Response) => {
  const [totalUsers, totalTeams, totalSubjects, totalLectures, totalPdf, totalAudio, recentUsers, recentLectures] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.team.count(),
      prisma.subject.count(),
      prisma.lecture.count(),
      prisma.lecture.count({ where: { pdfUrl: { not: null } } }),
      prisma.lecture.count({ where: { audioUrl: { not: null } } }),
      prisma.user.findMany({
        where: { role: "STUDENT" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { team: true },
      }),
      prisma.lecture.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { subject: { include: { team: true } } },
      }),
    ]);

  // Average progress across all students
  const students = await prisma.user.findMany({ where: { role: "STUDENT" }, select: { id: true } });
  const totalCompleted = await prisma.progress.count({ where: { status: "COMPLETED" } });
  const totalActiveLectures = await prisma.lecture.count({ where: { status: "ACTIVE" } });
  const avgProgress =
    students.length && totalActiveLectures
      ? Math.round((totalCompleted / (students.length * totalActiveLectures)) * 100)
      : 0;

  // Most viewed subjects (by progress record count)
  const subjectViews = await prisma.progress.groupBy({
    by: ["lectureId"],
    _count: true,
  });
  const lectureIds = subjectViews.map((v) => v.lectureId);
  const lecturesWithSubject = await prisma.lecture.findMany({
    where: { id: { in: lectureIds } },
    select: { id: true, subjectId: true, subject: { select: { name: true } } },
  });
  const viewsBySubject = new Map<string, { name: string; views: number }>();
  for (const v of subjectViews) {
    const lecture = lecturesWithSubject.find((l) => l.id === v.lectureId);
    if (!lecture) continue;
    const current = viewsBySubject.get(lecture.subjectId) ?? { name: lecture.subject.name, views: 0 };
    current.views += v._count;
    viewsBySubject.set(lecture.subjectId, current);
  }
  const mostViewedSubjects = Array.from(viewsBySubject.values())
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return success(res, {
    stats: {
      totalUsers,
      totalTeams,
      totalSubjects,
      totalLectures,
      totalPdf,
      totalAudio,
      avgProgress,
    },
    recentUsers,
    recentLectures,
    mostViewedSubjects,
  });
});
