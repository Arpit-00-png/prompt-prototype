-- Create reward_redemptions table if it doesn't exist
-- This table stores user redemptions of rewards from the catalog

CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reward_id bigint REFERENCES public.reward_catalog (id),
  user_id uuid REFERENCES public.profiles (id),
  status text DEFAULT 'pending',
  notes text,
  created_at timestamp DEFAULT now()
);

-- Add comment to the table
COMMENT ON TABLE public.reward_redemptions IS 'Stores user redemptions of rewards from the catalog';

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_user_id ON public.reward_redemptions(user_id);

-- Create index on reward_id for faster queries
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_reward_id ON public.reward_redemptions(reward_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_status ON public.reward_redemptions(status);

