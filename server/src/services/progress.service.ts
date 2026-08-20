import { prisma } from "../config/database";
import { NotFoundError } from "../utils/appError";

/** Get or create a progress record when a student opens a lecture. */
export async function touchProgress(userId: string, lectureId: string) {
  const lecture = await prisma.lecture.findUnique({ where: { id: lectureId } });
  if (!lecture) throw new NotFoundError("المحاضرة");

  const progress = await prisma.progress.upsert({
    where: { userId_lectureId: { userId, lectureId } },
    update: { lastAccessedAt: new Date() },
    create: {
      userId,
      lectureId,
      status: "IN_PROGRESS",
      lastAccessedAt: new Date(),
    },
  });

  return progress;
}

export async function updateProgress(
  userId: string,
  lectureId: string,
  data: Partial<{
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    progressPercent: number;
    audioProgress: number;
    pdfViewed: boolean;
    audioPlayed: boolean;
  }>
) {
  const lecture = await prisma.lecture.findUnique({ where: { id: lectureId } });
  if (!lecture) throw new NotFoundError("المحاضرة");

  const isCompleting = data.status === "COMPLETED";

  const progress = await prisma.progress.upsert({
    where: { userId_lectureId: { userId, lectureId } },
    update: {
      ...data,
      lastAccessedAt: new Date(),
      ...(isCompleting ? { completedAt: new Date(), progressPercent: 100 } : {}),
    },
    create: {
      userId,
      lectureId,
      status: data.status ?? "IN_PROGRESS",
      progressPercent: data.progressPercent ?? 0,
      audioProgress: data.audioProgress ?? 0,
      pdfViewed: data.pdfViewed ?? false,
      audioPlayed: data.audioPlayed ?? false,
      lastAccessedAt: new Date(),
      ...(isCompleting ? { completedAt: new Date(), progressPercent: 100 } : {}),
    },
  });

  return progress;
}

export async function getLectureProgress(userId: string, lectureId: string) {
  return prisma.progress.findUnique({ where: { userId_lectureId: { userId, lectureId } } });
}

/** Progress percentage for a single subject (based on completed lectures / total active lectures). */
export async function computeSubjectProgress(userId: string, subjectId: string) {
  const lectures = await prisma.lecture.findMany({
    where: { subjectId, status: "ACTIVE" },
    select: { id: true },
  });

  if (lectures.length === 0) return { total: 0, completed: 0, percent: 0 };

  const completed = await prisma.progress.count({
    where: {
      userId,
      lectureId: { in: lectures.map((l) => l.id) },
      status: "COMPLETED",
    },
  });

  return {
    total: lectures.length,
    completed,
    percent: Math.round((completed / lectures.length) * 100),
  };
}

/** Progress percentage for an entire team (average across all its subjects). */
export async function computeTeamProgress(userId: string, teamId: string) {
  const subjects = await prisma.subject.findMany({
    where: { teamId, status: "ACTIVE" },
    select: { id: true },
  });

  if (subjects.length === 0) return { percent: 0, subjects: [] };

  const subjectProgresses = await Promise.all(
    subjects.map(async (s) => ({
      subjectId: s.id,
      ...(await computeSubjectProgress(userId, s.id)),
    }))
  );

  const avg =
    subjectProgresses.reduce((sum, s) => sum + s.percent, 0) / subjectProgresses.length;

  return { percent: Math.round(avg), subjects: subjectProgresses };
}

/** Overall progress for a student across all lectures they have access to (their team). */
export async function computeOverallProgress(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("المستخدم");

  if (!user.teamId) {
    return { totalLectures: 0, completedLectures: 0, percent: 0, teamProgress: null };
  }

  const teamProgress = await computeTeamProgress(userId, user.teamId);

  const lectures = await prisma.lecture.findMany({
    where: { subject: { teamId: user.teamId, status: "ACTIVE" }, status: "ACTIVE" },
    select: { id: true },
  });

  const completedLectures = await prisma.progress.count({
    where: { userId, lectureId: { in: lectures.map((l) => l.id) }, status: "COMPLETED" },
  });

  return {
    totalLectures: lectures.length,
    completedLectures,
    percent: lectures.length ? Math.round((completedLectures / lectures.length) * 100) : 0,
    teamProgress: teamProgress.percent,
  };
}

export async function listUserProgressDetails(userId: string) {
  const records = await prisma.progress.findMany({
    where: { userId },
    include: { lecture: { include: { subject: { include: { team: true } } } } },
    orderBy: { lastAccessedAt: "desc" },
  });
  return records;
}
