import dotenv from "dotenv";

dotenv.config();

export const env = {
  API_PORT: process.env.API_PORT || 8080,
  DATABASE_URL: process.env.DATABASE_URL as string,
  REDIS_URL: process.env.REDIS_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID as string,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET as string
};
