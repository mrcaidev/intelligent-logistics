import { graphSchema } from "graph/types";
import { Infer } from "utils/types";
import { z } from "zod";

export const edgeSchema = z.object({
  id: z.string().nonempty(),
  source: z.string().nonempty(),
  target: z.string().nonempty(),
  cost: z.number().nonnegative(),
  graphId: graphSchema.shape.id,
});

export type Edge = Infer<typeof edgeSchema>;

export const findAllRequestSchema = z.object({
  query: edgeSchema.pick({ graphId: true }).partial(),
});

export type FindAllRequest = Infer<typeof findAllRequestSchema>;

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
