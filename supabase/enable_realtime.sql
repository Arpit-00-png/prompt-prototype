-- Enable real-time replication for the tasks table
-- This allows Supabase real-time subscriptions to work across all devices

-- Add the tasks table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Note: If you get an error that the publication doesn't exist or the table is already added,
-- you can also enable real-time through the Supabase Dashboard:
-- 1. Go to Database > Replication
-- 2. Find the 'tasks' table
-- 3. Toggle the switch to enable replication

-- For Supabase projects, real-time is enabled by default for tables in the public schema,
-- but you may need to enable it manually in the dashboard if it's not working.

