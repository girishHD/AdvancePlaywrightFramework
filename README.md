# AdvancePlaywrightFramework

A comprehensive, enterprise-grade **Playwright Test Automation Framework** built with TypeScript. Designed for end-to-end web testing, API testing, and data-driven test execution with multi-environment support.

## Features

- **TypeScript-first** — Strict mode with full type safety
- **Page Object Model (POM)** — Maintainable web element abstractions with BasePage inheritance
- **Custom Playwright Fixtures** — `test-base` injects pre-built Page Objects (and the test data) into specs
- **Multi-Environment Support** — Dev, QA, Staging, Production, and API environments
- **Visual Test Steps** — `visualStep` captures step-level screenshots for the TTA report (opt-in)
- **Data-Driven Testing** — Read test data from CSV, Excel, and JSON files
- **Externalized Credentials** — Usernames/secrets resolved from env vars via `credentials` config
- **API Testing** — REST API validation with JSON Schema (AJV)
- **Custom HTML Reporting** — Rich, interactive TTA reports with steps, screenshots, videos, and traces
- **AI-Powered Analysis** — Root cause analysis (RCA) agent for failed tests and flaky test detection
- **Structured Logging** — Winston-based logging with configurable log levels and file output
- **Fake Data Generation** — Realistic test data via Faker.js (credentials, checkout info, user profiles)
- **CI/CD Pipeline** — GitHub Actions with automated test execution and report artifacts
- **Parallel Execution** — Tests run in parallel by default for faster feedback
- **Full Observability** — Screenshots on failure, video recording, traces on retry
- **Test Tagging** — Priority-based test filtering (P0, P1, Smoke) via test tags

## Project Structure

```
AdvancePlaywrightFramework/
├── .env                        # Environment variables (multi-env config)
├── .github/
│   └── workflows/
│       └── playwright.yml      # GitHub Actions CI/CD pipeline
├── .gitignore
├── docs/                       # Documentation
├── rules/                      # Project rules & conventions
├── src/
│   ├── ai/                     # AI agents (RCA, flaky analyzer)
│   │   ├── agents/             # AI agent implementations
│   │   └── config/             # LLM provider configuration
│   ├── api/                    # API testing helpers & clients
│   ├── config/                 # Configuration management
│   │   ├── credentials.ts      # Usernames/secrets from env vars
│   │   └── framework.config.ts # Framework flags (e.g. ATTACH_SCREENSHOTS)
│   ├── fixtures/               # Custom Playwright fixtures
│   │   └── test-base.ts        # `test` pre-wired with POM page-object fixtures
│   ├── pages/                  # Page Object Model classes
│   │   ├── BasePage.ts         # Base page with common utilities
│   │   ├── LoginPage.ts        # Login page objects
│   │   ├── InventoryPage.ts    # Product inventory page
│   │   ├── CartPage.ts         # Shopping cart page
│   │   ├── ItemDetailsPage.ts  # Product details page
│   │   ├── CheckoutStepOnePage.ts  # Checkout info page
│   │   ├── CheckoutStepTwoPage.ts  # Checkout overview page
│   │   └── CheckoutCompletePage.ts # Order confirmation page
│   ├── testdata/               # Test data files (JSON, CSV, Excel)
│   │   ├── checkout-users.json     # Demo users (standard/problem/glitch, etc.)
│   │   └── checkout-customers.json # Guest customer profiles
│   ├── tests/                  # Test specifications (testDir)
│   │   ├── e2e/                # End-to-end flows (checkout, etc.)
│   │   │   └── e2e-checkout.spec.ts  # Full checkout journey (POM fixtures)
│   │   └── login/
│   │       └── Login.spec.ts   # Login test suite
│   └── utils/                  # Utilities
│       ├── CustomReporter.ts   # Custom TTA HTML reporter
│       ├── DataGenerator.ts    # Faker-based test data generator
│       ├── UtilElementLocator.ts # Element interaction utilities
│       ├── visualStep.ts       # test.step wrapper + step screenshots
│       └── logger.ts           # Winston logging setup
├── tta-report/                 # Generated HTML reports (gitignored)
├── reports/                    # Build snapshots for flaky analysis (gitignored)
├── logs/                       # Application logs (gitignored)
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies & scripts
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

## Installation

```bash
# Clone the repository
git clone https://github.com/girishHD/AdvancePlaywrightFramework.git
cd AdvancePlaywrightFramework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Usage

### Run Tests

```bash
# Run all tests (headless)
npm test

# Run tests with visible browser
npm run test:headed

# Debug tests interactively
npm run test:debug
```

### Run in Specific Environment

```bash
# Set environment and run
TTA_ENV=qa npx playwright test
TTA_ENV=prod npx playwright test
TTA_ENV=dev npx playwright test
```

### View Reports

```bash
# Open the latest TTA HTML report
open tta-report/index.html

# View report history
open tta-report/history.html
```

## Configuration

### Playwright Config (`playwright.config.ts`)

| Setting | Value |
|---|---|
| Test Directory | `./src/tests` |
| Global Timeout | 60 seconds |
| Expect Timeout | 10 seconds |
| Fully Parallel | `true` |
| Retries (CI) | 2 |
| Retries (Local) | 0 |
| Reporters | HTML + List + Custom TTA |
| Screenshots | Off, or on-failure when `ATTACH_SCREENSHOTS=true` |
| Video | Always on |
| Trace | Always on |
| Browser | Chromium (Desktop Chrome) |

### Environments

| Environment | Base URL |
|---|---|
| `qa` (default) | `https://app.thetestingacademy.com` |
| `dev` / `local` | `http://localhost:3000` |
| `stg` / `staging` | `https://stage.thetestingacademy.com` |
| `prod` / `production` | `https://app.thetestingacademy.com` |
| `api` | `https://restful-booker.herokuapp.com` |

### Environment Variables (`.env`)

| Variable | Description |
|---|---|
| `TTA_ENV` | Active environment (qa/dev/stg/prod) |
| `BASE_URL` | Override base URL |
| `QA_BASE_URL` / `DEV_BASE_URL` / `STG_BASE_URL` / `PROD_BASE_URL` / `API_BASE_URL` | Per-environment base URL overrides |
| `LOG_LEVEL` | Logging verbosity (info/debug/error) |
| `STANDARD_USER` | Standard login username (used by `credentials`) |
| `TTA_SECRET` | Standard login password (used by `credentials`) |
| `ATTACH_SCREENSHOTS` | `true` to attach step screenshots to the TTA report |
| `TEST_ENV` | Test environment label for reports |
| `TEST_AUTHOR` | Test author name for reports |

## Custom Fixtures & Visual Steps

The shared `test` in `src/fixtures/test-base.ts` extends Playwright's `test` with one
fixture per Page Object, so specs can request pre-built pages without `new`-ing them up:

```ts
import { test, expect } from '@fixtures/test-base';

test('add to cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.open();
    await inventoryPage.addToCart('tta-bike-light');
    await cartPage.open();
    expect(await cartPage.rowCount()).toBe(1);
});
```

When `ATTACH_SCREENSHOTS=true`, wrap steps in `visualStep` (from `src/utils/visualStep.ts`)
to also attach a screenshot of that step to the TTA report:

```ts
await visualStep(page, 'Open the cart', async () => {
    await cartPage.open();
});
```

## AI-Powered Features

### Root Cause Analysis (RCA) Agent
Automatically analyzes failed tests using LLM and provides:
- Severity and priority assessment
- Root cause identification
- Fix suggestions

### Flaky Test Analyzer
Compares test results across builds to detect:
- Flaky tests (inconsistent pass/fail)
- New failures vs recurring issues
- Historical trend analysis

Configure LLM API key in `.env` to enable AI features:
```
OPENAI_API_KEY=your-api-key
```

## Dependencies

| Package | Purpose |
|---|---|
| `@playwright/test` | Core test runner and browser automation |
| `@faker-js/faker` | Realistic fake data generation |
| `ajv` + `ajv-formats` | JSON Schema validation for API responses |
| `allure-playwright` | Allure report integration |
| `csv-parse` | CSV file parsing for data-driven tests |
| `dotenv` | Environment variable management |
| `jsonpath-plus` | JSONPath querying for API responses |
| `winston` | Structured logging |
| `xlsx` | Excel file reading for data-driven tests |

## CI/CD

The project uses **GitHub Actions** for continuous integration:

- **Trigger**: Push or PR to `main`/`master` branches
- **Runner**: `ubuntu-latest`
- **Steps**:
  1. Checkout code
  2. Setup Node.js (latest LTS)
  3. Install dependencies (`npm ci`)
  4. Install Playwright browsers
  5. Run tests
  6. Upload HTML report as artifact (retained 30 days)

## License

ISC
