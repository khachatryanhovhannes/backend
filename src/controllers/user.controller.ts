import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../prismaClient";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { ZodError, ZodIssue } from "zod";
import { UpdateUserSchema } from "../schema/user.schema";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { omit } from "lodash";

export const getMe = async (req: Request, res: Response) => {
  res.status(200).json({ user: req.user });
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = parseInt(req.params.id);
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return next(
      new NotFoundException(
        `User ${userId} not found`,
        ErrorCode.USER_NOT_FOUND
      )
    );
  }

  await prismaClient.user.delete({
    where: { id: userId },
  });

  res.status(204).send();
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    UpdateUserSchema.parse(req.body);

    const { name } = req.body;
    const user = req.user;
    if (!user) {
      return next(
        new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
      );
    }

    const updatedUser = await prismaClient.user.update({
      where: { email: user.email },
      data: { name },
    });

    if (!updatedUser) {
      return next(
        new NotFoundException(`User not found`, ErrorCode.USER_NOT_FOUND)
      );
    }

    res
      .status(202)
      .json({ user: omit(updatedUser, ["password", "refreshToken"]) });
    req.user = updatedUser;
  } catch (err) {
    if (err instanceof ZodError) {
      const errorMessages: string[] = err.errors.map(
        (issue: ZodIssue) => issue.message
      );

      next(
        new UnprocessableEntity(
          errorMessages,
          "Unprocessable entity",
          ErrorCode.UNPROCESSABLE_ENTITY
        )
      );
    } else {
      next(err);
    }
  }
};
