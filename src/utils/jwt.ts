import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });

export const signRefreshToken = (payload: object) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET);
