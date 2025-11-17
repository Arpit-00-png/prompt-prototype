# Step-by-Step Fix Procedure

Follow these steps in order to fix both issues:

## Issue 1: Fix "Could not find the table 'public.token_orders'" Error

### Step 1: Open Supabase Dashboard
1. Go to https://app.supabase.com
2. Sign in to your account
3. Select your project

### Step 2: Open SQL Editor
1. In the left sidebar, click on **"SQL Editor"** (or find it under "Database" section)
2. Click **"New query"** button (top right)

### Step 3: Run the Migration
1. Open the file `supabase/create_token_orders.sql` from this project
2. **Copy ALL the contents** of that file
3. **Paste** it into the SQL Editor in Supabase
4. Click the **"Run"** button (or press Ctrl+Enter / Cmd+Enter)

### Step 4: Verify Table Was Created
1. In the left sidebar, click on **"Table Editor"**
2. Look for **"token_orders"** in the list of tables
3. If you see it, ✅ **Success!** The table is created
4. If you don't see it, wait 10 seconds and refresh the page

### Step 5: Test Token Purchase
1. Go back to your application
2. Navigate to **"Buy Tokens"** page
3. Fill in the form and click **"Submit purchase"**
4. If it works without the error, ✅ **Issue 1 is fixed!**

---

## Issue 2: Fix "Insufficient tokens" Error

### Understanding the Problem
- This error happens when someone tries to **assign themselves to a task** that has a reward
- The system needs to **escrow (lock) tokens** from the task creator
- If the creator doesn't have enough tokens, you get this error

### Step 1: Check Your Token Balance
1. Go to your **Dashboard** page
2. Look at the **"Token balance"** section
3. Note your current balance

### Step 2: Get More Tokens (Choose ONE method)

**Option A: Buy Tokens**
1. Go to **"Buy Tokens"** page
2. Enter the amount you want (minimum 5)
3. Fill in your details
4. Click **"Submit purchase"**
5. ✅ Tokens are added to your balance

**Option B: Stake Hours**
1. Go to **"Stake Hours"** page
2. Enter number of hours you want to stake
3. Click **"Stake hours"**
4. ✅ You get 1 token per hour staked

### Step 3: Create Tasks with Appropriate Rewards
1. Go to **"Marketplace"** page
2. When creating a task, set the **reward amount**
3. **Important:** Make sure your token balance is **higher** than the reward amount
4. Example: If you have 50 tokens, don't create a task with 100 token reward

### Step 4: Test Task Assignment
1. Create a task with a small reward (e.g., 5 tokens)
2. Make sure you have at least that many tokens
3. Have someone (or another account) assign to the task
4. If it works, ✅ **Issue 2 is fixed!**

---

## Quick Verification Checklist

After completing the steps above, verify everything works:

- [ ] `token_orders` table exists in Supabase Table Editor
- [ ] Can buy tokens without "table not found" error
- [ ] Token balance shows correctly on Dashboard
- [ ] Can create tasks with rewards
- [ ] Can assign to tasks without "insufficient tokens" error

---

## Common Scenarios & Solutions

### Scenario 1: "I just want to test the app"
**Solution:** Create tasks with `reward: 0` to skip token checks

### Scenario 2: "I created a task but can't assign to it"
**Solution:** 
- The task creator needs tokens equal to or more than the reward
- Either buy tokens or reduce the task reward to 0

### Scenario 3: "I bought tokens but still get insufficient error"
**Solution:**
- Check if tokens are "escrowed" (locked for other tasks)
- Available tokens = Total balance - Escrowed tokens
- You need available tokens, not just total balance

### Scenario 4: "The table still doesn't exist after running SQL"
**Solution:**
1. Check if you're in the correct Supabase project
2. Verify the SQL ran without errors (check the result panel)
3. Try refreshing the Table Editor page
4. Wait 30 seconds and check again (sometimes there's a delay)

---

## Still Having Issues?

### For Database Issues:
1. Check Supabase project connection in your `.env` file
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
3. Make sure you're connected to the right Supabase project

### For Token Issues:
1. Check browser console (F12) for detailed error messages
2. Verify your token balance on Dashboard
3. Check if you have tasks with escrowed tokens
4. Try creating a task with reward = 0 first

### Need More Help?
- Check `FIX_DATABASE_ISSUES.md` for detailed explanations
- Review Supabase logs in the Dashboard
- Check your application's console for error details

