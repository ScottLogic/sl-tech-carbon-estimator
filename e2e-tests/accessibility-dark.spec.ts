import { test, expect } from '@playwright/test';
import { expectNoA11yViolations } from './test-helpers';
import { assertAllSectionElementsAreVisible, gotoHome, expansionPanelClick } from './test-helpers';

test.describe('Accessibility Dark Mode Tests', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await page.emulateMedia({ colorScheme: 'dark' });
  });

  test('Darkmode default Accessibility test', async ({ page }) => {
    // Initial accessibility check
    await expectNoA11yViolations(page);

    // Run check on default page load
    await assertAllSectionElementsAreVisible(page);

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
