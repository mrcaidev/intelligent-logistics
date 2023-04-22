import { graphSchema } from "graph/types";
import { Infer } from "utils/types";
import { z } from "zod";

export const goodSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  createdAt: z.number().positive().int(),
  source: z.string().nonempty(),
  target: z.string().nonempty(),
  isVip: z.boolean(),
  graphId: graphSchema.shape.id,
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
