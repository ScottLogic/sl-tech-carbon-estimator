import { test } from './fixtures';

import { expectNoA11yViolations } from './test-helpers';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test.describe('Accessibility Dark Mode Tests', () => {
  test.beforeEach(async ({ page, tcsEstimator }) => {
    await tcsEstimator.gotoHome();
    await page.emulateMedia({ colorScheme: 'dark' });
  });

  test('Darkmode default Accessibility test', async ({
    organisationSection,
    onPremSection,
    cloudServicesSection,
    endUsersSection,
    tcsEstimator,
    page,
    estimationsSection,
  }) => {
    await expectNoA11yViolations(page);

    await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, endUsersSection);

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
    endUsersSection,
  }) => {
    await organisationSection.showEmployeeLocationTooltip.click();
    await onPremSection.showServerLocationTooltip.click();
    await cloudServicesSection.showCloudServerLocationTooltip.click();
    await endUsersSection.showPrimaryPurposeTooltip.click();
    await endUsersSection.showEndUserLocationTooltip.click();
    await endUsersSection.showEndUserPercentageTooltip.click();
    await expectNoA11yViolations(page);
  });
});
