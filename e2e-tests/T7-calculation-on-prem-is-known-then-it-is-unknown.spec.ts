import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';
import * as TestData from './test-data';

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

  await tableSection.assertCorrectKilogramColumnValues(TestData.t7ExpectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t7ExpectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t7ExpectedEmissionPercentages);

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

  await tableSection.assertCorrectKilogramColumnValues(TestData.t7ExpectedEmissionKilograms1Monthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t7ExpectedEmissionKilograms1annual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t7ExpectedEmissionPercentages1);
});
