import { test } from '../utilities/fixtures';

import { expectNoA11yViolations } from '../utilities/test-helpers';
import { assertAllSectionElementsAreVisible } from '../utilities/test-helpers';

test.describe('Accessibility Dark Mode Tests', () => {
  test.beforeEach(async ({ page, tcsEstimator }) => {
    await tcsEstimator.gotoHome();
    await page.emulateMedia({ colorScheme: 'dark' });
  });

  test('Darkmode default Accessibility test', async ({
    organisationSection,
    onPremSection,
    cloudServicesSection,
    customersSection,
    tcsEstimator,
    page,
    estimationsSection,
  }) => {
    await expectNoA11yViolations(page);

    await assertAllSectionElementsAreVisible(
      organisationSection,
      onPremSection,
      cloudServicesSection,
      customersSection
    );

    await tcsEstimator.calculateButton.click();
    await expectNoA11yViolations(page);

    await estimationsSection.tableViewButton.click();
    await await expectNoA11yViolations(page);

    await tcsEstimator.assumptionsAndLimitationsTab.click();
    await expectNoA11yViolations(page);
  });

  test('Assert that DarkMode information panels are accessible', async ({
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
