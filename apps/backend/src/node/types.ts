import { Infer } from "utils/types";
import { z } from "zod";

export const nodeSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
});

export const createRequestSchema = z.object({
  body: nodeSchema.omit({ id: true }),
});

export type CreateRequest = Infer<typeof createRequestSchema>;

export const updateByIdRequestSchema = z.object({
  params: nodeSchema.pick({ id: true }),
  body: nodeSchema.omit({ id: true }).partial(),
});

export type UpdateByIdRequest = Infer<typeof updateByIdRequestSchema>;

export const removeByIdRequestSchema = z.object({
  params: nodeSchema.pick({ id: true }),
});

export type RemoveByIdRequest = Infer<typeof removeByIdRequestSchema>;
