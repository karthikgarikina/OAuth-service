CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE auth_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  UNIQUE (provider, provider_user_id)
);

-- Seed users
INSERT INTO users (email, password_hash, name, role)
VALUES
(
  'admin@example.com',
  '$2b$10$NCnW9IT3m00lZgLlrm75Se5pKy8f5tiVWSnWPfqKw4ceJx8TRdz2W',
  'Admin',
  'admin'
),
(
  'user@example.com',
  '$2b$10$/o8B3GxyA/4gRe85eksuVeQRCeemBIW3st.93F/NhZs0gOwTlq33q',
  'User',
  'user'
);
