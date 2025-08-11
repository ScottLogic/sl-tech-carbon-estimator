import { test, expect } from '@playwright/test';
import { expectNoA11yViolations } from './test-helpers';
import { defaultPageElementVisibility, gotoHome } from './test-helpers';

test('Lightmode Accessibility test', async ({ page }) => {
  await gotoHome(page);

  await page.emulateMedia({ colorScheme: 'light' });

  // Run check on default page load
  await defaultPageElementVisibility(page);

  // Initial accessibility check
  await expectNoA11yViolations(page);

  // After filling form, check accessibility again
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expectNoA11yViolations(page);

  // Table view accessibility check
  await page.getByRole('tab', { name: 'Table' }).click();
  await expectNoA11yViolations(page);

  //Switch to assumptions tab
  await page.getByRole('tab', { name: 'Assumptions and Limitations' }).click();
  await expectNoA11yViolations(page);
});
