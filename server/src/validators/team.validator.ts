import { z } from "zod";

export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(1000).optional(),
    imageUrl: z.string().url().optional(),
    order: z.number().int().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateTeamSchema = z.object({
  body: createTeamSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid() }),
});
