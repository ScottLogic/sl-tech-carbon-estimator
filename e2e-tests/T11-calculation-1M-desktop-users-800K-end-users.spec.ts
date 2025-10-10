import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

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
  await diagramSection.assertDiagramScreenshot('T11-apex-chart-kilograms.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T11-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  const expectedEmissionPercentages = [
    '59%',
    '55%',
    '<1%',
    '4%',
    '39%',
    '31%',
    '<1%',
    '8%',
    '<1%',
    '<1%',
    '2%',
    '1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 168526971 kg ',
    ' 158333333 kg ',
    ' 36250 kg ',
    ' 10157388 kg ',
    ' 111580461 kg ',
    ' 88782024 kg ',
    ' 261896 kg ',
    ' 22536541 kg ',
    ' 18626 kg ',
    ' 18626 kg ',
    ' 5631418 kg ',
    ' 3342687 kg ',
    ' 2288731 kg ',
    ' 285757476 kg ',
  ];
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
