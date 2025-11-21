import { test, expect } from '../utilities/fixtures';
import { assertAllSectionElementsAreVisible } from '../utilities/test-helpers';
import * as TestData from '../utilities/test-data';

test('T8 verify calculated values are coherent when on prem is unknown and cloud is not used', async ({
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

  await onPremSection.onPremUnknownTickbox.check();
  await expect(onPremSection.assumptionText).toBeVisible();

  await expect(onPremSection.numberOfServersContainer).toBeVisible();
  await expect(onPremSection.numberOfServersContainer).toBeDisabled();
  await onPremSection.selectLocationOfServers('GBR');
  await onPremSection.selectLocationOfServers('WORLD');

  await cloudServicesSection.cloudUnusedTickbox.check();
  await expect(cloudServicesSection.cloudUnusedTickbox).toBeChecked();
  await expect(cloudServicesSection.percentageSplitQuestion).not.toBeVisible();

  await customersSection.setCustomersLocation('Globally');
  await customersSection.setPrimaryPurpose('socialMedia');
  await customersSection.setPrimaryPurpose('average');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T8-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T8-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T8-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();

  await tableSection.assertCorrectKilogramColumnValues(TestData.t8ExpectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t8ExpectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t8ExpectedEmissionPercentages);
});
