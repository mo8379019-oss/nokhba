import { z } from "zod";

export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2, "اسم الفرقة يجب أن يكون حرفين على الأقل").max(100),
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
  params: z.object({}).optional(),
});

export const updateTeamSchema = z.object({
  body: createTeamSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1, "معرّف الفرقة غير صحيح") }),
});