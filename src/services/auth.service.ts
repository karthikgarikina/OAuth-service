import { db } from "../config/db";
import { hashPassword, comparePassword } from "../utils/password";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const passwordHash = await hashPassword(password);

  const { rows } = await db.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role`,
    [name, email, passwordHash]
  );

  return rows[0];
};

export const validateUser = async (email: string, password: string) => {
  const { rows } = await db.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (!rows[0]) return null;

  const valid = await comparePassword(
    password,
    rows[0].password_hash
  );

  if (!valid) return null;

  return rows[0];
};
