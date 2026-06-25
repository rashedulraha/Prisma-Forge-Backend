import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { configuration } from "./configuration/index.config";
import { prisma } from "./lib/prisma";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";

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

//* register user

app.post("/api/users/register", async (req: Request, res: Response) => {
  const { name, email, password, profilePhoto } = req.body;

  // check if user already exist
  const isExistUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isExistUser) {
    throw new Error("user with email already exist");
  }

  //* hashing password bcrypt
  const hashPassword = await bcrypt.hash(
    password,
    Number(configuration.bcrypt_salt_rounds),
  );

  console.log("step 4");

  // * create user
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  //* create user profile
  await prisma.profile.create({
    data: {
      userId: createdUser.id,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
  });

  // console.log("Payload :", payload);

  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User register successfully!",
    data: user,
  });
});

export default app;
