import { test } from '../utilities/fixtures';
import { expectNoA11yViolations } from '../utilities/test-helpers';

test.describe('Accessibility Dark Mode Tests', () => {
  test.beforeEach(async ({ page, tcsEstimator }) => {
    await tcsEstimator.gotoHome();
    await page.emulateMedia({ colorScheme: 'dark' });
  });

  test('Dark mode default Accessibility test', async ({ tcsEstimator, page, allSections, estimationsSection }) => {
    await expectNoA11yViolations(page);

    await allSections.assertAllSectionElementsAreVisible();

    await tcsEstimator.calculateButton.click();
    await expectNoA11yViolations(page);

    await estimationsSection.tableViewButton.click();
    await expectNoA11yViolations(page);

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
