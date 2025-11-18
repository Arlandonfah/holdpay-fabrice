-- Table des utilisateurs applicatifs
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY,
    email text NOT NULL UNIQUE,
    first_name text,
    last_name text,
    full_name text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Un utilisateur peut voir / modifier uniquement son propre profil
CREATE POLICY IF NOT EXISTS "Users can view own profile"
ON users FOR SELECT
USING (id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update own profile"
ON users FOR UPDATE
USING (id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can insert own profile"
ON users FOR INSERT
WITH CHECK (id = auth.uid());

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();
