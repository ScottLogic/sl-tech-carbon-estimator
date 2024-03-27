# Testing of Carbon Estimator using Playwright and Python



## Python
Python homepage
https://www.python.org/downloads/release/python-3110/

## Playwright
Installation of Playwright: https://playwright.dev/python/docs/intro

Playwright demo tests: https://playwright.dev/python/docs/writing-tests

## Playwright - Run tests
Running tests: https://playwright.dev/python/docs/running-tests

To run a test:
Tests can be run in the Command Prompt terminal or using a code editor (for instance - Visual Studio Code).

Ensure you are pointing to the folder containing the test cases.
Test name must begin with `test`, must be prefixed by the command `pytest` and must be suffixed by `.py`

Example: `pytest test_newTest.py`

Output in terminal window will be along lines of `1 passed in 4.23s`

Tests are automatically “headless”, meaning no browser window will be opened while running the tests and only results (Pass or Fail) will be seen in the terminal. However, you can run tests in headed mode by using the `--headed`
and the brwoser window will open.

Example: `pytest test_newTest.py --headed`

If tests run too fast (open and close too quickly) you can slow them down by adding `--slowmo`

Example: `pytest test_newTest.py --headed --slowmo 1000` (or 2000)

Tests can be run in different browsers (Use `chromium` for Chrome, `firefox` for Firefox & `webkit` for Safari). The following test will run on firefox and browser window will be open.

Example: `pytest test_newTest.py --browser=firefox --headed`

Note: All tests are pointing to `http://localhost:4200/`, if there is an issue with this (possibly 4200 may already be in use) then you may be directed to a different url, example `http://localhost:5600/`
If this is the case then then the code within each individual test to be run may need updated to match with localhost address otherwise the test(s) will fail. No global file was available to cover this scenario.




# Running Carbon Estimator Tool

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.4.

Run `npm install` to get the most recent dependenices

## Development server

Run `ng serve` or `npm run start` for a dev server. 

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

As mentioned previously, if directed to `http://localhost:5600/` instead of `http://localhost:4200/` then will have to update tests to match
