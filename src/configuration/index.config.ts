import dotenv from "dotenv";

dotenv.config();

export const configuration = {
  port: Number(process.env.PORT) || 8000,
  database_url: process.env.DATABASE_URL!,
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS),
  jwt_access_token: process.env.JWT_ACCESS_TOKEN!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
  app_url: process.env.APP_URL,
};
