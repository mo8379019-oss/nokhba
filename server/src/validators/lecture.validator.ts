import { z } from "zod";

export const createLectureSchema = z.object({
  body: z.object({
    title: z.string().min(2, "عنوان المحاضرة يجب أن يكون حرفين على الأقل").max(200, "العنوان طويل جدًا"),
    description: z.string().max(3000, "الوصف طويل جدًا").optional().or(z.literal("")),
    pdfUrl: z.string().url("رابط PDF غير صحيح").optional().or(z.literal("")),
    audioUrl: z.string().url("رابط الملف الصوتي غير صحيح").optional().or(z.literal("")),
    thumbnailUrl: z.string().url("رابط الصورة غير صحيح").optional().or(z.literal("")),
    order: z.coerce
      .number({ invalid_type_error: "الترتيب يجب أن يكون رقمًا" })
      .int("الترتيب يجب أن يكون رقمًا صحيحًا")
      .optional(),
    status: z.enum(["ACTIVE", "INACTIVE"], {
      errorMap: () => ({ message: "الحالة يجب أن تكون ACTIVE أو INACTIVE" }),
    }).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({ subjectId: z.string().min(1, "معرّف المادة غير صحيح") }),
});

export const updateLectureSchema = z.object({
  body: createLectureSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().min(1, "معرّف المحاضرة غير صحيح") }),
});

export const reorderLecturesSchema = z.object({
  body: z.object({
    items: z.array(z.object({ id: z.string().min(1), order: z.number().int() })),
  }),
  query: z.object({}).optional(),
  params: z.object({ subjectId: z.string().min(1, "معرّف المادة غير صحيح") }),
});