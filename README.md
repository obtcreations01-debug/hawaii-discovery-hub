# Hawaii Discovery Hub

A full-stack local-business directory for the Hawaiian islands.
One Node.js app serves both the API (Express + Postgres) and the static
frontend (HTML/CSS/JS) - deploy it as a single service.

## Stack

- **Backend:** Node.js 18+, Express 4, PostgreSQL 14+, JWT auth, Stripe subscriptions
- **Frontend:** vanilla HTML/CSS/JS served from `public/`, no build step
- **Deploy targets:** Railway (recommended), Heroku, Render, DigitalOcean App Platform

## Quick start (local)

```bash
npm install
cp .env.example .env
# edit .env: at minimum set DATABASE_URL and the two JWT secrets
psql "$DATABASE_URL" -f migrations/001-initial-schema.sql
npm start
# open http://localhost:5000
```

You can run without Stripe configured - the app boots fine, only the
subscription/checkout endpoints will fail.

## Deploy to Railway (5 steps, ~20 minutes)

1. Push this folder to a GitHub repo.
2. On https://railway.app, "New Project" -> "Deploy from GitHub repo" -> pick your repo.
3. Add a PostgreSQL plugin to the project. Railway sets `DATABASE_URL` automatically.
4. Set these variables in the Railway dashboard:

   ```
   NODE_ENV=production
   JWT_SECRET=<32 random hex chars>
   JWT_REFRESH_SECRET=<a different 32 random hex chars>
   FRONTEND_URL=https://<your-app>.up.railway.app
   STRIPE_SECRET_KEY=sk_live_...        # optional, for payments
   STRIPE_PUBLISHABLE_KEY=pk_live_...   # optional
   STRIPE_WEBHOOK_SECRET=whsec_...      # optional
   ```

   Generate secrets locally with:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

5. Open Railway's Postgres -> Data -> Query, paste the contents of
   `migrations/001-initial-schema.sql`, run.

Visit your `*.up.railway.app` URL - done.

## Project layout

```
.
|-- server.js                      Express app entry (also serves static frontend)
|-- package.json                   Dependencies
|-- Procfile                       Railway/Heroku start command
|-- railway.json                   Optional Railway build config
|-- .env.example                   Copy to .env for local dev
|-- config/
|   `-- database.js                pg Pool, reads DATABASE_URL or DB_* vars
|-- middleware/
|   `-- auth.js                    JWT verification middleware
|-- routes/
|   |-- auth.js                    /api/auth/{register,login,refresh-token}
|   |-- businesses.js              /api/businesses (CRUD for owners)
|   |-- listings.js                /api/listings (public directory)
|   `-- payments.js                /api/payments/{create-checkout,webhook}
|-- migrations/
|   `-- 001-initial-schema.sql     Schema + seed data
`-- public/
    |-- index.html                 Homepage with featured listings
    |-- directory.html             Searchable directory
    |-- login.html, register.html  Auth pages
    |-- for-businesses.html        Pricing
    |-- dashboard.html             Owner dashboard
    |-- css/style.css
    `-- js/{api,partials,shared}.js
```

## API endpoints

| Method | Path                              | Auth | Description                        |
|--------|-----------------------------------|------|------------------------------------|
| GET    | /api/health                       | -    | Liveness                           |
| POST   | /api/auth/register                | -    | Create account                     |
| POST   | /api/auth/login                   | -    | Issue JWT pair                     |
| POST   | /api/auth/refresh-token           | -    | Refresh access token               |
| GET    | /api/listings                     | -    | Search public directory            |
| GET    | /api/listings/:id                 | -    | Single listing                     |
| POST   | /api/listings                     | JWT  | Create listing (owner)             |
| PUT    | /api/listings/:id                 | JWT  | Update listing                     |
| GET    | /api/businesses                   | JWT  | List my businesses                 |
| POST   | /api/businesses                   | JWT  | Add a business                     |
| POST   | /api/payments/create-checkout     | JWT  | Stripe checkout session            |
| POST   | /api/payments/webhook             | -    | Stripe webhook                     |

## Stripe setup (optional)

After deploying, in Stripe -> Developers -> Webhooks -> "Add endpoint":
- URL: `https://<your-app>/api/payments/webhook`
- Events: `customer.subscription.created`, `customer.subscription.updated`,
  `invoice.payment_succeeded`, `invoice.payment_failed`

Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Local development tips

- The frontend talks to the API via same-origin requests, so opening
  `http://localhost:5000` works.
- Sample data is seeded by the migration, so the directory has 6 sample
  listings the first time you run it.
