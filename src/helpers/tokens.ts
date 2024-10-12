import { User } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_SECRET } from "../constants";
import { NextFunction } from "express";
import { InvalidTokenException } from "../exceptions/invalid-token";
import { ErrorCode } from "../exceptions/root";

export const generateAccessToken = async (user: User): Promise<string> => {
  return await jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = async (user: User): Promise<string> => {
  return await jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    REFRESH_SECRET
  );
};

export const verifyToken = async (
  token: string,
  next: NextFunction,
  secretType: string
): Promise<User | null> => {
  let secret;
  if (secretType === "refresh") {
    secret = REFRESH_SECRET;
  } else {
    secret = JWT_SECRET;
  }
  return new Promise((resolve) => {
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return next(
          new InvalidTokenException("Invalid token", ErrorCode.INVALID_TOKEN)
        );
      }

      resolve(user as User);
    });
  });
};
