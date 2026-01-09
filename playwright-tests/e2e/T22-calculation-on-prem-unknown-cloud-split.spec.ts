import { test, expect } from '../utilities/fixtures';
import * as TestData from '../utilities/test-data';

test.describe('Verify calculations for estimated on-prem and cloud server percentage splits', () => {
  test.beforeEach(async ({ tcsEstimator, onPremSection }) => {
    await tcsEstimator.gotoHome();
    await onPremSection.onPremUnknownTickbox.check();
    await expect(onPremSection.assumptionText).toBeVisible();
    await expect(onPremSection.numberOfServersContainer).toBeVisible();
    await expect(onPremSection.numberOfServersContainer).toBeDisabled();
  });

  test('T22 verify calculated values are coherent when on-prem is unknown and 75/25 split with cloud', async ({
    tcsEstimator,
    cloudServicesSection,
    estimationsSection,
    tableSection,
    diagramSection,
  }) => {
    await cloudServicesSection.percentageSliderSet('75');
    await tcsEstimator.calculateButton.click();
    await diagramSection.assertDiagramScreenshot('T22-apex-chart-kilograms-annual.png');
    await estimationsSection.monthlyViewButton.click();
    await diagramSection.assertDiagramScreenshot('T22-apex-chart-kilograms-monthly.png');
    await diagramSection.percentageButton.click();
    await diagramSection.assertDiagramScreenshot('T22-apex-chart-percentages.png');
    await estimationsSection.tableViewButton.click();
    await tableSection.assertPopulatedTableStructure();
    await tableSection.assertCorrectKilogramColumnValues(TestData.t22ExpectedEmissionKilogramsMonthly);
    await estimationsSection.annualViewButton.click();
    await tableSection.assertCorrectKilogramColumnValues(TestData.t22ExpectedEmissionKilogramsAnnual);
    await tableSection.assertCorrectPercentageColumnValues(TestData.t22ExpectedEmissionPercentages);
  });
});
