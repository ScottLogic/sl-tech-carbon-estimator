import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T15 verify calculated values are coherent with selected employees, servers and users', async ({
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

  await organisationSection.selectNumberOfEmployess('6000');
  await organisationSection.percentageSlider.click();
  await organisationSection.percentageSliderSet('ArrowRight', 6);
  await expect(organisationSection.percentageSlider).toHaveValue('80');

  await onPremSection.selectNumberOfServers('479');
  await onPremSection.selectLocationOfServers('Globally');

  await cloudServicesSection.percentageSlider.click();
  await cloudServicesSection.percentageSliderSet('ArrowLeft', 1);
  await cloudServicesSection.percentageSlider.fill('50');
  await cloudServicesSection.percentageSliderSet('ArrowRight', 6);
  await expect(cloudServicesSection.percentageSlider).toHaveValue('80');
  await expect(cloudServicesSection.serverLocation).toHaveValue('WORLD');
  await cloudServicesSection.setMonthlyCloudBill('7: Object');

  await customersSection.setCustomersLocation('in Europe');
  await customersSection.setMonthlyActiveUsers('650000');
  await customersSection.percentageSlider.click();
  await customersSection.percentageSliderSet('ArrowLeft', 1);
  await expect(customersSection.percentageSlider).toHaveValue('45');
  await expect(customersSection.primaryPurposeQuestion).toBeVisible();
  await customersSection.setPrimaryPurpose('eCommerce');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T15-apex-chart-kilograms.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T15-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();

  const expectedEmissionPercentages = [
    '35%',
    '28%',
    '5%',
    '2%',
    '58%',
    '15%',
    '39%',
    '5%',
    '6%',
    '6%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 1138450 kg ',
    ' 899000 kg ',
    ' 173638 kg ',
    ' 65813 kg ',
    ' 1882009 kg ',
    ' 475245 kg ',
    ' 1254480 kg ',
    ' 152284 kg ',
    ' 186262 kg ',
    ' 186262 kg ',
    ' 10717 kg ',
    ' 6555 kg ',
    ' 4162 kg ',
    ' 3217438 kg ',
  ];
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
