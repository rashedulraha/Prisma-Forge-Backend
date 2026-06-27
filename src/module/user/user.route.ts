import { NextFunction, Request, Response, Router } from "express";
import httpStatus from "http-status";

import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { configuration } from "../../configuration/index.config";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { ErrorThrow } from "../../utils/errorThrow";

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const userRouter = Router();

// Registration
userRouter.post("/registration", userController.RegisterUser);

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.access_token ||
      req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error(
        "your are not logged in. please login in to access this request",
      );
    }

    const verifiedToken = jwtUtils.verifiedToken(
      token,
      configuration.jwt_access_token_secret,
    );

    if (!verifiedToken.success) {
      ErrorThrow(verifiedToken.data as string);
    }

    const { id, name, email, role } = verifiedToken.data as JwtPayload;

    if (!requiredRoles.includes(role)) {
      ErrorThrow(
        "Forbidden. you don't have permission to access this request ",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id, name, email, role },
    });

    if (!user) {
      ErrorThrow("User not found . please log in again");
    }

    if (user?.activeStatus === "BLOCK") {
      ErrorThrow("Your account has ben blocked. please contact support");
    }
  });
};

// Get Profile
userRouter.get("/me", userController.getProfileMe);
