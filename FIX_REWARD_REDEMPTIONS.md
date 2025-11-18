# Fix: reward_redemptions Table Missing

## Quick Fix

The `reward_redemptions` table is missing. Run this SQL in Supabase:

### Option 1: Quick Fix (Just create the table)

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/create_reward_redemptions.sql`
3. Copy and paste the SQL
4. Click **Run**

### Option 2: Complete Rewards Setup (Recommended)

If you haven't set up rewards yet, use the complete setup:

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/setup_rewards_complete.sql`
3. Copy and paste the SQL
4. Click **Run**

This will create both tables AND insert default rewards.

## What the Table Does

The `reward_redemptions` table stores:
- Which rewards users have redeemed
- Redemption status (pending, completed, etc.)
- Notes about the redemption
- Timestamp of redemption

## After Running the Migration

1. ✅ The table will be created
2. ✅ You can redeem rewards without errors
3. ✅ Your redemptions will be tracked

## Verify It Works

1. Go to your app's **Rewards** page
2. Try redeeming a reward
3. It should work without the error!

