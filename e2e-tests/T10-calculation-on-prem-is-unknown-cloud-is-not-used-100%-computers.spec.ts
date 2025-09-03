import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T10 verify calculated values are coherent when on-prem is unknown, cloud is not used, and 100% computers', async ({
  page,
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  endUsersSection,
  estimationsSection,
  tableSection,
  diagramSection,
  organisationSection,
}) => {
  await tcsEstimator.gotoHome();

  await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, endUsersSection);

  await onPremSection.onPremUnknownTickbox.check();
  await expect(onPremSection.assumptionText).toBeVisible();
  await expect(onPremSection.numberOfServersContainer).toBeVisible();
  await expect(onPremSection.numberOfServersContainer).toBeDisabled();
  await onPremSection.selectLocationOfServers('GBR');
  await onPremSection.selectLocationOfServers('WORLD');

  await cloudServicesSection.cloudUnusedTickbox.check();
  await expect(cloudServicesSection.cloudUnusedTickbox).toBeChecked();
  await expect(cloudServicesSection.percentageSplitQuestion).not.toBeVisible();

  await endUsersSection.setEndUserLocation('in the UK');
  await endUsersSection.setMonthlyActiveUsers('1000');
  await endUsersSection.percentageSlider.click();
  await endUsersSection.percentageSliderSet('ArrowLeft', 10);
  await endUsersSection.setPrimaryPurpose('average');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T10-apex-chart-kilograms.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T10-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();

  const expectedEmissionPercentages = [
    '33%',
    '24%',
    '6%',
    '2%',
    '63%',
    '11%',
    '46%',
    '5%',
    '<1%',
    '4%',
    '2%',
    '2%',
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
    ' 2357 kg ',
    ' 1292 kg ',
    ' 1066 kg ',
    ' 56758 kg ',
  ];
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
