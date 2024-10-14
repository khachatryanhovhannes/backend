import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { UploadException } from "../exceptions/upload";
import { ErrorCode } from "../exceptions/root";

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
