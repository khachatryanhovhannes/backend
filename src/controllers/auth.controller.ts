import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../prismaClient";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { ZodError, ZodIssue } from "zod";
import { LoginSchema, RegisterSchema } from "../schema/user.schema";
import { comparePasswordHash, generatePasswordHash } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../helpers/tokens";
import { InvalidTokenException } from "../exceptions/invalid-token";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    LoginSchema.parse(req.body);
    const { email, password } = req.body;

    const user = await prismaClient.user.findFirst({
      where: { email },
    });

    if (
      !user ||
      !user.password ||
      (await comparePasswordHash(password, user.password))
    ) {
      return next(
        new BadRequestsException(
          "Invalid username or password",
          ErrorCode.INVALID_CREDENTIALS
        )
      );
    }

    const tokens = {
      accessToken: await generateAccessToken(user),
      refreshToken: await generateRefreshToken(user),
    };

    await prismaClient.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    res.status(200).json(tokens);
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

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    RegisterSchema.parse(req.body);
    const { name, email, password } = req.body;

    const isUserExist = await prismaClient.user.findFirst({
      where: { email },
    });

    if (isUserExist) {
      return next(
        new BadRequestsException(
          "User already exists",
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
    }
    const hashedPassword = await generatePasswordHash(password);

    const user = await prismaClient.user.create({
      data: {
        name: name,
        email,
        password: hashedPassword,
      },
    });

    const userWithoutPassword = Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== "password")
    );

    res.status(201).json(userWithoutPassword);
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

export const getNewToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return next(
      new InvalidTokenException("Invalid token", ErrorCode.INVALID_TOKEN)
    );
  }
  try {
    const payload = await verifyToken(refreshToken, next, "refresh");

    if (!payload) {
      return next(
        new InvalidTokenException("Invalid token", ErrorCode.INVALID_TOKEN)
      );
    }

    const accessToken = await generateAccessToken(payload);

    res.status(200).json({ accessToken, refreshToken });
  } catch {
    return next(
      new InvalidTokenException("Invalid token", ErrorCode.INVALID_TOKEN)
    );
  }
};
