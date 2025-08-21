import { test, expect } from '@playwright/test';
import { expansionPanelClick, expectNoA11yViolations } from './test-helpers';
import { assertAllSectionElementsAreVisible, gotoHome } from './test-helpers';

test.describe('Accessibility Light Mode Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await page.emulateMedia({ colorScheme: 'light' });
  });
  test('Lightmode Accessibility test', async ({ page }) => {
    // Run check on default page load
    await assertAllSectionElementsAreVisible(page);

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

  test('Assert that DarkMode information panels are accessible', async ({ page }) => {
    //expand all panels
    await expansionPanelClick(page, 'Where are your employees', 'Show details');
    await expansionPanelClick(page, 'Where are they primarily', 'Show details');
    await expansionPanelClick(page, 'Where are your cloud servers', 'Show details');
    await expansionPanelClick(page, "What's the primary purpose of", 'Show details');
    await expansionPanelClick(page, 'What percentage of your end-', 'Show details');

    await expectNoA11yViolations(page);
  });
});
