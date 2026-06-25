import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IRegistration } from "./user.interfaces";
import { configuration } from "../../configuration/index.config";

const userRegistrationService = async (payload: IRegistration) => {
  const { name, email, password, profilePhoto } = payload;

  // check if user already exist in database
  const existUser = await prisma.user.findUnique({ where: { email } });

  if (existUser) {
    throw new Error("Email already used");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(configuration.bcrypt_salt_rounds),
  );

  // * inter  user data in database and create account
  const createUser = await prisma.user.create({
    data: { name, email, password: hashPassword },
  });

  // * profile creation
  await prisma.profile.create({
    data: { userId: createUser.id, profilePhoto },
  });

  // * find user

  const user = await prisma.user.findUnique({
    where: { id: createUser.id, email: createUser.email || email },
    omit: { password: true },
    include: { profile: true },
  });

  // return user data

  return user;
};

// export user services
export const userService = {
  userRegistrationService,
};
