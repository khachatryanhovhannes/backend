import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const REFRESH_SECRET = process.env.REFRESH_SECRET!
