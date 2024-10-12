import { Router } from "express";
import { deleteUser, getMe, updateMe } from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth";
import verifyRoles from "../middlewares/verifyRoles";

const userRouter: Router = Router();
userRouter.get("/me", [authMiddleware], getMe);
userRouter.delete("/:id", [authMiddleware, verifyRoles("Admin")], deleteUser);
userRouter.put("/me", [authMiddleware], updateMe);

export default userRouter;
