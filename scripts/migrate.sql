-- ErickMachine portfolio database schema

CREATE TABLE IF NOT EXISTS contacts (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  service     TEXT,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'read', 'replied')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id         TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);
