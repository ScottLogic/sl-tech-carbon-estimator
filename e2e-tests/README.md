# Testing of Carbon Estimator using Playwright (Typescript)

## Playwright

Installation of Playwright: https://playwright.dev/docs/intro

Install Playwright:
`npm init playwright@latest`

Install the required browsers:
`playwright install`

Playwright demo tests: https://playwright.dev/docs/writing-tests

## Playwright - Run tests

Running tests: https://playwright.dev/docs/running-tests

To run a test:
Tests can be run in the Command Prompt terminal or using a code editor (for instance - Visual Studio Code).

Visual Studio Code download:
https://code.visualstudio.com/

Ensure you are pointing to the folder containing the test cases.
Example: `C:\Development\sl-tech-carbon-estimator\e2e-tests\>`
`npx playwright test` To run all tests
`npx playwright test landing-page.spec.ts` for specific file
`npx playwright test --update-snapshots` Provided that screenshot assertions now look different, use this command to update our existing screenshots.
`npx playwright test --ui` This opens the playwright browser for

# Running Carbon Estimator Tool

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.4.

Run `npm install` to get the most recent dependencies

## Development server

Run `ng serve` or `npm run start` for a dev server.

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

As mentioned previously, if directed to `http://localhost:5600/` instead of `http://localhost:4200/` then will have to update tests to match
