# Real-Time Setup Guide

This guide will help you enable real-time features for your Supabase project so that marketplace changes are visible across all devices and accounts.

## Problem
When items are added to the marketplace from one device, they were only visible on that device. Other devices/users couldn't see the changes until they refreshed the page.

## Solution
We've implemented Supabase real-time subscriptions that automatically update the UI when changes occur in the database.

## Steps to Enable Real-Time

### 1. Enable Real-Time Replication in Supabase Dashboard

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Navigate to **Database** → **Replication** (or **Database** → **Publications** in older versions)
3. Find the `tasks` table in the list
4. Toggle the switch to **enable replication** for the `tasks` table
5. If you don't see the `tasks` table listed, you may need to run the SQL migration (see step 2)

### 2. Run SQL Migration (Alternative Method)

If you prefer to use SQL, you can run the migration file:

1. Go to **SQL Editor** in your Supabase dashboard
2. Open the file `supabase/enable_realtime.sql`
3. Copy and paste the SQL into the editor
4. Run the query

The SQL command is:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
```

**Note:** If you get an error that the publication doesn't exist, real-time might already be enabled by default for your project. Check the dashboard method instead.

### 3. Verify Real-Time is Working

1. Open your application in two different browser windows (or devices)
2. Sign in with different accounts (or the same account on different devices)
3. In one window, create a new task in the marketplace
4. The task should **automatically appear** in the other window without refreshing

## What Was Changed

### Code Changes

1. **Marketplace Page** (`app/marketplace/page.js`)
   - Added real-time subscription to listen for all changes to the `tasks` table
   - Automatically refetches tasks when INSERT, UPDATE, or DELETE events occur

2. **Dashboard Page** (`app/dashboard/page.js`)
   - Added real-time subscription for user-specific task updates
   - Only refetches when tasks relevant to the current user change

### How It Works

- When a task is created, updated, or deleted in the database, Supabase sends a real-time event
- The subscription listener receives the event and automatically refetches the tasks
- The UI updates immediately without requiring a page refresh

## Troubleshooting

### Real-Time Not Working?

1. **Check Replication Status**
   - Go to Database → Replication in Supabase dashboard
   - Ensure `tasks` table has replication enabled (toggle should be ON)

2. **Check Browser Console**
   - Open browser DevTools (F12)
   - Look for console messages like "Task change received:"
   - If you see errors, check the Network tab for WebSocket connection issues

3. **Verify Supabase Client Configuration**
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly in your `.env` file

4. **Check Row Level Security (RLS)**
   - If RLS is enabled on the `tasks` table, ensure policies allow SELECT operations
   - Real-time subscriptions require read access to the table

5. **Test WebSocket Connection**
   - Real-time uses WebSockets, so ensure your network/firewall allows WebSocket connections
   - Check if you're behind a corporate firewall that might block WebSockets

### Still Having Issues?

- Check Supabase status page: https://status.supabase.com
- Review Supabase real-time documentation: https://supabase.com/docs/guides/realtime
- Ensure you're using the latest version of `@supabase/supabase-js`

## Additional Notes

- Real-time subscriptions are automatically cleaned up when components unmount
- Each page uses a unique channel name to avoid conflicts
- The implementation uses `useCallback` to prevent unnecessary re-renders
- Real-time works across all devices and browsers that have the page open

