import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

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
  await diagramSection.assertDiagramScreenshot('T13-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T13-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T13-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();

  const expectedEmissionPercentages = [
    '26%',
    '16%',
    '9%',
    '2%',
    '74%',
    '7%',
    '64%',
    '4%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilogramsAnnual = [
    ' 106879 kg ',
    ' 64292 kg ',
    ' 36250 kg ',
    ' 6338 kg ',
    ' 305055 kg ',
    ' 27636 kg ',
    ' 261896 kg ',
    ' 15524 kg ',
    ' <1 kg ',
    ' 1 kg ',
    ' <1 kg ',
    ' <1 kg ',
    ' 411936 kg ',
  ];

  const expectedEmissionKilogramsMonthly = [
    ' 8907 kg ',
    ' 5358 kg ',
    ' 3021 kg ',
    ' 528 kg ',
    ' 25421 kg ',
    ' 2303 kg ',
    ' 21825 kg ',
    ' 1294 kg ',
    ' <1 kg ',
    ' <1 kg ',
    ' <1 kg ',
    ' <1 kg ',
    ' 34328 kg ',
  ];
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);

  await estimationsSection.diagramViewButton.click();
  await cloudServicesSection.cloudUnusedTickbox.uncheck();
  await expect(cloudServicesSection.serverLocation).toBeVisible();
  await cloudServicesSection.setCloudLocation('Globally');
  await cloudServicesSection.setCloudLocation("I don't know");

  await tcsEstimator.calculateButton.click();
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T13-apex-chart-1-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T13-apex-chart-1-monthly.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  const expectedEmissionPercentages1 = [
    '26%',
    '16%',
    '9%',
    '2%',
    '74%',
    '7%',
    '63%',
    '4%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms1Annual = [
    ' 106879 kg ',
    ' 64292 kg ',
    ' 36250 kg ',
    ' 6338 kg ',
    ' 305055 kg ',
    ' 27636 kg ',
    ' 261896 kg ',
    ' 15524 kg ',
    ' 621 kg ',
    ' 621 kg ',
    ' 1 kg ',
    ' <1 kg ',
    ' <1 kg ',
    ' 412557 kg ',
  ];

  const expectedEmissionKilograms1Monthly = [
    ' 8907 kg ',
    ' 5358 kg ',
    ' 3021 kg ',
    ' 528 kg ',
    ' 25421 kg ',
    ' 2303 kg ',
    ' 21825 kg ',
    ' 1294 kg ',
    ' 52 kg ',
    ' 52 kg ',
    ' <1 kg ',
    ' <1 kg ',
    ' <1 kg ',
    ' 34380 kg ',
  ];
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms1Monthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms1Annual);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages1);
});
