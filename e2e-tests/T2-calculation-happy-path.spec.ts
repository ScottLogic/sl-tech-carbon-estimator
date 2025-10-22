import { test } from './fixtures';

test('T2 verify calculated values are coherent with selected options', async ({
  organisationSection,
  onPremSection,
  tcsEstimator,
  cloudServicesSection,
  customersSection,
  estimationsSection,
  tableSection,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();

  await organisationSection.assertOrganisationSectionVisible();
  await onPremSection.assertOnPremiseSectionVisible();
  await cloudServicesSection.assertDefaultCloudElementVisibility();
  await customersSection.assertCustomersSectionVisible();

  await organisationSection.selectNumberOfEmployess('100');

  await onPremSection.selectNumberOfServers('10');
  await onPremSection.selectLocationOfServers('in the UK');
  await onPremSection.selectLocationOfServers('Globally');

  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setCloudLocation('WORLD');
  await cloudServicesSection.setMonthlyCloudBill('0: Object');

  await customersSection.setPrimaryPurpose('average');
  await customersSection.setCustomersLocation('GBR');
  await customersSection.setCustomersLocation('Globally');
  await customersSection.setMonthlyActiveUsers('100');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T2-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T2-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T2-apex-chart-percentages.png');
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
  const expectedEmissionKilogramsAnnual = [
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
  const expectedEmissionKilogramsMonthly = [
    ' 1553 kg ',
    ' 1142 kg ',
    ' 302 kg ',
    ' 108 kg ',
    ' 2981 kg ',
    ' 540 kg ',
    ' 2182 kg ',
    ' 258 kg ',
    ' 52 kg ',
    ' 52 kg ',
    ' 32 kg ',
    ' 12 kg ',
    ' 20 kg ',
    ' 4617 kg ',
  ];
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
