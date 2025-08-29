import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test.describe('Table Accordion Calculations', async () => {
  test.beforeEach(
    async ({
      tcsEstimator,
      organisationSection,
      onPremSection,
      cloudServicesSection,
      endUsersSection,
      estimationsSection,
      tableSection,
    }) => {
      await tcsEstimator.gotoHome();
      await assertAllSectionElementsAreVisible(
        organisationSection,
        onPremSection,
        cloudServicesSection,
        endUsersSection
      );

      await estimationsSection.tableViewButton.click();
      await tableSection.assertDefaultTableStructure;
    }
  );
  test('Table shows expected values (no checkboxes)', async ({ tcsEstimator, tableSection }) => {
    await tcsEstimator.calculateButton.click();

    const expectedEmissionPercentages = [
      '34%',
      '25%',
      '7%',
      '2%',
      '65%',
      '12%',
      '47%',
      '6%',
      '1%',
      '1%',
      '<1%',
      '<1%',
      '<1%',
      '100%',
    ];
    const expectedEmissionKilograms = [
      ' 18633 kg ',
      ' 13708 kg ',
      ' 3625 kg ',
      ' 1300 kg ',
      ' 35767 kg ',
      ' 6485 kg ',
      ' 26190 kg ',
      ' 3093 kg ',
      ' 621 kg ',
      ' 621 kg ',
      ' 387 kg ',
      ' 148 kg ',
      ' 239 kg ',
      ' 55408 kg ',
    ];
    await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
    await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
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

    const expectedEmissionsOnPremiseUnknownArray = [
      '42%',
      '34%',
      '4%',
      '3%',
      '56%',
      '16%',
      '32%',
      '8%',
      '2%',
      '2%',
      '<1%',
      '<1%',
      '<1%',
      '100%',
    ];

    const expectedEmissionKilogramsOnPremiseUnknownArray = [
      ' 16821 kg ',
      ' 13708 kg ',
      ' 1813 kg ',
      ' 1300 kg ',
      ' 22673 kg ',
      ' 6485 kg ',
      ' 13095 kg ',
      ' 3093 kg ',
      ' 621 kg ',
      ' 621 kg ',
      ' 387 kg ',
      ' 148 kg ',
      ' 239 kg ',
      ' 40501 kg ',
    ];
    await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsOnPremiseUnknownArray);
    await tableSection.assertCorrectPercentageColumnValues(expectedEmissionsOnPremiseUnknownArray);
  });
  test('Table shows expected values (Cloud services not used)', async ({
    tcsEstimator,
    cloudServicesSection,
    tableSection,
  }) => {
    await cloudServicesSection.cloudUnusedTickbox.check();
    await tcsEstimator.calculateButton.click();
    await expect(tableSection.cloudServices).not.toBeVisible();

    const expectedEmissionsCloudNotUsedArray = [
      '34%',
      '25%',
      '7%',
      '2%',
      '65%',
      '12%',
      '48%',
      '6%',
      '<1%',
      '<1%',
      '<1%',
      '<1%',
      '100%',
    ];
    const expectedEmissionKilogramsCloudNotUsedArray = [
      ' 18633 kg ',
      ' 13708 kg ',
      ' 3625 kg ',
      ' 1300 kg ',
      ' 35767 kg ',
      ' 6485 kg ',
      ' 26190 kg ',
      ' 3093 kg ',
      ' <1 kg ',
      ' 387 kg ',
      ' 148 kg ',
      ' 239 kg ',
      ' 54787 kg ',
    ];
    await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsCloudNotUsedArray);
    await tableSection.assertCorrectPercentageColumnValues(expectedEmissionsCloudNotUsedArray);
  });
  test('Table shows expected values (No external users)', async ({ tcsEstimator, endUsersSection, tableSection }) => {
    await endUsersSection.endUserUnusedTickbox.check();
    await tcsEstimator.calculateButton.click();
    await expect(tableSection.endUserDevices).not.toBeVisible();
    await expect(tableSection.networkDataTransfer).not.toBeVisible();

    const expectedEmissionsNoExternalUsersArray = [
      '34%',
      '25%',
      '7%',
      '2%',
      '65%',
      '12%',
      '48%',
      '6%',
      '1%',
      '1%',
      '<1%',
      '100%',
    ];
    const expectedEmissionKilogramsNoExternalUsersArray = [
      ' 18633 kg ',
      ' 13708 kg ',
      ' 3625 kg ',
      ' 1300 kg ',
      ' 35767 kg ',
      ' 6485 kg ',
      ' 26190 kg ',
      ' 3093 kg ',
      ' 621 kg ',
      ' 621 kg ',
      ' <1 kg ',
      ' 55022 kg ',
    ];
    await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsNoExternalUsersArray);
    await tableSection.assertCorrectPercentageColumnValues(expectedEmissionsNoExternalUsersArray);
  });
});
