# Cora E2E Dashboard Tests - Specification

## Context

- **App**: Cora teletherapy platform (React + Vite + Tailwind + Zustand + Supabase)
- **App URL**: `http://localhost:5173`
- **Auth**: Supabase email/password with protected routes (`/paciente/dashboard`, `/psicologo/dashboard`)
- **Routes**: Redirect to `/login` if not authenticated

## Test Files

```
tests/e2e/
├── SPEC.md              (this file)
├── playwright.config.js  (Playwright configuration)
└── cora-dashboards.spec.js  (E2E test suite)
```

## What Works

### Auth Protection Tests (PASS)
These tests pass because they don't need Supabase mocks:
- `redirects to /login when not authenticated` - verifies protected route redirect
- `redirects psychologist dashboard to /login when not authenticated`

### Dashboard UI Tests (FAIL - Supabase JWT Validation)
The dashboard tests fail because:
1. Supabase validates JWT tokens with the real Supabase server
2. Mock tokens fail validation because they're not cryptographically valid
3. The `getSession()` call fails, setting `isAuthenticated: false`
4. The `RequireAuth` wrapper redirects to `/`

This is a fundamental issue with mocking Supabase Auth - the client validates tokens server-side.

## Mock Strategy Attempted

The test file tries to mock:
- `localStorage` with fake JWT tokens
- `*/auth/v1/session` endpoint
- `*/auth/v1/token` endpoint
- `*/rest/v1/profiles` endpoint
- `*/rest/v1/appointments` endpoint
- `*/rest/v1/subscriptions` endpoint
- `*/rest/v1/psychologist_profiles` endpoint

But Supabase's `getSession()` validates the JWT with the real server before using localStorage.

## Solutions (Not Implemented)

### Option 1: Real Test Users
Create test users in Supabase and use their real credentials:
```js
await page.fill('[name="email"]', 'test@cora.com')
await page.fill('[name="password"]', 'TestPassword123!')
await page.click('button[type="submit"]')
```

### Option 2: Mock Supabase Client
Replace the actual Supabase client with a mocked version before app initialization.

### Option 3: API Proxy
Set up a proxy that intercepts Supabase calls and returns mock data without JWT validation.

## Current Test Results

| Test | Status | Notes |
|------|--------|-------|
| Auth: patient redirect | PASS | Clears storage, verifies redirect |
| Auth: psychologist redirect | PASS | Clears storage, verifies redirect |
| Patient dashboard | FAIL | JWT validation fails |
| Patient next appointment | FAIL | JWT validation fails |
| Psychologist dashboard | FAIL | JWT validation fails |

## Test Structure

```javascript
// Auth Protection Tests (PASS)
test.describe('Auth Protection', () => {
  test('redirects to /login when not authenticated')
  test('redirects psychologist dashboard to /login when not authenticated')
})

// Patient Dashboard Tests (FAIL - needs real auth)
test.describe('Patient Dashboard', () => {
  test('shows patient dashboard with mock auth')
  test('shows next appointment with join button')
})

// Psychologist Dashboard Tests (FAIL - needs real auth)
test.describe('Psychologist Dashboard', () => {
  test('shows psychologist dashboard with mock auth')
})
```

## Running Tests

```bash
cd tests/e2e
npx playwright test cora-dashboards.spec.js --reporter=list
```

## Next Steps for Real Testing

1. **Create test users** in Supabase dashboard or via seed script
2. **Update test** to use real login flow:
   ```javascript
   await page.goto(`${BASE_URL}/login`)
   await page.fill('[name="email"]', 'test@cora.com')
   await page.fill('[name="password"]', 'TestPassword123!')
   await page.click('button[type="submit"]')
   await page.waitForURL('**/dashboard')
   ```
3. **Or** mock at network level with a proxy that handles JWT validation
