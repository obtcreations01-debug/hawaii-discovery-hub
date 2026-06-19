# ========================================
# HAWAII DISCOVERY HUB - ASAP LAUNCH CHECKLIST
# ========================================

## STEP 1: Add PostgreSQL to Railway (2 min)
1. Go to your Railway project dashboard
2. Click "+ New" → "Database" → "PostgreSQL"
3. Wait for database to provision
4. Click on PostgreSQL instance
5. Copy the connection string from "Connect" tab
6. It should look like: postgresql://username:password@host:port/railway

## STEP 2: Create .env File (1 min)
1. Copy .env.example to .env in project root
2. Replace DATABASE_URL with your Railway PostgreSQL connection string
3. Generate JWT_SECRET: Run this in PowerShell:
   [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -Count 32 | ForEach-Object {[char]})))

## STEP 3: Set Up Stripe (3 min)
1. Go to https://dashboard.stripe.com/apikeys
2. Copy "Secret key" (starts with sk_live_)
3. Copy "Publishable key" (starts with pk_live_)
4. Add both to .env file

## STEP 4: Run Database Migrations (2 min)
1. Open terminal in project root
2. Run: npm install
3. Run: npm run migrate
4. You should see migration complete message

## STEP 5: Add to Railway Environment (1 min)
1. In Railway dashboard, go to Variables
2. Add each variable from .env:
   - DATABASE_URL
   - JWT_SECRET
   - STRIPE_SECRET_KEY
   - STRIPE_PUBLISHABLE_KEY
   - NODE_ENV=production
3. Click "Deploy"

## STEP 6: Verify Live Site (1 min)
1. Wait 2-3 minutes for Railway to redeploy
2. Visit: https://hawaiidiscoveryhub.com
3. Test: Browse directory, check footer, try search

## POST-LAUNCH VERIFICATION
✅ Homepage loads
✅ Navigation works
✅ Search/filters functional
✅ Mobile responsive
✅ Footer displays
✅ No console errors

# ========================================
