-- Table pour stocker les transactions de paiement
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    payment_link_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    revolut_order_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded')),
    provider TEXT NOT NULL CHECK (provider IN ('revolut', 'stripe')),
    provider_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Index pour les recherches fréquentes
    CONSTRAINT unique_revolut_order UNIQUE (revolut_order_id),
    CONSTRAINT unique_stripe_intent UNIQUE (stripe_payment_intent_id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_link_id ON payment_transactions(payment_link_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_revolut_order_id ON payment_transactions(revolut_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider ON payment_transactions(provider);

-- Ajouter des colonnes à la table payments pour les intégrations
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS revolut_order_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_provider TEXT CHECK (payment_provider IN ('revolut', 'stripe'));

-- Politiques RLS pour payment_transactions
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres transactions
CREATE POLICY "Users can view their own payment transactions" 
ON payment_transactions FOR SELECT 
USING (
    payment_link_id IN (
        SELECT id FROM payments WHERE freelancer_id = auth.uid()::text
    )
);

-- Politique pour permettre l'insertion de transactions
CREATE POLICY "Users can insert payment transactions for their payment links" 
ON payment_transactions FOR INSERT 
WITH CHECK (
    payment_link_id IN (
        SELECT id FROM payments WHERE freelancer_id = auth.uid()::text
    )
);

-- Politique pour permettre la mise à jour des transactions
CREATE POLICY "Users can update their own payment transactions" 
ON payment_transactions FOR UPDATE 
USING (
    payment_link_id IN (
        SELECT id FROM payments WHERE freelancer_id = auth.uid()::text
    )
);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour payment_transactions
CREATE TRIGGER update_payment_transactions_updated_at 
    BEFORE UPDATE ON payment_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour payments
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
