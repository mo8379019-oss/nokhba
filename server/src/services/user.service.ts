import { prisma } from "../config/database";
import { NotFoundError } from "../utils/appError";
import { sanitizeUser } from "./auth.service";
import { computeOverallProgress } from "./progress.service";

export async function listUsers(params: { page: number; limit: number; search?: string; teamId?: string }) {
  const { page, limit, search, teamId } = params;

  const where = {
    ...(teamId ? { teamId } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { team: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items: items.map(sanitizeUser),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id }, include: { team: true } });
  if (!user) throw new NotFoundError("المستخدم");
  const progress = await computeOverallProgress(id);
  return { ...sanitizeUser(user), progress };
}

export async function updateUser(
  id: string,
  data: Partial<{ name: string; phone: string; email: string; teamId: string; status: "ACTIVE" | "INACTIVE" }>
) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("المستخدم");

  const updated = await prisma.user.update({ where: { id }, data });
  return sanitizeUser(updated);
}

export async function deleteUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("المستخدم");
  await prisma.user.delete({ where: { id } });
}
