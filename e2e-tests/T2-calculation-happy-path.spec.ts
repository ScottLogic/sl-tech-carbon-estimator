import { test, expect } from './fixtures';
import {
  gotoHome,
  assertAllSectionElementsAreVisible,
  assertTableShowsCorrectCells,
  assertColumnShowsCorrectValues,
} from './test-helpers';

test('T2 verify calculated values are coherent with selected options', async ({
  organisationSection,
  onPremSection,
  page,
  tcsEstimator,
  cloudServicesSection,
  endUsersSection,
  estimationsSection,
  tableSection,
}) => {
  await tcsEstimator.gotoHome();

  await assertAllSectionElementsAreVisible(page);

  await organisationSection.selectNumberOfEmployess('100');

  await onPremSection.selectNumberOfServers('10');
  await onPremSection.selectLocationOfServers('in the UK');
  await onPremSection.selectLocationOfServers('Globally');

  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setCloudLocation('WORLD');
  await cloudServicesSection.setMonthlyCloudBill('0: Object');

  await endUsersSection.setPrimaryPurpose('average');
  await endUsersSection.setEndUserLocation('GBR');
  await endUsersSection.setEndUserLocation('Globally');
  await endUsersSection.setMonthlyActiveUsers('100');

  await tcsEstimator.calculateButton.click();
  await estimationsSection.assertDiagramScreenshot('T2-apex-chart-kilograms.png');
  await estimationsSection.percentageButton.click();
  await estimationsSection.assertDiagramScreenshot('T2-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure;

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
