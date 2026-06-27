import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { configuration } from "../configuration/index.config";
import { ErrorThrow } from "../utils/errorThrow";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

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

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    const token =
      req.cookies?.access_token ??
      (authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined);

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
    next();
  });
};
