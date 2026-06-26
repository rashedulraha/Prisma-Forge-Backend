import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

// * verified  access token
// verified token
export const verifiedToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return verifiedToken;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const jwtUtils = {
  createToken,
  verifiedToken,
};
