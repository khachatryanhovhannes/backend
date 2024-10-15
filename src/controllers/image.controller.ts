import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { UploadException } from "../exceptions/upload";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "../prismaClient";
import { PermissionDeniedException } from "../exceptions/permissions-denied";

export const addImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;

    if (!file) {
      return next(
        new UploadException("Error uploading image", ErrorCode.UPLOAD_ERROR)
      );
    }

    if (!req.user || !req.user.id) {
      return next(
        new PermissionDeniedException(
          "Permission denied",
          ErrorCode.PERMISSION_DENIED
        )
      );
    }

    await prismaClient.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        imagePath: file.filename,
      },
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      file: {
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        size: file.size,
      },
    });
  } catch {
    return next(
      new UploadException("Error uploading image", ErrorCode.UPLOAD_ERROR)
    );
  }
};

export const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../..", "/uploads", filename);

  console.log(filePath);

  if (req.user?.imagePath !== filename) {
    return next(
      new PermissionDeniedException(
        "Permission denied",
        ErrorCode.PERMISSION_DENIED
      )
    );
  }

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully." });
    } else {
      return next(
        new UploadException("Error deleting image", ErrorCode.UPLOAD_ERROR)
      );
    }
  } catch {
    return next(
      new UploadException("Error deleting image", ErrorCode.UPLOAD_ERROR)
    );
  }
};
