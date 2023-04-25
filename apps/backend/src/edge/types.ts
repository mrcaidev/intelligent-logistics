import { graphSchema } from "graph/types";
import { nodeSchema } from "node/types";
import { Infer } from "utils/types";
import { z } from "zod";

export const edgeSchema = z.object({
  id: z.string().nonempty(),
  sourceId: nodeSchema.shape.id,
  targetId: nodeSchema.shape.id,
  cost: z.number().nonnegative(),
  graphId: graphSchema.shape.id,
});

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
