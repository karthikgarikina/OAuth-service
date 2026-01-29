import { Request, Response } from "express";
import { createUser, validateUser } from "../services/auth.service";
import { generateTokens } from "../services/token.service";
import { verifyRefreshToken } from "../utils/jwt";
import { db } from "../config/db";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || password?.length < 8) {
    return res.status(400).json({
      error: "Name, valid email and password (min 8 chars) are required"
    });
  }

  try {
    const user = await createUser(name, email, password);
    return res.status(201).json(user);
  } catch {
    return res.status(409).json({
      error: "User with this email already exists"
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required"
    });
  }

  // Check if this email is linked to an OAuth provider
  const providerCheck = await db.query(
    `SELECT ap.provider
     FROM auth_providers ap
     JOIN users u ON u.id = ap.user_id
     WHERE u.email = $1`,
    [email]
  );

  if ((providerCheck.rowCount ?? 0) > 0) {
    return res.status(400).json({
      error: "OAuth account",
      message: `This account was created using ${providerCheck.rows[0].provider}. Please sign in with ${providerCheck.rows[0].provider}.`
    });
  }

  const user = await validateUser(email, password);
  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password"
    });
  }

  return res.json(generateTokens(user));
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      error: "Refresh token is required"
    });
  }

  try {
    const payload = verifyRefreshToken(refreshToken) as any;

    const { rows } = await db.query(
      "SELECT id, role FROM users WHERE id=$1",
      [payload.id]
    );

    if (!rows[0]) {
      return res.status(401).json({
        error: "User not found"
      });
    }

    return res.json(generateTokens(rows[0]));
  } catch {
    return res.status(401).json({
      error: "Invalid or expired refresh token"
    });
  }
};

