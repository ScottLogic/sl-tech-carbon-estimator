import { test } from '../utilities/fixtures';
import { expectNoA11yViolations } from '../utilities/test-helpers';

test.describe('Accessibility Light Mode Tests', () => {
  test.beforeEach(async ({ page, tcsEstimator }) => {
    await tcsEstimator.gotoHome();
    await page.emulateMedia({ colorScheme: 'light' });
  });

  test('Light mode Accessibility test', async ({ page, allSections, tcsEstimator, estimationsSection }) => {
    await allSections.assertAllSectionElementsAreVisible();
    await expectNoA11yViolations(page);
    await tcsEstimator.calculateButton.click();
    await expectNoA11yViolations(page);
    await estimationsSection.tableViewButton.click();
    await expectNoA11yViolations(page);
    await tcsEstimator.assumptionsAndLimitationsTab.click();
    await expectNoA11yViolations(page);
  });

  test('Assert that LightMode information panels are accessible', async ({
    page,
    organisationSection,
    onPremSection,
    cloudServicesSection,
    customersSection,
  }) => {
    await organisationSection.showEmployeeLocationTooltip.click();
    await onPremSection.showServerLocationTooltip.click();
    await cloudServicesSection.showCloudServerLocationTooltip.click();
    await customersSection.showPrimaryPurposeTooltip.click();
    await customersSection.showCustomersLocationTooltip.click();
    await customersSection.showCustomersPercentageTooltip.click();
    await expectNoA11yViolations(page);
  });
});
