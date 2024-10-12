import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "../prismaClient";
import { verifyToken } from "../helpers/tokens";
import { InvalidTokenException } from "../exceptions/invalid-token";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
    );
  }

  const accessToken = authorizationHeader.split(" ")[1];

  if (!accessToken) {
    return next(
      new InvalidTokenException("Invalid token", ErrorCode.INVALID_TOKEN)
    );
  }

  try {
    const payload = await verifyToken(accessToken, next, "access");

    if (
      !payload ||
      typeof payload !== "object" ||
      typeof payload === "string"
    ) {
      return next(
        new InvalidTokenException(
          "Invalid token",
          ErrorCode.INVALID_TOKEN
        )
      );
    }

    const user = await prismaClient.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      return next(
        new UnauthorizedException("User not found", ErrorCode.USER_NOT_FOUND)
      );
    }

    user.password = "";

    req.user = user;

    next();
  } catch {
    return next(
      new UnauthorizedException(
        "Invalid or expired token",
        ErrorCode.UNAUTHORIZED
      )
    );
  }
};

export default authMiddleware;
