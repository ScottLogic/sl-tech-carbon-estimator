import { test, expect } from '../utilities/fixtures';

test('T16 assert text for assumptions and limitations', async ({ page, allSections, tcsEstimator }) => {
  await tcsEstimator.gotoHome();
  await allSections.assertAllSectionElementsAreVisible();
  await page.getByRole('tab', { name: 'Assumptions and limitations' }).click();
  await expect(
    page.getByText('Assumptions and Limitations The Technology Carbon Estimator tool is designed to')
  ).toHaveScreenshot('T16-assumptions-and-limitations-text.png');
});
