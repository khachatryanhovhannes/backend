import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";

type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;

export const errorHandler = (method: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      method(req, res, next);
    } catch (err) {
      let exception: HttpException;
      if (err instanceof HttpException) {
        exception = err;
      } else {
        exception = new InternalException(
          "Something went wrong",
          [],
          ErrorCode.INTERNAL_EXCEPTION
        );
      }
      next(exception);
    }
  };
};
