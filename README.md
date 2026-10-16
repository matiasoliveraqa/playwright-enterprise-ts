# Enterprise Playwright E2E Automation Framework (TypeScript)

[![Playwright](https://img.shields.io/badge/playwright-v1.49+-2EAD33.svg?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-v5.7+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CI Status](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF.svg?logo=github-actions&logoColor=white)](.github/workflows/e2e-tests.yml)
[![Reporting](https://img.shields.io/badge/Reporting-Allure%20%26%20HTML-orange.svg)](https://allurereport.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-ready End-to-End (E2E) and API test automation framework architected with **Playwright** and **TypeScript**, demonstrating enterprise Page Object Model (POM), data fixtures, parallel cross-browser execution, and automated CI/CD reporting.

---

## 🏛️ Architecture & Design Patterns

```
playwright-enterprise-ts/
├── .github/workflows/
│   └── e2e-tests.yml           # GitHub Actions CI matrix & artifact publishing
├── src/
│   ├── constants/              # Application URLs, credentials, and selectors
│   ├── data/                   # Test fixtures, mock users, JSON data sets
│   ├── fixtures/
│   │   └── testBase.ts         # Custom test runner injecting initialized POM fixtures
│   ├── pages/                  # Page Object Models (POM)
│   │   ├── BasePage.ts         # Base wrapper with explicit waits and locator helpers
│   │   ├── LoginPage.ts        # Authentication flows and validation assertions
│   │   ├── InventoryPage.ts    # Product listings, sorting, badge counters
│   │   ├── CartPage.ts         # Item verification and removal
│   │   └── CheckoutPage.ts     # Two-step checkout with price and tax calculations
│   └── utils/
│       ├── apiHelper.ts        # REST API request context wrappers
│       └── logger.ts           # Formatted test execution logger
├── tests/
│   ├── e2e/                    # Critical user journeys
│   │   ├── auth.spec.ts        # Positive/negative authentication matrix
│   │   ├── checkout.spec.ts    # Complete happy-path purchase & edge validations
│   │   └── inventory.spec.ts   # Sorting, filters, and inventory state
│   └── api/                    # Integration & API verification
│       └── users-api.spec.ts   # Status codes, headers, and schema assertions
└── playwright.config.ts        # Multi-browser & mobile configuration
```

### Core Architectural Decisions:
1. **Custom Test Fixtures (`testBase.ts`)**: Avoids repetitive page instantiations in individual specs (`new LoginPage(page)`). Page objects are injected directly into tests via Playwright's fixture mechanism.
2. **Strict User-Facing Locators**: Prioritizes `page.getByRole`, `page.getByPlaceholder`, and `page.getByTestId` over brittle XPath or CSS cascades.
3. **Cross-Browser & Device Matrix**: Configured for Desktop Chromium, Firefox, WebKit, and Mobile Safari (iPhone 14 emulation).
4. **Flakiness Defense**: Traces, screenshots, and videos recorded automatically on test retry/failure for instantaneous root-cause analysis.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### Installation
```bash
git clone https://github.com/kraperped/playwright-enterprise-ts.git
cd playwright-enterprise-ts
npm install
npx playwright install --with-deps
```

### Running Tests

| Command | Description |
| :--- | :--- |
| `npm test` | Run full test suite headlessly across all configured browsers |
| `npm run test:headed` | Run tests in headed browser mode |
| `npm run test:ui` | Open Playwright interactive UI Runner (time-travel debugging) |
| `npm run test:chromium` | Run tests only on Chromium engine |
| `npm run test:api` | Run backend API integration tests |
| `npm run report` | Open the generated HTML Playwright report |
| `npm run allure:serve` | Generate and serve interactive Allure TestOps report |

---

## 🔄 CI/CD Integration (GitHub Actions)

The repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/e2e-tests.yml`):
- Triggers on `push` and `pull_request` to `main`.
- Shards test execution across parallel runner nodes.
- Uploads `playwright-report` and `trace.zip` as downloadable build artifacts.
- Automatically deploys test results to GitHub Pages.

---

## 👤 Author
**Matías Olivera** — *Senior QA Engineer & SDET*  
- LinkedIn: [linkedin.com/in/matiolivera](https://www.linkedin.com/in/matiolivera/)  
- Portfolio: [kraperped.github.io](https://kraperped.github.io/)  
- Email: [matiluzardo3@gmail.com](mailto:matiluzardo3@gmail.com)
