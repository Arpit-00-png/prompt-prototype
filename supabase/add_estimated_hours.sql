-- Add estimated_hours field to tasks table
-- This helps track how many hours should be deducted from staked hours when task is completed

ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS estimated_hours int DEFAULT 1;

COMMENT ON COLUMN public.tasks.estimated_hours IS 'Estimated hours to complete this task. Used to deduct from available_hours when task is approved. Default is 1 hour.';

