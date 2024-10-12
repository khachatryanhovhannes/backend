import { NextFunction, Request, Response } from "express";
import { PermissionDeniedException } from "../exceptions/permissions-denied";
import { ErrorCode } from "../exceptions/root";

const verifyRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.user ||
      !req.roles ||
      !Array.isArray(req.roles) ||
      !(req.roles.length > 0)
    ) {
      return next(
        new PermissionDeniedException(
          "Permission denied",
          ErrorCode.PERMISSION_DENIED
        )
      );
    }

    const rolesArray = [...allowedRoles];
    const result = req.roles
      .map((role) => rolesArray.includes(role.name))
      .find((val) => val === true);

    if (!result) {
      return next(
        new PermissionDeniedException(
          "Permission denied",
          ErrorCode.PERMISSION_DENIED
        )
      );
    }
    next();
  };
};

export default verifyRoles;
