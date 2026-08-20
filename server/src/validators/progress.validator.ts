import { z } from "zod";

export const updateProgressSchema = z.object({
  body: z.object({
    status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).optional(),
    progressPercent: z.number().int().min(0).max(100).optional(),
    audioProgress: z.number().int().min(0).optional(),
    pdfViewed: z.boolean().optional(),
    audioPlayed: z.boolean().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({ lectureId: z.string().uuid() }),
});
