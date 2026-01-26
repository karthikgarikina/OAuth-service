import { Request, Response } from "express";
import { db } from "../config/db";

export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { rows } = await db.query(
    "SELECT id, name, email, role FROM users WHERE id=$1",
    [user.id]
  );

  return res.json(rows[0]);
};

export const updateMe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Name is required"
    });
  }

  const { rows } = await db.query(
    `UPDATE users SET name=$1 WHERE id=$2
     RETURNING id, name, email, role`,
    [name, user.id]
  );

  return res.json(rows[0]);
};

export const listUsers = async (_: Request, res: Response) => {
  const { rows } = await db.query(
    "SELECT id, name, email, role FROM users"
  );

  return res.json(rows);
};

