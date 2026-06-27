import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";

export interface IJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const createToken = (
  payload: IJwtPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
): string => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

const verifiedToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret) as IJwtPayload;
    return { success: true, data: verifiedToken };
  } catch (error) {
    return { success: false, data: (error as Error).message };
  }
};

export const jwtUtils = {
  createToken,
  verifiedToken,
};
