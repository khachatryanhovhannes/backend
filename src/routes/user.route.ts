import { Router } from "express";
import { getMe } from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth";

const userRouter: Router = Router();
userRouter.get("/me", [authMiddleware], getMe);


export default userRouter;
