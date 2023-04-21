import { Infer } from "utils/types";
import { z } from "zod";

export const goodSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.number().positive().int(),
  source: z.string(),
  target: z.string(),
  isVip: z.boolean(),
  graphId: z.string(),
});

export type Good = Infer<typeof goodSchema>;

export const createRequestSchema = z.object({
  body: goodSchema.omit({ id: true, createdAt: true }),
});

export type CreateRequest = Infer<typeof createRequestSchema>;

export const updateByIdRequestSchema = z.object({
  params: goodSchema.pick({ id: true }),
  body: goodSchema.omit({ id: true, createdAt: true }).partial(),
});

export type UpdateByIdRequest = Infer<typeof updateByIdRequestSchema>;

export const removeByIdRequestSchema = z.object({
  params: goodSchema.pick({ id: true }),
});

export type RemoveByIdRequest = Infer<typeof removeByIdRequestSchema>;
