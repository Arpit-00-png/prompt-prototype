# Fix Database Issues Guide

## Issue 1: "Could not find the table 'public.token_orders' in the schema cache"

### Problem
The `token_orders` table is defined in your schema but hasn't been created in your Supabase database.

### Solution

**Option 1: Run the SQL Migration (Recommended)**

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Open the file `supabase/create_token_orders.sql` from this project
4. Copy and paste the SQL into the editor
5. Click **Run** to execute the query

**Option 2: Run the Full Schema**

If you haven't run your schema.sql file yet:

1. Go to **SQL Editor** in Supabase Dashboard
2. Open `supabase/schema.sql` from this project
3. Copy and paste the entire file
4. Click **Run** to create all tables

**Option 3: Use Supabase CLI (if you have it set up)**

```bash
supabase db push
```

### Verify the Table Exists

After running the migration, verify the table exists:

1. Go to **Table Editor** in Supabase Dashboard
2. Look for `token_orders` in the list of tables
3. If it's there, the issue is fixed!

---

## Issue 2: "Insufficient tokens" Error

### Problem
This error occurs when:
- You try to **assign yourself to a task** that has a reward
- The task creator doesn't have enough tokens to escrow the reward amount

### How It Works
When someone assigns themselves to a task with a reward:
1. The system checks if the task creator has enough tokens
2. If yes, it escrows (locks) those tokens until the task is completed
3. If no, it throws "Insufficient tokens" error

### Solutions

**Solution 1: Task Creator Needs to Buy/Stake Tokens**

The person who created the task needs to:
- **Buy tokens** from the "Buy Tokens" page, OR
- **Stake hours** from the "Stake Hours" page (which mints tokens)

**Solution 2: Create Tasks with 0 Reward**

If you're testing, create tasks with `reward: 0` to avoid this check.

**Solution 3: Check Token Balance**

1. Go to Dashboard
2. Check your "Token balance" section
3. Make sure you have enough tokens before creating tasks with rewards

### Understanding Token Flow

```
1. Stake Hours → Mint Tokens (1 token per hour staked)
2. Buy Tokens → Mint Tokens (direct purchase)
3. Create Task with Reward → No tokens needed (yet)
4. Assign Task → Escrow tokens from creator (requires creator has tokens)
5. Complete Task → Release escrowed tokens to assignee
```

### Example Scenario

- Alice creates a task with 10 TBM reward
- Alice needs at least 10 TBM in her balance
- Bob assigns to the task
- System escrows 10 TBM from Alice
- When task is completed, Bob receives 10 TBM

---

## Quick Fix Checklist

- [ ] Run `supabase/create_token_orders.sql` in SQL Editor
- [ ] Verify `token_orders` table exists in Table Editor
- [ ] Test buying tokens (should work now)
- [ ] Check token balance before creating tasks with rewards
- [ ] Stake hours or buy tokens if balance is low

---

## Still Having Issues?

1. **Check Supabase Connection**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env`
   - Make sure you're connected to the correct Supabase project

2. **Check Database Permissions**
   - Ensure your Supabase project has the correct API keys
   - Check if Row Level Security (RLS) is blocking operations

3. **Clear Cache**
   - Sometimes Supabase caches table schemas
   - Wait a few minutes after creating tables
   - Or restart your development server

4. **Check Browser Console**
   - Open DevTools (F12)
   - Look for detailed error messages
   - Check Network tab for failed API calls

