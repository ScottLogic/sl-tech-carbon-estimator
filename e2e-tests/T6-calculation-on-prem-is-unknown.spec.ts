import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T6 verify calculated values are coherent when on-prem is unknown', async ({
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  organisationSection,
  endUsersSection,
  estimationsSection,
  tableSection,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();
  await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, endUsersSection);

  await onPremSection.onPremUnknownTickbox.check();
  await expect(onPremSection.numberOfServersContainer).toBeDisabled();
  await onPremSection.selectLocationOfServers('in the UK');
  await onPremSection.selectLocationOfServers('Globally');

  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setCloudLocation('WORLD');
  await expect(cloudServicesSection.monthlyCloudBill).toHaveValue('0: Object');

  await endUsersSection.setEndUserLocation('Globally');
  await expect(endUsersSection.monthlyActiveUsersField).toHaveValue('100');
  await endUsersSection.setPrimaryPurpose('socialMedia');
  await endUsersSection.setPrimaryPurpose('average');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T6-apex-chart-kilograms.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T6-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  const expectedEmissionPercentages = [
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
  const expectedEmissionKilograms = [
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
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
