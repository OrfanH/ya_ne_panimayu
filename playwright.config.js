// @ts-check
const { defineConfig } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 40_000,
  retries: 0,

  reporter: [
    ['list'],
    ['json',  { outputFile: 'playwright-report/results.json' }],
    ['html',  { outputFolder: 'playwright-report/html', open: 'never' }],
  ],

  use: {
    baseURL: BASE_URL,
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'off',
  },

  // Playwright starts this server automatically before tests and stops it after.
  // When CI=true (GitHub Actions), always starts fresh.
  // Locally, reuses an existing server on port 3000 if already running (e.g. vercel dev).
  webServer: {
    command: 'npx serve app -p 3000',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },

  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'mobile',
      use: { viewport: { width: 375, height: 667 } },
    },
  ],
});
