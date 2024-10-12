import express, { Express } from "express";
import { PORT } from "./constants";
import router from "./routes/index.route";
import { errorMiddleware } from "./middlewares/errors";
import cors from "cors";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
