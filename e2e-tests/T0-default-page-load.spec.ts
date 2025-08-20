import { test, expect } from './fixtures';
import {
  assertCloudElementVisibility,
  assertEndUserElementVisibility,
  gotoHome,
  assertOnPremiseElementVisiblity,
  resultsTabVisibilityCheck,
  assertDefaultTableStructure,
} from './test-helpers';

test('Default page screenshot assertion,elements are visible and apex chart displays expected values', async ({
  page,
  organisationSection,
  onPremSection,
}) => {
  await gotoHome(page);
  await organisationSection.assertOrganisationSectionVisible();
  await onPremSection.assertOnPremiseSectionVisible();
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
