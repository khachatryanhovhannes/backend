import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { addImage, deleteImage } from "../controllers/image.controller";
import { upload } from "../middlewares/upload";

const imageRouter = Router();

imageRouter.post("/", [authMiddleware, upload.single("image")], addImage);
imageRouter.delete("/:filename", [authMiddleware], deleteImage);

export default imageRouter;
