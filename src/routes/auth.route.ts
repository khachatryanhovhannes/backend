import { Router } from "express";
import { getNewToken, login, register } from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/new_token", getNewToken);

export default authRouter;
