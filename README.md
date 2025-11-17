# TBM Collective – Time-Based Marketplace

Stake hours, earn TBM tokens, hire other members, and now redeem partner rewards or buy additional tokens for your org.\
Built with **Next.js App Router**, **Supabase Auth + Database**, **TailwindCSS**, and a lightweight Node runtime (no custom server required).

## Core Features

- **Email + Google Auth** via Supabase with automatic profile provisioning.
- **Staking** – lock available hours, mint 1 TBM per hour, and grow reputation once work is delivered.
- **Marketplace** – post tasks, escrow rewards, self-assign, submit, approve, and route escrow accordingly.
- **Rewards (NEW)** – browse sponsored coupons/perks, burn TBM to redeem, and track fulfillment.
- **Token Desk (NEW)** – individuals or companies can simulate purchases (future Razorpay integration) and instantly mint TBM.
- **Admin Console** – mint tokens for partners, ingest sponsored rewards, and view live economy stats.

## Prerequisites

- Node.js 18+
- Supabase project (free tier works)
- Supabase Auth providers enabled (Email + Google)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Supabase schema**
   - Open `supabase/schema.sql` in the Supabase SQL editor and run it once.
   - Tables created: `profiles`, `stakes`, `tokens`, `tasks`, `reward_catalog`, `reward_redemptions`, `token_orders`, plus audit helpers.

3. **Environment variables**
   ```bash
   cp env.example .env.local
   ```
   Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Start dev server**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000`.

## Key Pages

| Route | Purpose |
| --- | --- |
| `/auth/login` | Email/password + Google auth |
| `/dashboard` | Token balance, reputation, CTA shortcuts |
| `/stake` | Stake hours, mint TBM, mark delivery |
| `/marketplace` | Create/open tasks, self-assign, manage escrow |
| `/task/[id]` | Submit/approve tasks and release/refund escrow |
| `/profile` | Manage name, skills, hours |
| `/rewards` | Browse sponsor catalog, burn TBM, view redemptions |
| `/buy-tokens` | Simulate purchases for individuals/companies |
| `/admin` | Purchase tokens for orgs, add rewards, view stats |

## API Highlights

- `POST /api/stake/create` – stake hours + mint TBM
- `POST /api/tasks/assign` – self-assign and escrow creator tokens
- `POST /api/tasks/approve` – approve/reject and release/refund escrow
- `GET /api/rewards/catalog` – public reward feed
- `POST /api/rewards/redeem` – burn TBM for a reward
- `POST /api/tokens/purchase` – simulate a purchase + mint TBM
- `POST /api/admin/rewards/create` – add rewards to catalog

All API routes use Supabase service role keys internally; calls from the client include `Authorization: Bearer <supabase access token>`.

## Extending

- Plug Razorpay or any PSP into `api/tokens/purchase`.
- Enable Supabase Realtime subscriptions for live task/reward updates.
- Add webhooks on `audits` to notify Discord/Slack about token events.

## License

ISC – customize and redeploy freely. Need help extending it? Open an issue or drop a note in your preferred channel. Enjoy building! 🚀

