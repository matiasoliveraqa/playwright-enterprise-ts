import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const isCI = !!process.env.CI;

/**
 * Enterprise Playwright Configuration
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
  expect: {
    timeout: 7000,
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: process.env.ALLURE_RESULTS_DIR || 'allure-results',
        suiteTitle: true,
      },
    ],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: process.env.HEADLESS !== 'false',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      testIgnore: /.*\/tests\/api\/.*/,
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      testIgnore: /.*\/tests\/api\/.*/,
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
      testIgnore: /.*\/tests\/api\/.*/,
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 12'],
      },
      testIgnore: /.*\/tests\/api\/.*/,
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
      testIgnore: /.*\/tests\/api\/.*/,
    },
    {
      name: 'api',
      testMatch: /.*\/tests\/api\/.*\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL || 'https://dummyjson.com',
      },
    },
  ],

  outputDir: 'test-results/',
});
