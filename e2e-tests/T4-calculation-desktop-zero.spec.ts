import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T4 verify calculated values are coherent when desktop is 0%', async ({
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

  await organisationSection.sliderPercentageSet('ArrowLeft', 10);
  await expect(organisationSection.percentageSliderText).toHaveValue('0');

  await onPremSection.selectLocationOfServers('GBR');
  await onPremSection.selectLocationOfServers('Globally');

  await cloudServicesSection.percentageSliderSet('ArrowLeft', 1);
  await expect(cloudServicesSection.percentageSlider).toHaveValue('45');
  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setCloudLocation('WORLD');

  await endUsersSection.setPrimaryPurpose('information');
  await endUsersSection.setPrimaryPurpose('average');

  await tcsEstimator.calculateButton.click();
  await estimationsSection.assertDiagramScreenshot('T4-apex-chart-kilograms.png');
  await estimationsSection.percentageButton.click();
  await estimationsSection.assertDiagramScreenshot('T4-apex-chart-percentages.png');
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
  const expectedEmissionKilograms = [
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
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
