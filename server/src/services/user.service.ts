import { Prisma } from "@prisma/client";
import ExcelJS from "exceljs";
import { prisma } from "../config/database";
import { NotFoundError } from "../utils/appError";
import { sanitizeUser } from "./auth.service";
import { computeOverallProgress } from "./progress.service";

/**
 * teamId:
 *  - undefined  → كل الطلاب
 *  - "none"     → الطلاب اللي مالهمش فرقة
 *  - أي قيمة تانية → طلاب الفرقة دي
 * قائمة المستخدمين بتعرض الطلاب بس (حساب الأدمن مش بيظهر هنا).
 */
function buildStudentsWhere(teamId?: string): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = { role: "STUDENT" };
  if (teamId === "none") where.teamId = null;
  else if (teamId) where.teamId = teamId;
  return where;
}

export async function listUsers(params: { page: number; limit: number; search?: string; teamId?: string }) {
  const { page, limit, search, teamId } = params;

  const where: Prisma.UserWhereInput = buildStudentsWhere(teamId);
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

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

// ------------------------------------------------------------
// Export (Excel / CSV)
// ------------------------------------------------------------

export type ExportFormat = "xlsx" | "csv";

const EXPORT_HEADERS = [
  "الاسم",
  "رقم الهاتف",
  "البريد الإلكتروني",
  "الفرقة",
  "الحالة",
  "تاريخ التسجيل",
  "المحاضرات المكتملة",
];

export async function exportUsers(teamId: string | undefined, format: ExportFormat) {
  const users = await prisma.user.findMany({
    where: buildStudentsWhere(teamId),
    include: { team: true },
    orderBy: { createdAt: "asc" },
  });

  // ترتيب حسب ترتيب الفرقة (الترتيب ثابت جوه نفس الفرقة حسب تاريخ التسجيل)
  users.sort((a, b) => (a.team?.order ?? 9999) - (b.team?.order ?? 9999));

  const ids = users.map((u) => u.id);
  const completedGroups = ids.length
    ? await prisma.progress.groupBy({
        by: ["userId"],
        where: { userId: { in: ids }, status: "COMPLETED" },
        _count: true,
      })
    : [];
  const completedByUser = new Map<string, number>();
  for (const g of completedGroups) completedByUser.set(g.userId, g._count);

  const rows: (string | number)[][] = users.map((u) => [
    u.name,
    u.phone,
    u.email ?? "",
    u.team?.name ?? "بدون فرقة",
    u.status === "ACTIVE" ? "نشط" : "معطّل",
    u.createdAt.toISOString().slice(0, 10),
    completedByUser.get(u.id) ?? 0,
  ]);

  if (format === "csv") {
    // حماية من حقن الصيغ في Excel (قيم بتبدأ بـ = + - @)
    const cell = (value: string | number) => {
      let text = String(value);
      if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
      return `"${text.replace(/"/g, '""')}"`;
    };
    const lines = [EXPORT_HEADERS, ...rows].map((row) => row.map(cell).join(","));
    // BOM عشان Excel يقرا العربي صح
    const buffer = Buffer.from("\uFEFF" + lines.join("\r\n"), "utf-8");
    return { buffer, contentType: "text/csv; charset=utf-8", extension: "csv" };
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("الطلاب", { views: [{ rightToLeft: true }] });
  sheet.columns = [
    { header: EXPORT_HEADERS[0], width: 30 },
    { header: EXPORT_HEADERS[1], width: 16, style: { numFmt: "@" } }, // نص عشان الصفر اللي في الأول يفضل
    { header: EXPORT_HEADERS[2], width: 30 },
    { header: EXPORT_HEADERS[3], width: 20 },
    { header: EXPORT_HEADERS[4], width: 12 },
    { header: EXPORT_HEADERS[5], width: 16 },
    { header: EXPORT_HEADERS[6], width: 18 },
  ];
  rows.forEach((row) => sheet.addRow(row));
  sheet.getRow(1).font = { bold: true };

  const data = await workbook.xlsx.writeBuffer();
  return {
    buffer: Buffer.from(data as ArrayBuffer),
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extension: "xlsx",
  };
}
