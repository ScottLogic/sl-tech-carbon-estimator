import * as TestData from './test-data';
import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';
import { table } from 'console';

test.describe('Table Accordion Calculations', async () => {
  test.beforeEach(
    async ({
      tcsEstimator,
      organisationSection,
      onPremSection,
      cloudServicesSection,
      customersSection,
      estimationsSection,
      tableSection,
    }) => {
      await tcsEstimator.gotoHome();
      await assertAllSectionElementsAreVisible(
        organisationSection,
        onPremSection,
        cloudServicesSection,
        customersSection
      );

      await estimationsSection.tableViewButton.click();
      await tableSection.assertDefaultTableStructure;
    }
  );
  test('Table shows expected values (no checkboxes)', async ({ estimationsSection, tcsEstimator, tableSection }) => {
    await tcsEstimator.calculateButton.click();

    await tableSection.assertCorrectKilogramColumnValues(TestData.t18NoCheckBoxesExpectedEmissionKilogramsAnnual);
    await estimationsSection.monthlyViewButton.click();
    await tableSection.assertCorrectKilogramColumnValues(TestData.t18NoCheckBoxesExpectedEmissionKilogramsMonthly);
    await tableSection.assertCorrectPercentageColumnValues(TestData.t18NoCheckBoxesExpectedEmissionPercentages);
  });
  test('Table shows expected values (On-Premise is unknown)', async ({
    tcsEstimator,
    onPremSection,
    estimationsSection,
    tableSection,
  }) => {
    await estimationsSection.tableViewButton.click();
    await onPremSection.onPremUnknownTickbox.check();
    await tcsEstimator.calculateButton.click();

    await tableSection.assertCorrectKilogramColumnValues(
      TestData.t18ExpectedEmissionKilogramsAnnualOnPremiseUnknownArray
    );
    await estimationsSection.monthlyViewButton.click();
    await tableSection.assertCorrectKilogramColumnValues(
      TestData.t18ExpectedEmissionKilogramsMonthlyOnPremiseUnknownArray
    );
    await tableSection.assertCorrectPercentageColumnValues(
      TestData.t18ExpectedEmissionsOnPremiseUnknownPercentagesArray
    );
  });
  test('Table shows expected values (Cloud services not used)', async ({
    tcsEstimator,
    cloudServicesSection,
    tableSection,
    estimationsSection,
  }) => {
    await cloudServicesSection.cloudUnusedTickbox.check();
    await tcsEstimator.calculateButton.click();
    await expect(tableSection.cloudServices).not.toBeVisible();

    await tableSection.assertCorrectKilogramColumnValues(TestData.t18ExpectedAnnualEmissionKilogramsCloudNotUsedArray);
    await estimationsSection.monthlyViewButton.click();
    await tableSection.assertCorrectKilogramColumnValues(TestData.t18ExpectedMonthlyEmissionKilogramsCloudNotUsedArray);
    await tableSection.assertCorrectPercentageColumnValues(TestData.t18ExpectedEmissionsCloudNotUsedPercentagesArray);
  });
  test('Table shows expected values (No external users)', async ({
    estimationsSection,
    tcsEstimator,
    customersSection,
    tableSection,
  }) => {
    await customersSection.customersUnusedTickbox.check();
    await tcsEstimator.calculateButton.click();
    await expect(tableSection.customerDevices).not.toBeVisible();
    await expect(tableSection.networkDataTransfer).not.toBeVisible();

    await tableSection.assertCorrectKilogramColumnValues(
      TestData.t18ExpectedAnnualEmissionKilogramsNoExternalUsersArray
    );
    await estimationsSection.monthlyViewButton.click();
    await tableSection.assertCorrectKilogramColumnValues(
      TestData.t18ExpectedMonthlyEmissionKilogramsNoExternalUsersArray
    );
    await tableSection.assertCorrectPercentageColumnValues(TestData.t18ExpectedEmissionPercentagesNoExternalUsersArray);
  });
});
