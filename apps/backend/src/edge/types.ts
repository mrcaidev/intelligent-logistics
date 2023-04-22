import { graphSchema } from "graph/types";
import { Infer } from "utils/types";
import { z } from "zod";

export const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  cost: z.number().nonnegative(),
  graphId: graphSchema.shape.id,
});

export type Edge = Infer<typeof edgeSchema>;

export const createRequestSchema = z.object({
  body: edgeSchema.omit({ id: true }),
});

export type CreateRequest = Infer<typeof createRequestSchema>;

export const updateByIdRequestSchema = z.object({
  params: edgeSchema.pick({ id: true }),
  body: edgeSchema.omit({ id: true }).partial(),
});

export type UpdateByIdRequest = Infer<typeof updateByIdRequestSchema>;

export const removeByIdRequestSchema = z.object({
  params: edgeSchema.pick({ id: true }),
});

export type RemoveByIdRequest = Infer<typeof removeByIdRequestSchema>;
