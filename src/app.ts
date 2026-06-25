import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { configuration } from "./configuration/index.config";
import { prisma } from "./lib/prisma";

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

app.get("/", (req, res) => {
  console.log("HOME ROUTE HIT");
  res.status(200).json({
    success: true,
    message: "Starting route",
  });
});

app.get("/user", async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();
  // res.status(200).json({ data: user });
  console.log("User data:", user);
});

export default app;
