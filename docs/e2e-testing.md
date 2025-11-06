# End-to-End Testing

## Overview

This project uses Playwright for end-to-end testing to verify user workflows in real browser environments.

## Framework

- **Playwright**: Fast, reliable E2E testing
- **Browsers**: Chromium

## Test Coverage

**Total: 12 E2E tests**

## Running E2E Tests
```bash
npm run test:e2e
```

## Test Architecture

### Before Each Test
- Navigate to app
- Clear localStorage
- Reload page for clean state