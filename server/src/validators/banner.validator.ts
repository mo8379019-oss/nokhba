import { z } from "zod";

export const createBannerSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(150),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url(),
    buttonText: z.string().max(50).optional(),
    link: z.string().max(300).optional(),
    order: z.number().int().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateBannerSchema = z.object({
  body: createBannerSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid() }),
});
