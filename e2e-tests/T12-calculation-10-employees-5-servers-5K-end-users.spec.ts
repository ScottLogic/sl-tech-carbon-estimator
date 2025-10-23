import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';
import * as TestData from './test-data';

test('T12 verify calculated values are coherent with selected employees, servers and users', async ({
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

  await organisationSection.selectNumberOfEmployess('10');
  await organisationSection.percentageSlider.click();
  await organisationSection.percentageSliderSet('ArrowLeft', 10);

  await onPremSection.selectNumberOfServers('5');
  await onPremSection.selectLocationOfServers('in the UK');

  await cloudServicesSection.cloudUnusedTickbox.check();
  await expect(cloudServicesSection.cloudUnusedTickbox).toBeChecked();
  await expect(cloudServicesSection.percentageSplitQuestion).not.toBeVisible();

  await customersSection.setCustomersLocation('in the UK');
  await customersSection.setMonthlyActiveUsers('5000');
  await customersSection.percentageSlider.click();
  await customersSection.percentageSliderSet('ArrowLeft', 1);
  await customersSection.percentageSliderSet('ArrowRight', 5);
  await expect(customersSection.percentageSlider).toHaveValue('70');
  await customersSection.setPrimaryPurpose('eCommerce');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T12-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T12-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T12-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();

  await tableSection.assertCorrectKilogramColumnValues(TestData.t12ExpectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t12ExpectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t12ExpectedEmissionPercentages);
});
