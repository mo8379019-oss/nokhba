import { z } from "zod";

// يحوّل الأرقام العربية (٠١٢...) لأرقام إنجليزية ويشيل المسافات والشرطات
function normalizePhone(value: unknown) {
  if (typeof value !== "string") return value;
  return value
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[\s-]/g, "");
}

const phoneSchema = z.preprocess(
  normalizePhone,
  z.string({ required_error: "رقم الهاتف مطلوب" }).regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح (مثال: 01012345678)")
);

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "الاسم مطلوب" })
      .trim()
      .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
      .max(100, "الاسم طويل جدًا"),
    phone: phoneSchema,
    password: z
      .string({ required_error: "كلمة المرور مطلوبة" })
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .max(100, "كلمة المرور طويلة جدًا"),
    teamId: z.string({ required_error: "اختيار الفرقة مطلوب" }).min(1, "اختيار الفرقة مطلوب"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    phone: z.preprocess(normalizePhone, z.string({ required_error: "رقم الهاتف مطلوب" }).min(1, "رقم الهاتف مطلوب")),
    password: z.string({ required_error: "كلمة المرور مطلوبة" }).min(1, "كلمة المرور مطلوبة"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
