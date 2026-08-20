import { z } from "zod";

export const createSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, "اسم المادة يجب أن يكون حرفين على الأقل").max(100, "اسم المادة طويل جدًا"),
    description: z.string().max(1000, "الوصف طويل جدًا").optional().or(z.literal("")),
    imageUrl: z.string().url("رابط الصورة غير صحيح").optional().or(z.literal("")),
    order: z.coerce
      .number({ invalid_type_error: "الترتيب يجب أن يكون رقمًا" })
      .int("الترتيب يجب أن يكون رقمًا صحيحًا")
      .optional(),
    status: z.enum(["ACTIVE", "INACTIVE"], {
      errorMap: () => ({ message: "الحالة يجب أن تكون ACTIVE أو INACTIVE" }),
    }).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({ teamId: z.string().uuid("معرّف الفرقة غير صحيح") }),
});

export const updateSubjectSchema = z.object({
  body: createSubjectSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid("معرّف المادة غير صحيح") }),
});