import { defineConfig } from '@playwright/test';

// BASE_URL=https://your-site.vercel.app  runs the checks against a live deployment.
// Without BASE_URL the site is built and served locally on port 4173.
const BASE_URL = process.env.BASE_URL;

export default defineConfig({
  testDir: 'tests',
  testMatch: /.*\.spec\.js$/,
  reporter: 'list',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: BASE_URL || 'http://localhost:4173',
    // PW_CHANNEL=chrome uses the installed Google Chrome instead of the bundled Chromium.
    channel: process.env.PW_CHANNEL || undefined,
  },
  webServer: BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run preview',
        url: 'http://localhost:4173',
        reuseExistingServer: false,
        timeout: 120_000,
        env: { VITE_FIXES: process.env.VITE_FIXES || '' },
      },
});
