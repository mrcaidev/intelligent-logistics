import { Infer } from "utils/types";
import { z } from "zod";

export const graphSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
});

export type Graph = Infer<typeof graphSchema>;

export const createRequestSchema = z.object({
  body: graphSchema.omit({ id: true }),
});

export type CreateRequest = Infer<typeof createRequestSchema>;

export const updateByIdRequestSchema = z.object({
  params: graphSchema.pick({ id: true }),
  body: graphSchema.omit({ id: true }).partial(),
});

export type UpdateByIdRequest = Infer<typeof updateByIdRequestSchema>;

export const removeByIdRequestSchema = z.object({
  params: graphSchema.pick({ id: true }),
});

export type RemoveByIdRequest = Infer<typeof removeByIdRequestSchema>;
