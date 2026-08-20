import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل").max(100),
    phone: z
      .string()
      .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    teamId: z.string().uuid().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z.string().min(1, "كلمة المرور مطلوبة"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
