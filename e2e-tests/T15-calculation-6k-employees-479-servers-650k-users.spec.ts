import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T15 verify calculated values are coherent with selected employees, servers and users', async ({
  organisationSection,
  page,
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  endUsersSection,
  estimationsSection,
  tableSection,
}) => {
  await tcsEstimator.gotoHome();
  await assertAllSectionElementsAreVisible(page);

  await organisationSection.selectNumberOfEmployess('6000');
  await organisationSection.sliderPercentageSet('ArrowRight', 6);
  await expect(organisationSection.percentageSlider).toHaveValue('80');

  await onPremSection.selectNumberOfServers('479');
  await onPremSection.selectLocationOfServers('Globally');

  await cloudServicesSection.percentageSliderSet('ArrowLeft', 1);
  await cloudServicesSection.percentageSlider.fill('50');
  await cloudServicesSection.percentageSliderSet('ArrowRight', 6);
  await expect(cloudServicesSection.percentageSlider).toHaveValue('80');
  await expect(cloudServicesSection.serverLocation).toHaveValue('WORLD');
  await cloudServicesSection.setMonthlyCloudBill('7: Object');

  await endUsersSection.setEndUserLocation('in Europe');
  await endUsersSection.setMonthlyActiveUsers('650000');
  await endUsersSection.percentageSplitSliderSet('ArrowLeft', 1);
  await expect(endUsersSection.percentageSplitSlider).toHaveValue('45');
  await expect(endUsersSection.primaryPurposeQuestion).toBeVisible();
  await endUsersSection.setPrimaryPurpose('eCommerce');

  await tcsEstimator.calculateButton.click();
  await estimationsSection.assertDiagramScreenshot('T15-apex-chart-kilograms.png');
  await estimationsSection.percentageButton.click();
  await estimationsSection.assertDiagramScreenshot('T15-apex-chart-percentages.png');
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
