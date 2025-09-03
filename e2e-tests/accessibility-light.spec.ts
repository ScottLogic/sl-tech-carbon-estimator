import { test } from './fixtures';

import { expectNoA11yViolations } from './test-helpers';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test.describe('Accessibility Light Mode Tests', () => {
  test.beforeEach(async ({ page, tcsEstimator }) => {
    await tcsEstimator.gotoHome();
    await page.emulateMedia({ colorScheme: 'light' });
  });
  test('Lightmode Accessibility test', async ({
    page,
    organisationSection,
    onPremSection,
    cloudServicesSection,
    endUsersSection,
    tcsEstimator,
    estimationsSection,
  }) => {
    await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, endUsersSection);

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
