-- Create RPC function to update payment link status
CREATE OR REPLACE FUNCTION update_payment_link_status(
  payment_link_id UUID,
  new_status TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.payment_links 
  SET 
    status = new_status,
    delivered_at = CASE 
      WHEN new_status = 'delivered' THEN NOW() 
      ELSE delivered_at 
    END,
    updated_at = NOW()
  WHERE id = payment_link_id;
END;
$$;