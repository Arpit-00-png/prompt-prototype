-- Insert default rewards that users can easily claim
-- These rewards are available immediately without admin setup

-- First, create the reward_catalog table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.reward_catalog (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text,
  description text,
  cost_tokens int NOT NULL,
  sponsor text,
  coupon_code text,
  inventory int DEFAULT 0,
  metadata jsonb,
  created_at timestamp DEFAULT now()
);

-- Create reward_redemptions table if it doesn't exist (needed for redeeming rewards)
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reward_id bigint REFERENCES public.reward_catalog (id),
  user_id uuid REFERENCES public.profiles (id),
  status text DEFAULT 'pending',
  notes text,
  created_at timestamp DEFAULT now()
);

-- Now insert the default rewards
INSERT INTO public.reward_catalog (title, description, cost_tokens, sponsor, coupon_code, inventory, metadata)
VALUES
  -- Low-cost rewards
  ('Community Badge', 'Get a special community contributor badge on your profile', 5, 'TBM Collective', NULL, NULL, '{"type": "badge", "category": "recognition"}'),
  
  ('Profile Highlight', 'Get your profile featured on the marketplace for 1 week', 10, 'TBM Collective', NULL, NULL, '{"type": "feature", "category": "visibility"}'),
  
  ('Early Access', 'Get early access to new features and beta programs', 15, 'TBM Collective', NULL, NULL, '{"type": "access", "category": "perks"}'),
  
  -- Medium-cost rewards
  ('Mentorship Session', '1-on-1 mentorship session with an industry expert', 25, 'TBM Collective', NULL, 10, '{"type": "mentorship", "category": "learning", "duration": "1 hour"}'),
  
  ('Swag Pack', 'TBM Collective branded swag pack (t-shirt, stickers, etc.)', 30, 'TBM Collective', NULL, 50, '{"type": "physical", "category": "merchandise"}'),
  
  ('Workshop Access', 'Access to exclusive workshops and training sessions', 40, 'TBM Collective', NULL, NULL, '{"type": "workshop", "category": "learning"}'),
  
  -- Higher-cost rewards
  ('Premium Support', 'Priority support and faster response times', 50, 'TBM Collective', NULL, NULL, '{"type": "support", "category": "service"}'),
  
  ('Featured Project', 'Get your project featured on the homepage for 1 month', 75, 'TBM Collective', NULL, 5, '{"type": "feature", "category": "visibility", "duration": "1 month"}'),
  
  ('VIP Event Access', 'VIP access to TBM Collective events and meetups', 100, 'TBM Collective', NULL, 20, '{"type": "event", "category": "networking"}');

-- Note: If you run this multiple times, it will create duplicate rewards.
-- To avoid duplicates, delete existing rewards first or use setup_rewards_complete.sql instead.

