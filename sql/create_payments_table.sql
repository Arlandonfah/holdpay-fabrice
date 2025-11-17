-- Créer la table payments si elle n'existe pas
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    freelancer_id TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    project_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'delivered', 'released', 'expired', 'processing', 'contested')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    link_url TEXT NOT NULL UNIQUE,
    pdf_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Nouvelles colonnes pour Revolut Pay
    revolut_order_id TEXT,
    stripe_payment_intent_id TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    payment_provider TEXT CHECK (payment_provider IN ('revolut', 'stripe'))
);

-- Activer RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres liens
CREATE POLICY IF NOT EXISTS "Users can view their own payment links" 
ON payments FOR SELECT 
USING (freelancer_id = auth.uid()::text);

-- Politique pour permettre aux utilisateurs de créer des liens
CREATE POLICY IF NOT EXISTS "Users can create payment links" 
ON payments FOR INSERT 
WITH CHECK (freelancer_id = auth.uid()::text);

-- Politique pour permettre aux utilisateurs de modifier leurs liens
CREATE POLICY IF NOT EXISTS "Users can update their own payment links" 
ON payments FOR UPDATE 
USING (freelancer_id = auth.uid()::text);

-- Politique pour permettre l'accès public aux liens de paiement (pour les clients)
CREATE POLICY IF NOT EXISTS "Public can view payment links for payment" 
ON payments FOR SELECT 
USING (true);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_payments_freelancer_id ON payments(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_payments_link_url ON payments(link_url);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_revolut_order_id ON payments(revolut_order_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
