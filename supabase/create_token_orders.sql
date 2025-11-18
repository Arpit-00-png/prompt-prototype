-- Create token_orders table if it doesn't exist
-- This table stores token purchase orders

CREATE TABLE IF NOT EXISTS public.token_orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES public.profiles (id),
  buyer_name text,
  buyer_email text,
  buyer_type text,
  organization text,
  amount int,
  status text,
  created_at timestamp DEFAULT now()
);

-- Add comment to the table
COMMENT ON TABLE public.token_orders IS 'Stores token purchase orders for tracking and invoicing';

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_token_orders_user_id ON public.token_orders(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_token_orders_created_at ON public.token_orders(created_at DESC);

