import { prisma } from "../config/database";
import { NotFoundError } from "../utils/appError";
import { getLectureProgress } from "./progress.service";

export async function listLecturesBySubject(subjectId: string, userId?: string, includeInactive = false) {
  const lectures = await prisma.lecture.findMany({
    where: { subjectId, ...(includeInactive ? {} : { status: "ACTIVE" }) },
    orderBy: { order: "asc" },
  });

  if (!userId) return lectures.map((l) => ({ ...l, studentStatus: "NOT_STARTED" as const }));

  return Promise.all(
    lectures.map(async (l) => {
      const progress = await getLectureProgress(userId, l.id);
      return { ...l, studentStatus: progress?.status ?? "NOT_STARTED" };
    })
  );
}

export async function getLectureById(id: string, userId?: string) {
  const lecture = await prisma.lecture.findUnique({
    where: { id },
    include: { subject: { include: { team: true } } },
  });
  if (!lecture) throw new NotFoundError("المحاضرة");

  const progress = userId ? await getLectureProgress(userId, id) : null;
  return { ...lecture, progress };
}

export async function createLecture(
  subjectId: string,
  data: {
    title: string;
    description?: string;
    pdfUrl?: string;
    audioUrl?: string;
    thumbnailUrl?: string;
    order?: number;
    status?: "ACTIVE" | "INACTIVE";
  }
) {
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) throw new NotFoundError("المادة");

  return prisma.lecture.create({ data: { ...data, subjectId } });
}

export async function updateLecture(id: string, data: Partial<Parameters<typeof createLecture>[1]>) {
  const lecture = await prisma.lecture.findUnique({ where: { id } });
  if (!lecture) throw new NotFoundError("المحاضرة");
  return prisma.lecture.update({ where: { id }, data });
}

export async function deleteLecture(id: string) {
  const lecture = await prisma.lecture.findUnique({ where: { id } });
  if (!lecture) throw new NotFoundError("المحاضرة");
  await prisma.lecture.delete({ where: { id } });
}

export async function reorderLectures(subjectId: string, items: { id: string; order: number }[]) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.lecture.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  );
  return listLecturesBySubject(subjectId, undefined, true);
}
