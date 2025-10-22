import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T7 verify calculated values are coherent when on-prem is known then recalulated when unknown ', async ({
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  customersSection,
  estimationsSection,
  tableSection,
  diagramSection,
  organisationSection,
}) => {
  await tcsEstimator.gotoHome();
  await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, customersSection);

  await onPremSection.selectNumberOfServers('555');
  await onPremSection.selectLocationOfServers('GBR');
  await onPremSection.selectLocationOfServers('WORLD');

  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setCloudLocation('WORLD');
  await expect(cloudServicesSection.monthlyCloudBill).toHaveValue('0: Object');

  await customersSection.setCustomersLocation('Globally');
  await customersSection.setPrimaryPurpose('socialMedia');
  await customersSection.setPrimaryPurpose('average');

  // Calculate
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T7-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T7-apex-chart-kilograms-monthly.png');
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

  const expectedEmissionKilogramsMonthly = [
    ' 18477 kg ',
    ' 1142 kg ',
    ' 16766 kg ',
    ' 569 kg ',
    ' 123539 kg ',
    ' 540 kg ',
    ' 121127 kg ',
    ' 1872 kg ',
    ' 52 kg ',
    ' 52 kg ',
    ' 32 kg ',
    ' 12 kg ',
    ' 20 kg ',
    ' 142100 kg ',
  ];
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);

  await estimationsSection.diagramViewButton.click();

  await onPremSection.onPremUnknownTickbox.check();
  await onPremSection.selectLocationOfServers('in the UK');
  await onPremSection.selectLocationOfServers('Globally');

  await cloudServicesSection.assertDefaultCloudElementVisibility();

  await customersSection.assertCustomersSectionVisible();
  await customersSection.setPrimaryPurpose('information');
  await customersSection.setPrimaryPurpose('average');

  await tcsEstimator.calculateButton.click();
  await diagramSection.kilogramsButton.click();
  await diagramSection.assertDiagramScreenshot('T7-apex-chart-kilograms-1-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T7-apex-chart-kilograms-1-monthly.png');

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
  const expectedEmissionKilograms1annual = [
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

  const expectedEmissionKilograms1Monthly = [
    ' 1402 kg ',
    ' 1142 kg ',
    ' 151 kg ',
    ' 108 kg ',
    ' 1889 kg ',
    ' 540 kg ',
    ' 1091 kg ',
    ' 258 kg ',
    ' 52 kg ',
    ' 52 kg ',
    ' 32 kg ',
    ' 12 kg ',
    ' 20 kg ',
    ' 3375 kg ',
  ];

  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms1Monthly);3731
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms1annual);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages1);
});
