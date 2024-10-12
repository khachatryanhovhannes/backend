import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import { errorHandler } from "../error-handler";

const router: Router = Router();

router.use("/auth", errorHandler(authRouter));
router.use("/user", errorHandler(userRouter));

export default router;
