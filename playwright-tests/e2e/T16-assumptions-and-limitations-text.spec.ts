import { test, expect } from '../utilities/fixtures';
import { assertAllSectionElementsAreVisible } from '../utilities/test-helpers';

test('T16 assert text for assumptions and limitations', async ({
  page,
  organisationSection,
  onPremSection,
  customersSection,
  cloudServicesSection,
  tcsEstimator,
}) => {
  await tcsEstimator.gotoHome();
  await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, customersSection);

  await page.getByRole('tab', { name: 'Assumptions and limitations' }).click();
  await expect(
    page.getByText('Assumptions and Limitations The Technology Carbon Estimator tool is designed to')
  ).toHaveScreenshot('T16-assumptions-and-limitations-text.png');
});
