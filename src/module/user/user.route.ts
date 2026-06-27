import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { configuration } from "../../configuration/index.config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";

// declare global type interfaces
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

// * user registration
userRouter.post("/registration", userController.RegisterUser);
// * get profile me
userRouter.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    // console.log("request cookie : ", req.cookies);

    const { access_token } = req.cookies;

    // console.log("access token check : ", access_token);

    const verifiedToken = jwtUtils.verifiedToken(
      access_token,
      configuration.jwt_access_token_secret,
    );

    // console.log("verified token : ", verifiedToken);

    if (typeof verifiedToken === "string") {
      throw new Error(verifiedToken);
    }

    const { id, name, email, role } = verifiedToken;
    const requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER];

    if (!requiredRoles.includes(role)) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: true,
        statusCode: httpStatus.FORBIDDEN,
        message: "forbidden access, you don't have an access in this routes",
      });
    }

    // console.log(verifiedToken);

    req.user = {
      id,
      name,
      email,
      role,
    };

    next();
  },
  userController.getProfileMe,
);
