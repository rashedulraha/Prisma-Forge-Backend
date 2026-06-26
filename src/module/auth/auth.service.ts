import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interfaces";
import jwt, { SignOptions } from "jsonwebtoken";
import { configuration } from "../../configuration/index.config";
import { jwtUtils } from "../../utils/jwt";

const loginUser = async (Payload: ILoginUser) => {
  const { email, password } = Payload;

  // find or throw data
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const isMatchPassword = await bcrypt.compare(password, user.password);

  if (!isMatchPassword) {
    throw new Error("Password is incorrect");
  }

  // jwt payload
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // create access token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    configuration.jwt_refresh_secret,
    configuration.jwt_refresh_expires_in as SignOptions,
  );

  // create refresh token
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    configuration.jwt_refresh_secret,
    configuration.jwt_refresh_expires_in as SignOptions,
  );

  return { accessToken, refreshToken };
};

export const authService = {
  loginUser,
};
