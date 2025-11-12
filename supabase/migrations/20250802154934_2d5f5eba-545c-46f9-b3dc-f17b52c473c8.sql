-- Add client_email column to payment_links table
ALTER TABLE public.payment_links 
ADD COLUMN client_email TEXT;