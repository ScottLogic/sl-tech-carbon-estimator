import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T5 verify calculated values are coherent when laptop is 0%', async ({
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
  await organisationSection.percentageSlider.click();
  await organisationSection.percentageSliderSet('ArrowRight', 10);
  await expect(organisationSection.percentageSliderText).toHaveValue('100');

  await onPremSection.selectLocationOfServers('GBR');
  await onPremSection.selectLocationOfServers('Globally');

  await cloudServicesSection.percentageSlider.click();
  await cloudServicesSection.percentageSliderSet('ArrowLeft', 1);
  await expect(cloudServicesSection.percentageSlider).toHaveValue('45');
  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setCloudLocation('WORLD');

  await customersSection.setPrimaryPurpose('information');
  await customersSection.setPrimaryPurpose('average');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T5-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T5-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T5-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  const expectedEmissionPercentages = [
    '35%',
    '26%',
    '6%',
    '2%',
    '64%',
    '15%',
    '44%',
    '5%',
    '1%',
    '1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilogramsAnnual = [
    ' 20758 kg ',
    ' 15833 kg ',
    ' 3625 kg ',
    ' 1300 kg ',
    ' 38161 kg ',
    ' 8878 kg ',
    ' 26190 kg ',
    ' 3093 kg ',
    ' 621 kg ',
    ' 621 kg ',
    ' 387 kg ',
    ' 148 kg ',
    ' 239 kg ',
    ' 59927 kg ',
  ];

  const expectedEmissionKilogramsMonthly = [
    ' 1730 kg ',
    ' 1319 kg ',
    ' 302 kg ',
    ' 108 kg ',
    ' 3180 kg ',
    ' 740 kg ',
    ' 2182 kg ',
    ' 258 kg ',
    ' 52 kg ',
    ' 52 kg ',
    ' 32 kg ',
    ' 12 kg ',
    ' 20 kg ',
    ' 4994 kg ',
  ];
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
