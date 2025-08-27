import { test, expect } from './fixtures';
import { EndUsersSection } from './page-objects/end-users-section';
import {
  assertAllSectionElementsAreVisible,
  assertTableShowsCorrectCells,
  assertColumnShowsCorrectValues,
} from './test-helpers';

test('T11 verify calculated values are coherent with selected employees, servers and users', async ({
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

  await organisationSection.selectNumberOfEmployess('1000000');
  await organisationSection.sliderPercentageSet('ArrowRight', 10);
  await expect(organisationSection.percentageSliderText).toHaveValue('100');

  await onPremSection.selectNumberOfServers('100');
  await onPremSection.selectLocationOfServers('unknown');

  await cloudServicesSection.percentageSliderSet('ArrowLeft', 7);
  await expect(cloudServicesSection.percentageSlider).toHaveValue('15');
  await cloudServicesSection.setMonthlyCloudBill('4: Object');

  // Users
  await endUsersSection.setEndUserLocation('Globally');
  await page.getByLabel('How many monthly active users').click();
  await endUsersSection.setMonthlyActiveUsers('800000');
  await endUsersSection.percentageSplitSliderSet('ArrowLeft', 7);
  await expect(endUsersSection.percentageSplitSlider).toHaveValue('15');
  await endUsersSection.setPrimaryPurpose('socialMedia');

  await tcsEstimator.calculateButton.click();
  await estimationsSection.assertDiagramScreenshot('T11-apex-chart-kilograms.png');
  await estimationsSection.percentageButton.click();
  await estimationsSection.assertDiagramScreenshot('T11-apex-chart-percentages.png');
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
