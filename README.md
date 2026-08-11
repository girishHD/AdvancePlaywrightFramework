# AdvancePlaywrightFramework

A comprehensive, enterprise-grade **Playwright Test Automation Framework** built with TypeScript. Designed for end-to-end web testing, API testing, and data-driven test execution with multi-environment support.

## Features

- **TypeScript-first** — Strict mode with full type safety
- **Page Object Model (POM)** — Maintainable web element abstractions
- **Custom Playwright Fixtures** — Extended test capabilities with dependency injection
- **Multi-Environment Support** — Dev, QA, Staging, Production, and API environments
- **Data-Driven Testing** — Read test data from CSV, Excel, and JSON files
- **API Testing** — REST API validation with JSON Schema (AJV)
- **Allure Reporting** — Rich, interactive HTML reports with steps, screenshots, and trends
- **Structured Logging** — Winston-based logging with configurable log levels
- **Fake Data Generation** — Realistic test data via Faker.js
- **CI/CD Pipeline** — GitHub Actions with automated test execution and report artifacts
- **Parallel Execution** — Tests run in parallel by default for faster feedback
- **Full Observability** — Screenshots on failure, video recording, traces on retry

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
│   ├── api/                    # API testing helpers & clients
│   ├── config/                 # Configuration management
│   ├── fixtures/               # Custom Playwright fixtures
│   ├── pages/                  # Page Object Model classes
│   ├── testdata/               # Test data files (JSON, CSV, Excel)
│   ├── tests/                  # Test specifications (testDir)
│   └── utils/                  # Utilities (logging, data readers, helpers)
├── tests/
│   └── example.spec.ts         # Example Playwright test
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
| Reporters | HTML + List |
| Screenshots | On failure only |
| Video | Always on |
| Trace | On first retry |
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
| `LOG_LEVEL` | Logging verbosity (info/debug/error) |
| `USERNAME` | Application login username |
| `PASSWORD` | Application login password |

## Dependencies

| Package | Purpose |
|---|---|
| `@playwright/test` | Core test runner and browser automation |
| `@faker-js/faker` | Realistic fake data generation |
| `ajv` + `ajv-formats` | JSON Schema validation for API responses |
| `allure-playwright` | Rich HTML test reporting |
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
