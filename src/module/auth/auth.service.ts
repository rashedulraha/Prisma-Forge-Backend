import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interfaces";

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
  const { password: _, ...loginUser } = user;

  return loginUser;
};

export const authService = {
  loginUser,
};
