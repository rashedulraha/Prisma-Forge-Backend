import { Router } from "express";

import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";

export const userRouter = Router();

// Registration
userRouter.post("/registration", userController.RegisterUser);

// Get Profile
userRouter.get("/me", auth(), userController.getProfileMe);
