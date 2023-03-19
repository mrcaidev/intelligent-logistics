import type { NextFunction, Request, Response } from "express";
import { HttpError } from "src/utils/error";

export function handleError(
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof HttpError) {
    return res
      .status(error.status)
      .json({ message: error.message, data: null });
  }

  return res.status(500).json({ message: error.message, data: null });
}
