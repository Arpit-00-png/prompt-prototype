-- Add submission fields to tasks table
-- This allows assignees to upload their work for creator review

-- Add submission_text field for text-based submissions
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS submission_text text;

-- Add submission_files field for file URLs (stored as JSON array)
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS submission_files jsonb;

-- Add submitted_at timestamp to track when work was submitted
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS submitted_at timestamp;

-- Add comments for documentation
COMMENT ON COLUMN public.tasks.submission_text IS 'Text content submitted by assignee when completing the task';
COMMENT ON COLUMN public.tasks.submission_files IS 'Array of file URLs or links submitted by assignee (stored as JSON)';
COMMENT ON COLUMN public.tasks.submitted_at IS 'Timestamp when the work was submitted for review';

