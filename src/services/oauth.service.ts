import { db } from "../config/db";
import { generateTokens } from "./token.service";

export const handleOAuthLogin = async (
  provider: "google" | "github",
  providerUserId: string,
  email: string,
  name: string
) => {
  // 1. Check provider mapping
  const existingProvider = await db.query(
    `SELECT user_id FROM auth_providers
     WHERE provider=$1 AND provider_user_id=$2`,
    [provider, providerUserId]
  );

  let userId: string;

  if (existingProvider.rowCount) {
    userId = existingProvider.rows[0].user_id;
  } else {
    // 2. Check email
    const existingUser = await db.query(
      `SELECT id FROM users WHERE email=$1`,
      [email]
    );

    if (existingUser.rowCount) {
      userId = existingUser.rows[0].id;
    } else {
      // 3. Create user
      const newUser = await db.query(
        `INSERT INTO users (email, name)
         VALUES ($1,$2)
         RETURNING id`,
        [email, name]
      );
      userId = newUser.rows[0].id;
    }

    // 4. Link provider
    await db.query(
      `INSERT INTO auth_providers (user_id, provider, provider_user_id)
       VALUES ($1,$2,$3)`,
      [userId, provider, providerUserId]
    );
  }

  // 5. Get role
  const { rows } = await db.query(
    `SELECT id, role FROM users WHERE id=$1`,
    [userId]
  );

  return generateTokens(rows[0]);
};
