import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T14 verify calculated values are coherent with selected employees, servers and users', async ({
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

  await organisationSection.selectNumberOfEmployess('25000');
  await organisationSection.percentageSlider.click();
  await organisationSection.percentageSliderSet('ArrowRight', 6);
  await expect(organisationSection.percentageSliderText).toHaveValue('80');

  await onPremSection.selectNumberOfServers('500');
  await expect(onPremSection.locationOfServersField).toHaveValue('WORLD');

  await cloudServicesSection.percentageSliderSet('ArrowLeft', 1);
  await expect(cloudServicesSection.percentageSlider).toHaveValue('45');
  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setCloudLocation('WORLD');
  await expect(cloudServicesSection.monthlyCloudBill).toHaveValue('0: Object');

  await customersSection.setCustomersLocation('in North America');
  await customersSection.setMonthlyActiveUsers('10000000');
  await customersSection.percentageSlider.click();
  await customersSection.percentageSliderSet('ArrowRight', 6);
  await expect(customersSection.percentageSlider).toHaveValue('80');
  await await expect(customersSection.primaryPurposeQuestion).toBeVisible();
  await customersSection.setPrimaryPurpose('streaming');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T14-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T14-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T14-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  const expectedEmissionPercentages = [
    '6%',
    '5%',
    '<1%',
    '<1%',
    '6%',
    '3%',
    '2%',
    '<1%',
    '<1%',
    '<1%',
    '88%',
    '16%',
    '73%',
    '100%',
  ];
  const expectedEmissionKilogramsAnnual = [
    ' 4186271 kg ',
    ' 3745833 kg ',
    ' 181250 kg ',
    ' 259188 kg ',
    ' 3871387 kg ',
    ' 1980187 kg ',
    ' 1309478 kg ',
    ' 581722 kg ',
    ' 621 kg ',
    ' 621 kg ',
    ' 61357707 kg ',
    ' 10817286 kg ',
    ' 50540421 kg ',
    ' 69415986 kg ',
  ];
  const expectedEmissionKilogramsMonthly = [
    ' 348856 kg ',
    ' 312153 kg ',
    ' 15104 kg ',
    ' 21599 kg ',
    ' 322616 kg ',
    ' 165016 kg ',
    ' 109123 kg ',
    ' 48477 kg ',
    ' 52 kg ',
    ' 52 kg ',
    ' 5113142 kg ',
    ' 901441 kg ',
    ' 4211702 kg ',
    ' 5784666 kg ',
  ];
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
