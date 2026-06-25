import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { configuration } from "./configuration/index.config";

const app: Application = express();

// middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: configuration.app_url,
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Starting route" });
});
export default app;
