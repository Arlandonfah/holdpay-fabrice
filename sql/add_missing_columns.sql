-- Ajouter les colonnes manquantes à la table payments
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS revolut_order_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_provider TEXT CHECK (payment_provider IN ('revolut', 'stripe'));

-- Mettre à jour les enregistrements existants pour avoir updated_at
UPDATE payments 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_payments_updated_at ON payments(updated_at);
CREATE INDEX IF NOT EXISTS idx_payments_revolut_order_id ON payments(revolut_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_provider ON payments(payment_provider);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
