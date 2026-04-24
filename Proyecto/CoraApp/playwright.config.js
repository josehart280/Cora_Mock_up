import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.js',
  timeout: 30000,
  retries: 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'tests/e2e/playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // Capture console errors
    captureConsole: true,
    // Don't follow downloads
    acceptDownloads: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
