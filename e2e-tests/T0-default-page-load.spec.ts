import { test, expect } from '@playwright/test';
import {
  assertCloudElementVisibility,
  assertEndUserElementVisibility,
  gotoHome,
  assertOnPremiseElementVisiblity,
  assertOrganisationElementVisiblity,
  resultsTabVisibilityCheck,
  assertDefaultTableStructure,
} from './test-helpers';

test('Default page screenshot assertion,elements are visible and apex chart displays expected values', async ({
  page,
}) => {
  await gotoHome(page);
  await assertOrganisationElementVisiblity(page);
  await assertOnPremiseElementVisiblity(page);
  await assertCloudElementVisibility(page);
  await assertEndUserElementVisibility(page);
  await resultsTabVisibilityCheck(page);
  await page.getByRole('tab', { name: 'Table' }).click();
  await assertDefaultTableStructure(page);
  await page.getByRole('tab', { name: 'Diagram' }).click();
  await page.getByRole('button', { name: 'Calculate' }).click();
  await page.getByText('%', { exact: true }).click();
  await expect(page.locator('foreignobject')).toHaveScreenshot('T0-apex-chart.png');
});
