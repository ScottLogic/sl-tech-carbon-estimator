import { test, expect } from '../utilities/fixtures';
import { assertAllSectionElementsAreVisible } from '../utilities/test-helpers';
import * as TestData from '../utilities/test-data';

test('T13 verify calculated values are coherent with selected employees, servers and users', async ({
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
  await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, customersSection);
  await organisationSection.selectNumberOfEmployess('500');
  await organisationSection.percentageSlider.click();
  await organisationSection.percentageSliderSet('ArrowLeft', 4);
  await expect(organisationSection.percentageSliderText).toHaveValue('30');

  await onPremSection.selectNumberOfServers('100');

  await cloudServicesSection.cloudUnusedTickbox.check();
  await expect(cloudServicesSection.cloudUnusedTickbox).toBeChecked();
  await expect(cloudServicesSection.percentageSplitQuestion).not.toBeVisible();

  await customersSection.setCustomersLocation('in the UK');
  await customersSection.setMonthlyActiveUsers('3333');
  await customersSection.percentageSlider.click();
  await customersSection.percentageSliderSet('ArrowLeft', 1);
  await customersSection.percentageSliderSet('ArrowRight', 10);
  await expect(customersSection.percentageSlider).toHaveValue('95');
  await customersSection.setPrimaryPurpose('information');

  await tcsEstimator.calculateButton.click();
  await diagramSection.kilogramsButton.click();
  await diagramSection.assertDiagramScreenshot('T13-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T13-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T13-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();

  await tableSection.assertCorrectKilogramColumnValues(TestData.t13ExpectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t13ExpectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t13ExpectedEmissionPercentages);
  await tableSection.assertCorrectKilogramColumnValues(TestData.t13ExpectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t13ExpectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t13ExpectedEmissionPercentages);

  await estimationsSection.diagramViewButton.click();
  await cloudServicesSection.cloudUnusedTickbox.uncheck();
  await expect(cloudServicesSection.serverLocation).toBeVisible();
  await cloudServicesSection.setCloudLocation('Globally');
  await cloudServicesSection.setCloudLocation("I don't know");

  await tcsEstimator.calculateButton.click();
  await diagramSection.percentageButton.click();
  await estimationsSection.annualViewButton.click();
  await diagramSection.assertDiagramScreenshot('T13-apex-chart-1-percentages.png');
  await diagramSection.kilogramsButton.click();
  await diagramSection.assertDiagramScreenshot('T13-apex-chart-1-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T13-apex-chart-1-kilograms-monthly.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  await tableSection.assertCorrectKilogramColumnValues(TestData.t13ExpectedEmissionKilograms1Monthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t13ExpectedEmissionKilograms1Annual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t13ExpectedEmissionPercentages1);
  await tableSection.assertCorrectKilogramColumnValues(TestData.t13ExpectedEmissionKilograms1Monthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t13ExpectedEmissionKilograms1Annual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t13ExpectedEmissionPercentages1);
});
