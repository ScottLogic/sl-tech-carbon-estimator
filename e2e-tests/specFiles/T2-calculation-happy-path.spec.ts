import { test } from '../utilities/fixtures';
import * as TestData from '../test-data';

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

  await tableSection.assertCorrectKilogramColumnValues(TestData.t2ExpectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t2ExpectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t2ExpectedEmissionPercentages);
});
