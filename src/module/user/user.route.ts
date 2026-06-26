import { Router } from "express";
import { userController } from "./user.controller";

export const userRouter = Router();

// * user registration
userRouter.post("/registration", userController.RegisterUser);
// * get profile me
userRouter.get("/me", userController.getProfileMe);
