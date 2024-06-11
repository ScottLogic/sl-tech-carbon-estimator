# Testing of Carbon Estimator using Playwright and Python



## Python
Python homepage
https://www.python.org/downloads/release/python-3110/

## Playwright
Installation of Playwright: https://playwright.dev/python/docs/intro

Install the Pytest plugin:
`pip install pytest-playwright`

Install the required browsers:
`playwright install`


Playwright demo tests: https://playwright.dev/python/docs/writing-tests


## Playwright - Run tests
Running tests: https://playwright.dev/python/docs/running-tests

To run a test:
Tests can be run in the Command Prompt terminal or using a code editor (for instance - Visual Studio Code).

Visual Studio Code download:
https://code.visualstudio.com/

Ensure you are pointing to the folder containing the test cases.
Example: `C:\Development\Technology-Carbon-Standard\tests_tcs>` 

To run a test in `C:\Development\Technology-Carbon-Standard\tests_tcs>`:

Test name must begin with `test`, must be prefixed by the command `pytest` and must be suffixed by `.py`

Example command: `pytest test_2_EstTool_HappyPath_Default.py`

Line should look like: `C:\Development\Technology-Carbon-Standard\tests_tcs>pytest test_2_EstTool_HappyPath_Default.py` 

If successful, output in terminal window will be along lines of `1 passed in 4.23s`

Test name example will have a green full stop `.` suffix:
Example: `test_2_EstTool_HappyPath_Default.py .`

If test fails, output in terminal window will be along lines `1 failed in 1.38s`

Test name example will have `F` suffix:
Example: `test_2_EstTool_HappyPath_Default.py F`

Cause of test failure is output in the same terminal window

Tests are automatically “headless”, meaning no browser window will be opened while running the tests and only results (Pass or Fail) will be seen in the terminal. However, you can run tests in headed mode by using the `--headed`
and the browser window will open.

Example: `pytest test_2_EstTool_HappyPath_Default.py --headed`

If you would like to view test flow in browser as it runs step by step but find that tests run too quick (browser window opens and closes too quickly) you can slow test down by adding `--slowmo`

Example: `pytest test_2_EstTool_HappyPath_Default.py --headed --slowmo 1000` (or 2000)

Tests can be run in different browsers (Use `chromium` for Chrome, `firefox` for Firefox & `webkit` for Safari). The following test will run on firefox and browser window will be open.

Example: `pytest test_2_EstTool_HappyPath_Default.py --browser=firefox --headed`

Note: All tests are pointing to `http://localhost:4200/`, if there is an issue with this (possibly 4200 may already be in use) then you may be directed to a different url, example `http://localhost:5600/`
If this is the case then then the code within each individual test to be run may need updated to match with localhost address otherwise the test(s) will fail. No global file was available to cover this scenario.

# Running Carbon Estimator Tool

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.4.

Run `npm install` to get the most recent dependencies

## Development server

Run `ng serve` or `npm run start` for a dev server. 

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

As mentioned previously, if directed to `http://localhost:5600/` instead of `http://localhost:4200/` then will have to update tests to match


