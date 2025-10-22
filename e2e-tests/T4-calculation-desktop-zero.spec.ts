import { table } from 'console';
import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T4 verify calculated values are coherent when desktop is 0%', async ({
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
  await organisationSection.percentageSliderSet('ArrowLeft', 10);
  await expect(organisationSection.percentageSliderText).toHaveValue('0');

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
  await diagramSection.assertDiagramScreenshot('T4-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T4-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T4-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  const expectedEmissionPercentages = [
    '32%',
    '23%',
    '7%',
    '3%',
    '66%',
    '8%',
    '51%',
    '6%',
    '1%',
    '1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilogramsAnnual = [
    ' 16508 kg ',
    ' 11583 kg ',
    ' 3625 kg ',
    ' 1300 kg ',
    ' 33374 kg ',
    ' 4091 kg ',
    ' 26190 kg ',
    ' 3093 kg ',
    ' 621 kg ',
    ' 621 kg ',
    ' 387 kg ',
    ' 148 kg ',
    ' 239 kg ',
    ' 50890 kg ',
  ];

  const expectedEmissionKilogramsMonthly = [
    ' 1376 kg ',
    ' 965 kg ',
    ' 302 kg ',
    ' 108 kg ',
    ' 2781 kg ',
    ' 341 kg ',
    ' 2182 kg ',
    ' 258 kg ',
    ' 52 kg ',
    ' 52 kg ',
    ' 32 kg ',
    ' 12 kg ',
    ' 20 kg ',
    ' 4241 kg ',
  ];

  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
