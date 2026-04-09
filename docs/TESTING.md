# Testing Guide - Cora Teletherapy Platform

> **Status**: Project in planning phase. No implementation yet.
> **Last Updated**: April 2026

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Test Tools](#2-test-tools)
3. [Frontend Testing](#3-frontend-testing)
4. [Backend Testing](#4-backend-testing)
5. [Integration Testing](#5-integration-testing)
6. [E2E Testing with Playwright](#6-e2e-testing-with-playwright)
7. [Coverage Requirements](#7-coverage-requirements)
8. [CI/CD Integration](#8-cicd-integration)
9. [Test Data](#9-test-data)

---

## 1. Testing Philosophy

### 1.1 The Testing Pyramid

```
        /\
       /E2E\          ← Few, expensive, slow (5-10%)
      /------\
     /Integration\    ← Medium, some mocks (15-25%)
    /--------------\
   /   Unit Tests   \ ← Many, fast, cheap (70-80%)
  /------------------\
```

### 1.2 Why We Test

| Reason | Impact |
|--------|--------|
| **Regression prevention** | Catch bugs before production |
| **Documentation** | Tests serve as executable specs |
| **Refactoring confidence** | Safe to change code with test coverage |
| **Security** | Validate authentication, authorization, data validation |
| **Privacy compliance** | Ensure HIPAA/GDPR data handling (critical for teletherapy) |

### 1.3 What to Test

#### High Priority (Test First)
- Authentication flows (login, register, password reset)
- Authorization (role-based access control)
- Data validation and sanitization
- Payment processing (Stripe integration)
- Session management and WebRTC connections

#### Medium Priority (Test Along)
- API endpoints and error handling
- React components with complex state
- Custom hooks (authentication, WebRTC)
- Database operations and migrations

#### Low Priority (Test Later)
- Simple UI components (buttons, inputs with no logic)
- CSS/styling (visual regression if needed)
- Third-party integrations (mock them)

### 1.4 What NOT to Test

- Third-party library internals (React, Express)
- Implementation details (internal state, private methods)
- Code that will change frequently without behavior change
- Configuration files (validate separately)

---

## 2. Test Tools

### 2.1 Tool Comparison by Level

| Level | Tool | Purpose | Assertions |
|-------|------|---------|------------|
| **Unit (FE)** | Vitest | Fast unit testing, Vite-native | Chai/Node |
| **Unit (BE)** | Jest | Node.js testing, built-in mocking | Jasmine |
| **Component** | React Testing Library | DOM testing, user-centric | Jest |
| **Integration** | Supertest | HTTP assertions on Express | Superagent |
| **E2E** | Playwright | Browser automation | Built-in |
| **Mocking** | MSW | HTTP request interception | - |
| **Mocking** | Mock Service | Supabase client mock | - |

### 2.2 Recommended Versions

```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jsdom": "^24.0.0",
    "jest": "^29.0.0",
    "supertest": "^7.0.0",
    "msw": "^2.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

---

## 3. Frontend Testing

### 3.1 Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useAuth.test.ts
│   ├── pages/
│   ├── services/
│   └── utils/
├── tests/
│   ├── fixtures/
│   │   ├── users.json
│   │   └── sessions.json
│   ├── mocks/
│   │   ├── supabase.ts
│   │   └── handlers.ts
│   └── setup.ts
└── vitest.config.ts
```

### 3.2 Vitest Configuration

```typescript
// frontend/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/vite-env.d.ts'],
      thresholds: {
        lines: 70,
        branches: 65,
        functions: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3.3 Test Setup

```typescript
// frontend/tests/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

vi.mock('supabase', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  })),
}));
```

### 3.4 Unit Tests with Vitest

```typescript
// frontend/src/utils/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, formatPhoneNumber } from './validation';

describe('validation', () => {
  describe('validateEmail', () => {
    it('should accept valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });

    it('should reject emails with common typos', () => {
      expect(validateEmail('user@gmai.com')).toBe(false);
      expect(validateEmail('user@yahho.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should reject weak passwords', () => {
      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('onlynumbers123')).toBe(false);
    });

    it('should accept strong passwords', () => {
      expect(validatePassword('SecureP@ss123')).toBe(true);
    });
  });
});
```

### 3.5 Component Tests with React Testing Library

```tsx
// frontend/src/components/LoginForm/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { LoginForm } from './LoginForm';

const mockSignIn = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    isLoading: false,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password inputs', () => {
    renderWithRouter(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithRouter(<LoginForm />);
    
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('calls signIn with form data on submit', async () => {
    mockSignIn.mockResolvedValue({ error: null });
    renderWithRouter(<LoginForm />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('displays error message on failed login', async () => {
    mockSignIn.mockResolvedValue({ 
      error: { message: 'Invalid credentials' } 
    });
    
    renderWithRouter(<LoginForm />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

### 3.6 Mocking Supabase Client

```typescript
// frontend/tests/mocks/supabase.ts
import { vi } from 'vitest';

export const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  },
  from: vi.fn((table: string) => {
    const createMockQuery = () => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn(),
      then: vi.fn(),
    });

    return createMockQuery();
  }),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      download: vi.fn(),
      getPublicUrl: vi.fn(),
      remove: vi.fn(),
    })),
  },
  rpc: vi.fn(),
};

export const createMockSupabase = () => mockSupabaseClient;
```

### 3.7 Testing Hooks

```typescript
// frontend/src/hooks/useAuth.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useAuth } from './useAuth';
import { AuthProvider } from '@/contexts/AuthContext';

vi.mock('supabase', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  })),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  it('should return initial auth state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  it('should update auth state on user change', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'patient',
    };

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

---

## 4. Backend Testing

### 4.1 Directory Structure

```
backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── models/
├── tests/
│   ├── fixtures/
│   │   ├── users.ts
│   │   └── sessions.ts
│   ├── mocks/
│   │   └── supabase.ts
│   ├── setup.ts
│   └── integration/
└── jest.config.js
```

### 4.2 Jest Configuration

```javascript
// backend/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        esModuleInterop: true,
      },
    }],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
};
```

### 4.3 Unit Tests with Jest

```typescript
// backend/src/services/auth.service.test.ts
import { AuthService } from './auth.service';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');

const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
  },
  from: jest.fn(),
} as unknown as ReturnType<typeof createClient>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(mockSupabase);
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should sign in user with valid credentials', async () => {
      const mockResponse = {
        data: {
          user: { id: 'user-123', email: 'test@example.com' },
          session: { access_token: 'token-123' },
        },
        error: null,
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue(mockResponse);

      const result = await authService.signIn('test@example.com', 'password');

      expect(result.user).toEqual(mockResponse.data.user);
      expect(result.session).toEqual(mockResponse.data.session);
    });

    it('should throw error on invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      await expect(
        authService.signIn('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('validateSession', () => {
    it('should validate and return user from token', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.validateSession('valid-token');

      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid token', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' },
      });

      const result = await authService.validateSession('invalid-token');

      expect(result).toBeNull();
    });
  });
});
```

### 4.4 Route Testing with Supertest

```typescript
// backend/tests/integration/auth.routes.test.ts
import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../src/app';
import { AuthService } from '../../src/services/auth.service';

jest.mock('../../src/services/auth.service');

const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe('POST /auth/login', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with token on valid credentials', async () => {
    mockAuthService.prototype.signIn.mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      session: { access_token: 'token-123', refresh_token: 'refresh-123' },
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: { id: 'user-123', email: 'test@example.com' },
      session: { access_token: 'token-123', refresh_token: 'refresh-123' },
    });
  });

  it('should return 401 on invalid credentials', async () => {
    mockAuthService.prototype.signIn.mockRejectedValue(
      new Error('Invalid credentials')
    );

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });

  it('should return 400 on missing email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: 'password123' });

    expect(response.status).toBe(400);
  });

  it('should return 400 on invalid email format', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid-email', password: 'password123' });

    expect(response.status).toBe(400);
  });
});
```

### 4.5 Database Testing

```typescript
// backend/tests/setup.ts
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

const testPool = new Pool({
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  database: process.env.TEST_DB_NAME || 'cora_test',
  user: process.env.TEST_DB_USER || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'postgres',
});

export const testDb = {
  query: (text: string, params?: unknown[]) => testPool.query(text, params),
  clean: async () => {
    await testPool.query('TRUNCATE TABLE users, sessions, appointments CASCADE');
  },
  seed: async () => {
    await testPool.query(`
      INSERT INTO users (id, email, role, created_at)
      VALUES 
        ('user-1', 'patient@test.com', 'patient', NOW()),
        ('user-2', 'therapist@test.com', 'therapist', NOW())
    `);
  },
};

export const testSupabase = createClient(
  process.env.TEST_SUPABASE_URL || 'http://localhost:54321',
  process.env.TEST_SUPABASE_KEY || 'test-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

beforeAll(async () => {
  await testDb.clean();
});

afterEach(async () => {
  await testDb.clean();
});

afterAll(async () => {
  await testPool.end();
});
```

---

## 5. Integration Testing

### 5.1 API Flow Tests

```typescript
// backend/tests/integration/patient-therapist-session.test.ts
import request from 'supertest';
import { createApp } from '../../src/app';
import { testDb, testSupabase } from '../setup';

describe('Patient-Therapist Session Flow', () => {
  const app = createApp();
  let patientToken: string;
  let therapistToken: string;
  let sessionId: string;

  beforeEach(async () => {
    await testDb.seed();
    
    // Get tokens (mock Supabase auth)
    patientToken = 'patient-token-mock';
    therapistToken = 'therapist-token-mock';
  });

  describe('POST /api/sessions', () => {
    it('should create a new therapy session', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          therapistId: 'therapist-1',
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          duration: 50,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('scheduled');
      
      sessionId = response.body.id;
    });

    it('should not allow session with past date', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${patientToken}`)
        .send({
          therapistId: 'therapist-1',
          scheduledAt: new Date(Date.now() - 86400000).toISOString(),
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/sessions/:id', () => {
    it('should return session details for authorized user', async () => {
      const response = await request(app)
        .get(`/api/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${patientToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(sessionId);
    });

    it('should deny access to unauthorized user', async () => {
      const response = await request(app)
        .get(`/api/sessions/${sessionId}`)
        .set('Authorization', `Bearer invalid-token`);

      expect(response.status).toBe(403);
    });
  });
});
```

---

## 6. E2E Testing with Playwright

### 6.1 Playwright Configuration

```typescript
// e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 6.2 Page Object Model Pattern

```typescript
// e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private page: Page;
  
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole('button', { name: /sign in/i });
    this.errorMessage = page.getByRole('alert');
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return this.errorMessage.textContent();
  }
}
```

```typescript
// e2e/pages/DashboardPage.ts
import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  private page: Page;
  
  readonly welcomeMessage: Locator;
  readonly upcomingSessions: Locator;
  readonly newSessionButton: Locator;
  readonly profileMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.welcomeMessage = page.getByRole('heading', { level: 1 });
    this.upcomingSessions = page.getByText(/upcoming sessions/i);
    this.newSessionButton = page.getByRole('button', { name: /book session/i });
    this.profileMenu = page.getByRole('menu');
  }

  async navigate() {
    await this.page.goto('/dashboard');
  }

  async getWelcomeText(): Promise<string> {
    return this.welcomeMessage.textContent();
  }

  async openProfileMenu() {
    await this.profileMenu.click();
  }
}
```

### 6.3 Writing E2E Tests

```typescript
// e2e/tests/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Login Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login('patient@test.com', 'password123');

    await expect(page).toHaveURL('/dashboard');
    await expect(dashboardPage.getWelcomeText()).toContain('Welcome');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('patient@test.com', 'wrongpassword');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page).toHaveURL(/login/);
  });

  test('should validate empty form fields', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.submitButton.click();

    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });
});
```

### 6.4 Key User Flows to Test

| Flow | Priority | Description |
|------|----------|-------------|
| **Patient Registration** | High | Register, verify email, complete profile |
| **Patient Login** | High | Login, session management, logout |
| **Book Session** | High | Select therapist, choose time, confirm |
| **Join Video Session** | High | Enter waiting room, connect WebRTC |
| **Therapist Dashboard** | High | View schedule, patient list, start session |
| **Payment Flow** | High | Select plan, enter card, confirm subscription |
| **Profile Settings** | Medium | Update personal info, change password |
| **Forgot Password** | Medium | Request reset, email received, new password |

```typescript
// e2e/tests/sessions/booking.spec.ts
import { test, expect } from '@playwright/test';
import { TherapistListPage } from '../../pages/TherapistListPage';
import { BookingPage } from '../../pages/BookingPage';

test.describe('Session Booking', () => {
  test('should book a session with available therapist', async ({ page }) => {
    const therapistPage = new TherapistListPage(page);
    const bookingPage = new BookingPage(page);

    await therapistPage.navigate();
    await therapistPage.selectTherapist('Dr. Smith');

    await bookingPage.selectDate('2026-04-15');
    await bookingPage.selectTime('10:00 AM');
    await bookingPage.confirmBooking();

    await expect(page.getByText(/session confirmed/i)).toBeVisible();
    await expect(page.getByText(/2026-04-15 10:00 AM/)).toBeVisible();
  });

  test('should show unavailable slots correctly', async ({ page }) => {
    const therapistPage = new TherapistListPage(page);
    
    await therapistPage.navigate();
    await therapistPage.selectTherapist('Dr. Smith');
    
    await expect(page.getByText(/no available slots/i)).toBeVisible();
  });
});
```

---

## 7. Coverage Requirements

### 7.1 Minimum Thresholds

| Level | Lines | Branches | Functions | Statements |
|-------|-------|-----------|-----------|-------------|
| **Overall** | 70% | 65% | 70% | 70% |
| **Auth Module** | 80% | 75% | 80% | 80% |
| **Payment Module** | 85% | 80% | 85% | 85% |
| **WebRTC Module** | 75% | 70% | 75% | 75% |

### 7.2 Coverage Enforcement in CI

```yaml
# .github/workflows/test.yml
- name: Run Tests with Coverage
  run: npm run test:coverage

- name: Enforce Coverage Thresholds
  run: |
    npx vitest run --coverage --coverage.threshold.lines=70 \
      --coverage.threshold.branches=65 \
      --coverage.threshold.functions=70 \
      --coverage.threshold.statements=70
```

### 7.3 Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
npx serve coverage/index.html
```

---

## 8. CI/CD Integration

### 8.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: cora_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install Frontend Dependencies
        run: cd frontend && npm ci

      - name: Run Frontend Tests
        run: cd frontend && npm run test:ci

      - name: Upload Frontend Coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./frontend/coverage/lcov.info
          flags: frontend

      - name: Setup Node.js for Backend
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install Backend Dependencies
        run: cd backend && npm ci

      - name: Run Backend Tests
        run: cd backend && npm run test:ci
        env:
          TEST_DB_HOST: localhost
          TEST_DB_PORT: 5432

      - name: Upload Backend Coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./backend/coverage/lcov.info
          flags: backend

  e2e:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Browsers
        uses: browser-actions/setup-browser@latest
        with:
          browser: chrome

      - name: Install Dependencies
        run: npm ci

      - name: Run E2E Tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:5173

      - name: Upload Playwright Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

### 8.2 Running Tests Locally

```bash
# Run all tests
npm run test:all

# Run frontend tests
cd frontend && npm run test

# Run backend tests
cd backend && npm run test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

---

## 9. Test Data

### 9.1 Fixtures

```typescript
// frontend/tests/fixtures/users.ts
export const patientUser = {
  id: 'patient-123',
  email: 'patient@test.com',
  role: 'patient',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: '2026-01-01T00:00:00Z',
};

export const therapistUser = {
  id: 'therapist-456',
  email: 'therapist@test.com',
  role: 'therapist',
  firstName: 'Jane',
  lastName: 'Smith',
  specialization: 'Cognitive Behavioral Therapy',
  license: 'CPT-12345',
  createdAt: '2026-01-01T00:00:00Z',
};

export const adminUser = {
  id: 'admin-789',
  email: 'admin@cora.com',
  role: 'admin',
  firstName: 'Admin',
  lastName: 'User',
  createdAt: '2026-01-01T00:00:00Z',
};

export const invalidUser = {
  email: 'invalid@test.com',
  password: 'wrongpassword',
};
```

```typescript
// frontend/tests/fixtures/sessions.ts
export const scheduledSession = {
  id: 'session-123',
  patientId: 'patient-123',
  therapistId: 'therapist-456',
  scheduledAt: '2026-04-15T10:00:00Z',
  duration: 50,
  status: 'scheduled',
  type: 'video',
};

export const completedSession = {
  id: 'session-456',
  patientId: 'patient-123',
  therapistId: 'therapist-456',
  scheduledAt: '2026-04-10T10:00:00Z',
  duration: 50,
  status: 'completed',
  type: 'video',
  notes: 'Patient showed good progress on coping strategies.',
};

export const cancelledSession = {
  id: 'session-789',
  patientId: 'patient-123',
  therapistId: 'therapist-456',
  scheduledAt: '2026-04-20T10:00:00Z',
  duration: 50,
  status: 'cancelled',
  type: 'video',
  cancellationReason: 'Patient requested reschedule',
};
```

### 9.2 Data Factories

```typescript
// backend/tests/factories/session.factory.ts
import { v4 as uuidv4 } from 'uuid';

export const createSession = (overrides = {}) => ({
  id: uuidv4(),
  patientId: 'patient-123',
  therapistId: 'therapist-456',
  scheduledAt: new Date(Date.now() + 86400000).toISOString(),
  duration: 50,
  status: 'scheduled',
  type: 'video',
  roomId: uuidv4(),
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createSessions = (count: number, overrides = {}) => 
  Array.from({ length: count }, () => createSession(overrides));
```

### 9.3 Database Seeding

```typescript
// backend/tests/seed.ts
import { testDb } from './setup';

export const seedDatabase = async () => {
  await testDb.clean();

  await testDb.query(`
    INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
    VALUES 
      ('patient-123', 'patient@test.com', '$2a$10$test', 'patient', NOW(), NOW()),
      ('therapist-456', 'therapist@test.com', '$2a$10$test', 'therapist', NOW(), NOW()),
      ('admin-789', 'admin@cora.com', '$2a$10$test', 'admin', NOW(), NOW())
  `);

  await testDb.query(`
    INSERT INTO therapist_profiles (user_id, specialization, license, bio)
    VALUES 
      ('therapist-456', 'Cognitive Behavioral Therapy', 'CPT-12345', 'Experienced therapist')
  `);

  await testDb.query(`
    INSERT INTO sessions (id, patient_id, therapist_id, scheduled_at, duration, status, type)
    VALUES 
      ('session-123', 'patient-123', 'therapist-456', NOW() + INTERVAL '1 day', 50, 'scheduled', 'video')
  `);
};
```

---

## Quick Reference

### Commands

```bash
# Frontend
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage

# Backend
npm test
npm test:watch
npm test:coverage

# E2E
npx playwright test
npx playwright test --ui
npx playwright show-report
```

### File Patterns

| Type | Pattern |
|------|---------|
| Unit Tests | `*.test.ts` or `*.spec.ts` |
| Component Tests | `*.test.tsx` or `*.spec.tsx` |
| E2E Tests | `*.spec.ts` (in e2e folder) |

---

## Related Documentation

- [Architecture Overview](../ARCHITECTURE.md)
- [Supabase Setup](../supabase/SETUP.md)
- [WebRTC Implementation](../webrtc/IMPLEMENTATION.md)