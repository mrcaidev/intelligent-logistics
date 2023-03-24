import { z } from "zod";

export const goodSchema = z.object({
  id: z.string().length(10),
  name: z.string(),
  createdAt: z.string().datetime(),
  source: z.string(),
  target: z.string(),
  isVip: z.boolean(),
  graphId: z.string().length(10),
});

export type Good = z.infer<typeof goodSchema>;

export const createReqSchema = z.object({
  body: goodSchema.omit({ id: true, createdAt: true }),
});

export type CreateReq = z.infer<typeof createReqSchema>;

export const updateReqSchema = z.object({
  params: z.object({ id: z.string().length(10) }),
  body: goodSchema.omit({ id: true, createdAt: true }).partial(),
});

export type UpdateReq = z.infer<typeof updateReqSchema>;

export const deleteReqSchema = z.object({
  params: z.object({ id: z.string().length(10) }),
});

export type DeleteReq = z.infer<typeof deleteReqSchema>;
