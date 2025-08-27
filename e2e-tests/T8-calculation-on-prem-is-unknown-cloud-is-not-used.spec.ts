import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T8 verify calculated values are coherent when on prem is unknown and cloud is not used', async ({
  page,
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  endUsersSection,
  estimationsSection,
  tableSection,
}) => {
  await tcsEstimator.gotoHome();

  await assertAllSectionElementsAreVisible(page);

  await onPremSection.onPremUnknownTickbox.check();
  await expect(onPremSection.assumptionText).toBeVisible();

  await expect(onPremSection.numberOfServersContainer).toBeVisible();
  await expect(onPremSection.numberOfServersContainer).toBeDisabled();
  await onPremSection.selectLocationOfServers('GBR');
  await onPremSection.selectLocationOfServers('WORLD');

  await cloudServicesSection.cloudUnusedTickbox.check();
  await expect(cloudServicesSection.cloudUnusedTickbox).toBeChecked();
  await expect(cloudServicesSection.percentageSplitQuestion).not.toBeVisible();

  await endUsersSection.setEndUserLocation('Globally');
  await endUsersSection.setPrimaryPurpose('socialMedia');
  await endUsersSection.setPrimaryPurpose('average');

  await tcsEstimator.calculateButton.click();
  await estimationsSection.assertDiagramScreenshot('T8-apex-chart-kilograms.png');
  await estimationsSection.percentageButton.click();
  await estimationsSection.assertDiagramScreenshot('T8-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();

  const expectedEmissionPercentages = [
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
  const expectedEmissionKilograms = [
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

  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
