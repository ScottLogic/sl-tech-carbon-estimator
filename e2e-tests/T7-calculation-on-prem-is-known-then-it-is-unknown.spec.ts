import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T7 verify calculated values are coherent when on-prem is known then recalulated when unknown ', async ({
  page,
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  endUsersSection,
  estimationsSection,
  tableSection,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();
  await assertAllSectionElementsAreVisible(page);

  await onPremSection.selectNumberOfServers('555');
  await onPremSection.selectLocationOfServers('GBR');
  await onPremSection.selectLocationOfServers('WORLD');

  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setCloudLocation('WORLD');
  await expect(cloudServicesSection.monthlyCloudBill).toHaveValue('0: Object');

  await endUsersSection.setEndUserLocation('Globally');
  await endUsersSection.setPrimaryPurpose('socialMedia');
  await endUsersSection.setPrimaryPurpose('average');

  // Calculate
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T7-apex-chart-kilograms.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T7-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  const expectedEmissionPercentages = [
    '13%',
    '<1%',
    '12%',
    '<1%',
    '87%',
    '<1%',
    '85%',
    '1%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 221721 kg ',
    ' 13708 kg ',
    ' 201188 kg ',
    ' 6825 kg ',
    ' 1482466 kg ',
    ' 6485 kg ',
    ' 1453521 kg ',
    ' 22460 kg ',
    ' 621 kg ',
    ' 621 kg ',
    ' 387 kg ',
    ' 148 kg ',
    ' 239 kg ',
    ' 1705194 kg ',
  ];

  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);

  await estimationsSection.diagramViewButton.click();

  await onPremSection.onPremUnknownTickbox.check();
  await onPremSection.selectLocationOfServers('in the UK');
  await onPremSection.selectLocationOfServers('Globally');

  await cloudServicesSection.assertDefaultCloudElementVisibility();

  await endUsersSection.assertEndUserSectionVisible();
  await endUsersSection.setPrimaryPurpose('information');
  await endUsersSection.setPrimaryPurpose('average');

  await tcsEstimator.calculateButton.click();
  await diagramSection.kilogramsButton.click();
  await diagramSection.assertDiagramScreenshot('T7-apex-chart-kilograms-1.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T7-apex-chart-percentages-1.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  const expectedEmissionPercentages1 = [
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
  const expectedEmissionKilograms1 = [
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
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms1);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages1);
});
