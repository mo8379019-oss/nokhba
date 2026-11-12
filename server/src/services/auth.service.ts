import { prisma } from "../config/database";
import { comparePassword, hashPassword, signToken } from "../utils/auth";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/appError";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

export async function registerStudent(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { phone: input.phone } });
  if (existing) {
    throw new ConflictError("رقم الهاتف مسجّل بالفعل، سجّل الدخول بدلًا من إنشاء حساب جديد");
  }

  const team = await prisma.team.findUnique({ where: { id: input.teamId } });
  if (!team || team.status !== "ACTIVE") {
    throw new NotFoundError("الفرقة");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      phone: input.phone,
      passwordHash,
      teamId: input.teamId,
      role: "STUDENT",
    },
  });

  const token = signToken({ userId: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { phone: input.phone } });
  if (!user) {
    throw new UnauthorizedError("رقم الهاتف أو كلمة المرور غير صحيحة");
  }

  const isValid = await comparePassword(input.password, user.passwordHash);
  if (!isValid) {
    throw new UnauthorizedError("رقم الهاتف أو كلمة المرور غير صحيحة");
  }

  if (user.status !== "ACTIVE") {
    throw new UnauthorizedError("تم تعطيل هذا الحساب، برجاء التواصل مع الإدارة");
  }

  const token = signToken({ userId: user.id, role: user.role });
  return { user: sanitizeUser(user), token };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { team: true },
  });
  if (!user) throw new UnauthorizedError();
  return sanitizeUser(user);
}

// Never leak the password hash to the client
export function sanitizeUser<T extends { passwordHash: string }>(user: T) {
  const { passwordHash, ...rest } = user;
  return rest;
}
