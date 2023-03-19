import type { Good } from "./models";

export type CreateDto = Omit<Good, "id" | "createdAt">;

export type UpdateDto = Partial<Omit<Good, "id" | "createdAt">>;
