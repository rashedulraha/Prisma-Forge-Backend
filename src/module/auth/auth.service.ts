import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

import { prisma } from "../../lib/prisma";
import { configuration } from "../../configuration/index.config";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser } from "./auth.interfaces";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  // Input validation
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // User status check
  if (user.activeStatus !== "ACTIVE") {
    throw new Error("Your account is inactive or blocked.");
  }

  // Password check
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Incorrect password.");
  }

  // JWT Payload
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // Generate Access Token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    configuration.jwt_access_token_secret,
    configuration.jwt_access_expires_in,
  );

  // Generate Refresh Token
  const newRefreshToken = jwtUtils.createToken(
    jwtPayload,
    configuration.jwt_access_token_secret,
    configuration.jwt_access_expires_in,
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Refresh token is required.");
  }

  // Verify Refresh Token
  const verifiedToken = jwtUtils.verifiedToken(
    token,
    configuration.jwt_refresh_secret,
  );

  const { id } = verifiedToken as JwtPayload;

  // Find user
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // User status check
  if (user.activeStatus !== "ACTIVE") {
    throw new Error("Your account is inactive or blocked.");
  }

  // JWT Payload
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // Generate new Access Token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    configuration.jwt_access_token_secret,
    configuration.jwt_access_expires_in,
  );

  return {
    accessToken,
  };
};

export const authService = {
  loginUser,
  refreshToken,
};
