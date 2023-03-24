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

export const createRequestSchema = z.object({
  body: goodSchema.omit({
    id: true,
    createdAt: true,
  }),
});

export type CreateRequest = z.infer<typeof createRequestSchema>;

export const updateRequestSchema = z.object({
  params: z.object({
    id: z.string().length(10),
  }),
  body: goodSchema
    .omit({
      id: true,
      createdAt: true,
      isVip: true,
    })
    .partial(),
});

export type UpdateRequest = z.infer<typeof updateRequestSchema>;

export const deleteRequestSchema = z.object({
  params: z.object({
    id: z.string().length(10),
  }),
});

export type DeleteRequest = z.infer<typeof deleteRequestSchema>;
