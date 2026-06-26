import { Router } from "express";
import { userController } from "./user.controller";

export const UserRouter = Router();

UserRouter.post("/registration", userController.RegisterUser);
