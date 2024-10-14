import multer from "multer";
import { UploadException } from "../exceptions/upload";
import { ErrorCode } from "../exceptions/root";

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    new UploadException("Error uploading image", ErrorCode.UPLOAD_ERROR);
  }
};

export const upload = multer({ dest: "uploads/", fileFilter });
