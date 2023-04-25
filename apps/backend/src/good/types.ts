import { graphSchema } from "graph/types";
import { nodeSchema } from "node/types";
import { Infer } from "utils/types";
import { z } from "zod";

export const goodSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  createdAt: z.number().positive().int(),
  sourceId: nodeSchema.shape.id,
  targetId: nodeSchema.shape.id,
  isVip: z.boolean(),
  graphId: graphSchema.shape.id,
});

export const findAllRequestSchema = z.object({
  query: goodSchema.pick({ graphId: true }).partial(),
});

export type FindAllRequest = Infer<typeof findAllRequestSchema>;

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
