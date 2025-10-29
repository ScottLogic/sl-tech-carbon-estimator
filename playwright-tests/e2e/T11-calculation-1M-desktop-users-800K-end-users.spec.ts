import { test, expect } from '../utilities/fixtures';
import { assertAllSectionElementsAreVisible } from '../utilities/test-helpers';
import * as TestData from '../utilities/test-data';

test('T11 verify calculated values are coherent with selected employees, servers and users', async ({
  organisationSection,
  page,
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

  await organisationSection.selectNumberOfEmployess('1000000');
  await organisationSection.percentageSlider.click();
  await organisationSection.percentageSliderSet('ArrowRight', 10);
  await expect(organisationSection.percentageSliderText).toHaveValue('100');

  await onPremSection.selectNumberOfServers('100');
  await onPremSection.selectLocationOfServers('unknown');
  await cloudServicesSection.percentageSlider.click();
  await cloudServicesSection.percentageSliderSet('ArrowLeft', 7);
  await expect(cloudServicesSection.percentageSlider).toHaveValue('15');
  await cloudServicesSection.setMonthlyCloudBill('4: Object');

  await customersSection.setCustomersLocation('Globally');
  await page.getByLabel('How many monthly active users').click();
  await customersSection.setMonthlyActiveUsers('800000');
  await customersSection.percentageSlider.click();
  await customersSection.percentageSliderSet('ArrowLeft', 7);
  await expect(customersSection.percentageSlider).toHaveValue('15');
  await customersSection.setPrimaryPurpose('socialMedia');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T11-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T11-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T11-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  await tableSection.assertCorrectKilogramColumnValues(TestData.t11ExpectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t11ExpectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t11ExpectedEmissionPercentages);
});
