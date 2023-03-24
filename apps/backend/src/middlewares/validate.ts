import type { NextFunction, Request, Response } from "express";
import { ZodError, type AnyZodObject } from "zod";

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.passthrough().parseAsync(req);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ message: error.issues[0]?.message ?? "请求数据格式错误" });
      }
      return next(error);
    }
  };
}
