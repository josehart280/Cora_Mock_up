# Cora Teletherapy Platform - Developer Setup Guide

**Version:** 1.0.0  
**Last Updated:** 2026-04-06

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Initial Setup](#2-initial-setup)
3. [Environment Configuration](#3-environment-configuration)
4. [Supabase Setup](#4-supabase-setup)
5. [Stripe Setup](#5-stripe-setup)
6. [Running the App](#6-running-the-app)
7. [Common Issues](#7-common-issues)
8. [Development Tools](#8-development-tools)

---

## 1. Prerequisites

### 1.1 Required Software

| Software | Version | Download |
|----------|---------|----------|
| Node.js | 20.x LTS or higher | [nodejs.org](https://nodejs.org/) |
| npm | 10.x or higher | Comes with Node.js |
| Git | 2.x or higher | [git-scm.com](https://git-scm.com/) |
| PostgreSQL Client | Latest | [PostgreSQL Downloads](https://www.postgresql.org/download/) |

### 1.2 Verify Installations

```bash
# Check Node.js version
node --version
# Expected: v20.x.x or higher

# Check npm version
npm --version
# Expected: 10.x.x or higher

# Check Git version
git --version
# Expected: git version 2.x.x or higher
```

### 1.3 Required Accounts

| Service | Purpose | Sign Up |
|---------|---------|---------|
| **Supabase** | Database, Auth, Storage | [supabase.com](https://supabase.com) |
| **Stripe** | Payment Processing | [stripe.com](https://stripe.com) |
| **SendGrid** | Transactional Emails | [sendgrid.com](https://sendgrid.com) |

> **Note:** All three services have generous free tiers for development. Stripe and SendGrid require test modes that don't process real payments.

---

## 2. Initial Setup

### 2.1 Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/cora.git

# Navigate to project directory
cd cora
```

### 2.2 Project Structure

```
cora/
├── backend/              # Node.js/Express API server
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities
│   ├── prisma/           # Database schema (if using Prisma)
│   ├── package.json
│   └── .env.example
│
├── frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API clients
│   │   ├── stores/       # State management
│   │   └── utils/        # Utilities
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── docs/                 # Documentation
│   ├── API.md           # API documentation
│   └── SETUP.md         # This file
│
└── scripts/              # Utility scripts
```

### 2.3 Install Dependencies

#### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Install development dependencies
npm install -D typescript @types/node ts-node nodemon
```

#### Frontend

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Install development dependencies
npm install -D typescript @types/react @types/react-dom
```

### 2.4 Verify Directory Structure

After installation, verify the project structure:

```bash
# Backend should have these directories
ls -la backend/src/

# Frontend should have these directories
ls -la frontend/src/
```

---

## 3. Environment Configuration

### 3.1 Create Environment Files

Create `.env` files by copying from the examples:

#### Backend

```bash
cd backend
cp .env.example .env
```

#### Frontend

```bash
cd frontend
cp .env.example .env
```

### 3.2 Backend Environment Variables

Edit `backend/.env` with your actual credentials:

```env
# ===========================================
# APPLICATION
# ===========================================

NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# ===========================================
# SUPABASE
# ===========================================

# From: Supabase Dashboard > Settings > API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# ===========================================
# STRIPE
# ===========================================

# From: Stripe Dashboard > Developers > API keys
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# From: Stripe Dashboard > Products (create products first)
STRIPE_MONTHLY_PRICE_ID=price_monthly-id
STRIPE_ANNUAL_PRICE_ID=price_annual-id
STRIPE_PER_SESSION_PRICE_ID=price_per-session-id

PLATFORM_COMMISSION_PERCENT=15

# ===========================================
# EMAIL (SendGrid)
# ===========================================

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@cora.health
EMAIL_FROM_NAME=Cora Platform

# ===========================================
# SECURITY
# ===========================================

COOKIE_SECRET=generate-a-32-character-minimum-secret-key
SESSION_DURATION_MS=604800000

# Password requirements
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBER=true
PASSWORD_REQUIRE_SPECIAL=true

MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MS=3600000

# ===========================================
# CORS
# ===========================================

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3.3 Frontend Environment Variables

Edit `frontend/.env` with your credentials:

```env
# ===========================================
# SUPABASE
# ===========================================

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# ===========================================
# STRIPE
# ===========================================

VITE_STRIPE_PUBLIC_KEY=pk_test_your-public-key

# ===========================================
# API
# ===========================================

VITE_API_URL=http://localhost:3001/api

# ===========================================
# APPLICATION
# ===========================================

VITE_APP_ENV=development
VITE_APP_NAME=Cora
VITE_APP_VERSION=0.1.0

# ===========================================
# FEATURES
# ===========================================

VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_ANALYTICS=false

# ===========================================
# SUPPORT
# ===========================================

VITE_SUPPORT_EMAIL=soporte@cora.health
VITE_TERMS_URL=http://localhost:5173/terms
VITE_PRIVACY_URL=http://localhost:5173/privacy
```

> **Warning:** Never commit `.env` files to version control. The `.gitignore` file should already exclude them, but double-check before committing.

### 3.4 Environment Variable Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `SUPABASE_URL` | Your Supabase project URL | Yes | `https://xyz123.supabase.co` |
| `SUPABASE_ANON_KEY` | Public API key (safe for frontend) | Yes | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key (backend only) | Yes | `eyJhbGciOi...` |
| `SUPABASE_JWT_SECRET` | For verifying JWT tokens | Yes | `your-jwt-secret` |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | For webhook signature verification | Yes | `whsec_...` |
| `STRIPE_*_PRICE_ID` | Stripe product price IDs | Yes | `price_...` |
| `SMTP_PASS` | SendGrid API key | Yes | `SG.xxx...` |
| `COOKIE_SECRET` | Session encryption key (min 32 chars) | Yes | `your-secret-key` |

---

## 4. Supabase Setup

### 4.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Enter project details:
   - **Name:** `cora-development`
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to your location
4. Click **Create new project**
5. Wait for the project to be provisioned (2-3 minutes)

### 4.2 Get Your API Credentials

1. Go to **Settings** > **API**
2. Copy the following values:
   - **Project URL:** `https://xyz123.supabase.co`
   - **anon/public key:** The public API key
   - **service_role key:** The secret key (keep this safe!)
   - **JWT Secret:** The JWT signing secret

### 4.3 Run Database Schema

The database schema defines all tables, relationships, and indexes. Since the schema file is being developed, use the SQL Editor in Supabase Dashboard:

1. Go to **SQL Editor** in Supabase Dashboard
2. Create a new query
3. Run the following base schema (expand as needed):

```sql
-- ============================================
-- CORA - Core Tables
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient', 'psychologist', 'admin')),
    phone TEXT,
    avatar_url TEXT,
    profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patient profiles
CREATE TABLE public.patient_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender TEXT,
    emergency_contact JSONB,
    reason_for_consultation TEXT,
    preferred_language TEXT DEFAULT 'es',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Psychologist profiles
CREATE TABLE public.psychologist_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    specializations TEXT[],
    languages TEXT[],
    experience INTEGER,
    bio TEXT,
    license_number TEXT,
    session_price DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    availability JSONB,
    verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id),
    psychologist_id UUID NOT NULL REFERENCES public.profiles(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration INTEGER NOT NULL DEFAULT 50,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    type TEXT NOT NULL DEFAULT 'video' CHECK (type IN ('video', 'chat', 'phone')),
    room_id TEXT,
    notes TEXT,
    reason TEXT,
    payment_intent_id TEXT,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    appointment_id UUID REFERENCES public.appointments(id),
    stripe_payment_intent_id TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    stripe_subscription_id TEXT NOT NULL,
    plan TEXT NOT NULL CHECK (plan IN ('monthly', 'annual')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    price DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    psychologist_id UUID NOT NULL REFERENCES public.profiles(id),
    patient_id UUID NOT NULL REFERENCES public.profiles(id),
    appointment_id UUID NOT NULL REFERENCES public.appointments(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    recommend BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(patient_id, appointment_id)
);

-- Community Posts
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('experiences', 'resources', 'questions', 'support')),
    tags TEXT[],
    allow_comments BOOLEAN DEFAULT TRUE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Comments
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Likes
CREATE TABLE public.post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_psychologist ON public.appointments(psychologist_id);
CREATE INDEX idx_appointments_scheduled ON public.appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_reviews_psychologist ON public.reviews(psychologist_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4.4 Enable Row Level Security (RLS)

Row Level Security ensures users can only access their own data:

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychologist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles (for psychologist discovery)
-- but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Appointments: Users can only see their own appointments
CREATE POLICY "Users can view own appointments"
    ON public.appointments FOR SELECT
    USING (auth.uid() = patient_id OR auth.uid() = psychologist_id);

CREATE POLICY "Users can create appointments"
    ON public.appointments FOR INSERT
    WITH CHECK (auth.uid() = patient_id OR auth.uid() = psychologist_id);

CREATE POLICY "Users can update own appointments"
    ON public.appointments FOR UPDATE
    USING (auth.uid() = patient_id OR auth.uid() = psychologist_id);

-- Reviews: Patients can create reviews for completed appointments
CREATE POLICY "Reviews are viewable by everyone"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Patients can create reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

-- Posts: Users can CRUD their own posts
CREATE POLICY "Users can view all posts"
    ON public.posts FOR SELECT
    USING (true);

CREATE POLICY "Users can create posts"
    ON public.posts FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
    ON public.posts FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
    ON public.posts FOR DELETE
    USING (auth.uid() = author_id);
```

### 4.5 Configure Storage Buckets

Create storage buckets for avatars and other files:

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Create the following buckets:

| Bucket Name | Public | File Size Limit | Allowed Types |
|-------------|--------|-----------------|---------------|
| `avatars` | Yes | 5MB | Images only |
| `documents` | No | 50MB | PDF, images |
| `recordings` | No | 500MB | Video files |

```sql
-- Insert storage buckets (run in SQL Editor)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
    ('recordings', 'recordings', false, 524288000, ARRAY['video/mp4', 'video/webm']);
```

Set up storage policies:

```sql
-- Avatars: Anyone can upload, users can only update their own
CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 5. Stripe Setup

### 5.1 Get Your Stripe API Keys

1. Go to [stripe.com](https://stripe.com) and create an account
2. Go to **Developers** > **API keys**
3. Copy your **Test** keys:
   - `STRIPE_SECRET_KEY` (starts with `sk_test_`)
   - `STRIPE_PUBLIC_KEY` (starts with `pk_test_`)

> **Note:** Use test keys for development. They won't charge real money but simulate the full payment flow.

### 5.2 Create Products and Prices

Create the subscription products in Stripe Dashboard:

1. Go to **Products** > **Add product**
2. Create **Monthly Subscription**:
   - Name: `Cora Monthly`
   - Pricing: $49.99/month
   - Billing period: Monthly
   - Copy the **Price ID** (starts with `price_`)

3. Create **Annual Subscription**:
   - Name: `Cora Annual`
   - Pricing: $399.99/year
   - Billing period: Yearly
   - Copy the **Price ID**

4. Create **Per-Session**:
   - Name: `Single Session`
   - Pricing: $60.00/once
   - One-time purchase
   - Copy the **Price ID**

### 5.3 Update Environment Variables

Add the Price IDs to your `backend/.env`:

```env
STRIPE_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxx
STRIPE_ANNUAL_PRICE_ID=price_yyyyyyyyyyyyyyyyyyyyy
STRIPE_PER_SESSION_PRICE_ID=price_zzzzzzzzzzzzzzzzzzzz
```

### 5.4 Set Up Webhook Listener

For local development, use the Stripe CLI to forward webhooks:

1. **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows (using Chocolatey)
   choco install stripe.cli
   
   # Or download from: https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe CLI:**
   ```bash
   stripe login
   ```

3. **Start webhook forwarding:**
   ```bash
   stripe listen --forward-to localhost:3001/webhooks/stripe
   ```

4. **Copy the webhook signing secret** (shown in terminal):
   ```
   Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxx
   ```

5. **Add to `backend/.env`:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
   ```

> **Note:** Keep the `stripe listen` command running while developing. It will show webhook events in real-time.

### 5.5 Stripe Test Cards

Use these test card numbers in development:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Declined |
| `4000 0025 0000 3155` | Requires authentication |
| `4000 0000 0000 9995` | Insufficient funds |

Use any future expiry date and any 3-digit CVC.

---

## 6. Running the App

### 6.1 Start the Backend

```bash
# In backend directory
cd backend

# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

Expected output:
```
🚀 Server running on http://localhost:3001
📦 Connected to Supabase
🔐 Auth service initialized
💳 Stripe service initialized
```

### 6.2 Start the Frontend

```bash
# In frontend directory (new terminal)
cd frontend

# Development mode
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 6.3 Verify Everything Works

1. **Open the app:** Go to `http://localhost:5173`

2. **Test registration:**
   - Click "Registrarse"
   - Fill in test credentials
   - Verify email confirmation (check console logs for confirmation link in dev mode)

3. **Test login:** Use the registered credentials

4. **Check API health:**
   ```bash
   curl http://localhost:3001/api/health
   ```
   
   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2026-04-06T10:00:00Z",
     "services": {
       "database": "connected",
       "stripe": "connected"
     }
   }
   ```

### 6.4 Useful Development URLs

| Service | URL |
|---------|-----|
| Frontend App | http://localhost:5173 |
| Backend API | http://localhost:3001/api |
| API Docs | http://localhost:3001/api/docs (if Swagger enabled) |
| Supabase Dashboard | https://supabase.com/dashboard |
| Stripe Dashboard | https://dashboard.stripe.com/test |

---

## 7. Common Issues

### Issue: "Cannot connect to Supabase"

**Symptoms:** Database connection errors in backend logs.

**Solutions:**
1. Verify your `SUPABASE_URL` is correct (check for typos)
2. Ensure your Supabase project is not paused
3. Check if your IP is blocked (Supabase has IP allowlisting in some configurations)
4. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct

```bash
# Test connection
curl https://your-project.supabase.co/rest/v1/
```

### Issue: "Invalid JWT signature"

**Symptoms:** Auth errors, users cannot log in.

**Solutions:**
1. Update `SUPABASE_JWT_SECRET` in your `.env`
2. Get the current JWT secret from Supabase Dashboard > Settings > API
3. Restart the backend server

### Issue: "Stripe webhook signature verification failed"

**Symptoms:** Stripe webhook events are rejected.

**Solutions:**
1. Ensure `stripe listen` is running and connected
2. Regenerate webhook secret: `stripe listen --forward-to localhost:3001/webhooks/stripe`
3. Update `STRIPE_WEBHOOK_SECRET` in `.env`
4. Restart backend

### Issue: "CORS error"

**Symptoms:** Browser console shows CORS errors, API calls fail.

**Solutions:**
1. Check `ALLOWED_ORIGINS` in backend `.env` includes `http://localhost:5173`
2. Ensure backend is running on port 3001
3. Check frontend's `VITE_API_URL` points to `http://localhost:3001/api`

### Issue: "Port already in use"

**Symptoms:** Cannot start backend or frontend.

**Solutions:**
```bash
# Find what's using the port
netstat -ano | findstr :3001  # Windows
lsof -i :3001                   # macOS/Linux

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F          # Windows
kill -9 <PID>                   # macOS/Linux
```

### Issue: "Module not found" errors

**Symptoms:** Missing dependencies during npm install or runtime.

**Solutions:**
```bash
# Clear node_modules and reinstall
cd backend && rm -rf node_modules package-lock.json
cd ../frontend && rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Email not sending"

**Symptoms:** Password reset or confirmation emails not arriving.

**Solutions:**
1. Verify SendGrid API key is correct
2. Check `SMTP_*` variables in `.env`
3. In SendGrid, verify your sender email is authenticated
4. For development, check server logs for email output (or use Ethereal Email)

### Issue: "Database tables not found"

**Symptoms:** RLS policy errors, table does not exist errors.

**Solutions:**
1. Run the database schema in Supabase SQL Editor
2. Check you're connected to the correct Supabase project
3. Verify RLS policies are created

### Issue: "Vite proxy errors"

**Symptoms:** API calls from frontend fail with proxy errors.

**Solutions:**
1. Check `vite.config.ts` proxy settings
2. Ensure backend is running before frontend
3. Verify `VITE_API_URL` is correctly set

---

## 8. Development Tools

### 8.1 Recommended VS Code Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "usernamehw.errorlens",
    "ms-vscode.vscode-json",
    "eamodio.gitlens"
  ]
}
```

### 8.2 Debugging Setup

#### Backend Debugging (VS Code)

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "nodemon",
      "runtimeArgs": ["src/index.ts"],
      "skipFiles": ["<node_internals>/**"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    },
    {
      "name": "Attach to Backend",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "restart": true
    }
  ]
}
```

#### Frontend Debugging (VS Code)

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Frontend",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend",
      "sourceMaps": true
    }
  ]
}
```

### 8.3 Useful Scripts

Add these to `package.json` scripts section:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "nodemon src/index.ts",
    "dev:frontend": "vite",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\"",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "typecheck": "tsc --noEmit",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

### 8.4 Git Hooks (Husky)

Set up pre-commit hooks:

```bash
# Install Husky
npm install -D husky lint-staged

# Initialize
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run typecheck"
```

### 8.5 Environment Variables Cheat Sheet

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_*` | Frontend `.env` | Exposed to browser |
| `SUPABASE_*` | Backend `.env` | Database connection |
| `STRIPE_*` | Backend `.env` | Payment processing |
| `SMTP_*` | Backend `.env` | Email delivery |
| `COOKIE_SECRET` | Backend `.env` | Session encryption |
| `ALLOWED_ORIGINS` | Backend `.env` | CORS configuration |

---

## Quick Reference

### Starting Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Stripe webhooks (optional but recommended)
stripe listen --forward-to localhost:3001/webhooks/stripe
```

### Common Commands

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Type check
npm run typecheck

# Run tests
npm test

# Build for production
npm run build
```

### Getting Help

- **API Documentation:** See `docs/API.md`
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev

---

*Document Version: 1.0.0 | Last Updated: 2026-04-06*
