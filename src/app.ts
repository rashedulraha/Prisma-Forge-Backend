import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { configuration } from "./configuration/index.config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { UserRouter } from "./module/user/user.route";

const app: Application = express();

// middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: configuration.app_url, credentials: true }));

// * api creation
app.get("/", (req, res) => {
  console.log("HOME ROUTE HIT");
  res.status(200).json({
    success: true,
    message: "Starting route",
  });
});

//* user activity routers
app.use("/api/user", UserRouter);

//* register user

export default app;
