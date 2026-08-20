import { z } from "zod";

export const createLectureSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200),
    description: z.string().max(3000).optional(),
    pdfUrl: z.string().url().optional(),
    audioUrl: z.string().url().optional(),
    thumbnailUrl: z.string().url().optional(),
    order: z.number().int().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({ subjectId: z.string().uuid() }),
});

export const updateLectureSchema = z.object({
  body: createLectureSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid() }),
});

export const reorderLecturesSchema = z.object({
  body: z.object({
    items: z.array(z.object({ id: z.string().uuid(), order: z.number().int() })),
  }),
  query: z.object({}).optional(),
  params: z.object({ subjectId: z.string().uuid() }),
});
