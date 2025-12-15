import { test, expect } from '../utilities/fixtures';
import * as TestData from '../utilities/test-data';

test('T14 verify calculated values are coherent with selected employees, servers and users', async ({
  allSections,
  organisationSection,
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  customersSection,
  estimationsSection,
  tableSection,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();
  await allSections.assertAllSectionElementsAreVisible();

  await organisationSection.selectNumberOfEmployess('25000');
  await organisationSection.percentageSlider.click();
  await organisationSection.percentageSliderSet('80');
  await expect(organisationSection.percentageSliderText).toHaveValue('80');

  await onPremSection.selectNumberOfServers('500');
  await expect(onPremSection.locationOfServersField).toHaveValue('WORLD');

  await cloudServicesSection.percentageSliderSet('45');
  await expect(cloudServicesSection.percentageSlider).toHaveValue('45');
  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setCloudLocation('WORLD');
  await expect(cloudServicesSection.monthlyCloudBill).toHaveValue('0: Object');

  await customersSection.setCustomersLocation('in North America');
  await customersSection.setMonthlyActiveUsers('10000000');
  await customersSection.percentageSlider.click();
  await customersSection.percentageSliderSet('80');
  await expect(customersSection.percentageSlider).toHaveValue('80');
  await await expect(customersSection.primaryPurposeQuestion).toBeVisible();
  await customersSection.setPrimaryPurpose('streaming');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T14-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T14-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T14-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  await tableSection.assertCorrectKilogramColumnValues(TestData.t14ExpectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t14ExpectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t14ExpectedEmissionPercentages);
});
