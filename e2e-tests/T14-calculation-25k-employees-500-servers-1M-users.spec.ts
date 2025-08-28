import { test, expect } from './fixtures';
import {
  assertAllSectionElementsAreVisible,
  assertColumnShowsCorrectValues,
  assertTableShowsCorrectCells,
} from './test-helpers';

test('T14 verify calculated values are coherent with selected employees, servers and users', async ({
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

  await organisationSection.selectNumberOfEmployess('25000');
  await organisationSection.sliderPercentageSet('ArrowRight', 6);
  await expect(organisationSection.percentageSliderText).toHaveValue('80');

  await onPremSection.selectNumberOfServers('500');
  await expect(onPremSection.locationOfServersField).toHaveValue('WORLD');

  await cloudServicesSection.percentageSliderSet('ArrowLeft', 1);
  await expect(cloudServicesSection.percentageSlider).toHaveValue('45');
  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setCloudLocation('WORLD');
  await expect(cloudServicesSection.monthlyCloudBill).toHaveValue('0: Object');

  // Users
  await endUsersSection.setEndUserLocation('in North America');
  await endUsersSection.setMonthlyActiveUsers('10000000');
  await endUsersSection.percentageSplitSliderSet('ArrowRight', 6);
  await expect(endUsersSection.percentageSplitSlider).toHaveValue('80');
  await await expect(endUsersSection.primaryPurposeQuestion).toBeVisible();
  await endUsersSection.setPrimaryPurpose('streaming');

  // Calculate
  await tcsEstimator.calculateButton.click();
  await estimationsSection.assertDiagramScreenshot('T14-apex-chart-kilograms.png');
  await estimationsSection.percentageButton.click();
  await estimationsSection.assertDiagramScreenshot('T14-apex-chart-percentages.png');
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
  const expectedEmissionKilograms = [
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
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
