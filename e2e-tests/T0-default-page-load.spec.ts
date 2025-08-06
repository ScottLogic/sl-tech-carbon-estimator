import { test, expect } from '@playwright/test';
import {
  cloudVisibility,
  endUserVisibility,
  gotoHome,
  onPremiseVisibility,
  organisationVisibility,
} from './test-helpers';

// This test is to check that the page loads, labels, scroll bars, dropdowns are all visible and set at the default when page loads

test('Default page screenshot assertion,elements are visible and apex chart displays expected values', async ({
  page,
}) => {
  await gotoHome(page);
  await organisationVisibility(page);
  await onPremiseVisibility(page);
  await cloudVisibility(page);
  await endUserVisibility(page);
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T0-apex-chart.png');
});
