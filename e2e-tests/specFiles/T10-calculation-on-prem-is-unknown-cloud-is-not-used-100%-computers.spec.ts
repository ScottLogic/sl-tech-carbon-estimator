// import { test, expect } from './fixtures';
// import { assertAllSectionElementsAreVisible } from './test-helpers';
// import * as TestData from './test-data';

// test('T10 verify calculated values are coherent when on-prem is unknown, cloud is not used, and 100% computers', async ({
//   tcsEstimator,
//   onPremSection,
//   cloudServicesSection,
//   customersSection,
//   estimationsSection,
//   tableSection,
//   diagramSection,
//   organisationSection,
// }) => {
//   await tcsEstimator.gotoHome();

//   await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, customersSection);

//   await onPremSection.onPremUnknownTickbox.check();
//   await expect(onPremSection.assumptionText).toBeVisible();
//   await expect(onPremSection.numberOfServersContainer).toBeVisible();
//   await expect(onPremSection.numberOfServersContainer).toBeDisabled();
//   await onPremSection.selectLocationOfServers('GBR');
//   await onPremSection.selectLocationOfServers('WORLD');

//   await cloudServicesSection.cloudUnusedTickbox.check();
//   await expect(cloudServicesSection.cloudUnusedTickbox).toBeChecked();
//   await expect(cloudServicesSection.percentageSplitQuestion).not.toBeVisible();

//   await customersSection.setCustomersLocation('in the UK');
//   await customersSection.setMonthlyActiveUsers('1000');
//   await customersSection.percentageSlider.click();
//   await customersSection.percentageSliderSet('ArrowLeft', 10);
//   await customersSection.setPrimaryPurpose('average');

//   await tcsEstimator.calculateButton.click();
//   await diagramSection.assertDiagramScreenshot('T10-apex-chart-kilograms-annual.png');
//   await estimationsSection.monthlyViewButton.click();
//   await diagramSection.assertDiagramScreenshot('T10-apex-chart-kilograms-monthly.png');
//   await diagramSection.percentageButton.click();
//   await diagramSection.assertDiagramScreenshot('T10-apex-chart-percentages.png');
//   await estimationsSection.tableViewButton.click();

//   await tableSection.assertCorrectKilogramColumnValues(TestData.t10ExpectedEmissionKilogramsMonthly);
//   await estimationsSection.annualViewButton.click();
//   await tableSection.assertCorrectKilogramColumnValues(TestData.t10ExpectedEmissionKilogramsAnnual);
//   await tableSection.assertCorrectPercentageColumnValues(TestData.t10ExpectedEmissionPercentages);
// });
