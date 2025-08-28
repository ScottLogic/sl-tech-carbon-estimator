import { test, expect } from './fixtures';
import {
  assertAllSectionElementsAreVisible,
  assertTableShowsCorrectCells,
  assertColumnShowsCorrectValues,
} from './test-helpers';

test('T13 verify calculated values are coherent with selected employees, servers and users', async ({
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
  await organisationSection.selectNumberOfEmployess('500');
  await organisationSection.sliderPercentageSet('ArrowLeft', 4);
  await expect(organisationSection.percentageSliderText).toHaveValue('30');

  await onPremSection.selectNumberOfServers('100');

  await cloudServicesSection.cloudUnusedTickbox.check();
  await expect(cloudServicesSection.cloudUnusedTickbox).toBeChecked();
  await expect(cloudServicesSection.percentageSplitQuestion).not.toBeVisible();

  await endUsersSection.setEndUserLocation('in the UK');
  await endUsersSection.setMonthlyActiveUsers('3333');
  await endUsersSection.percentageSplitSliderSet('ArrowLeft', 1);
  await endUsersSection.percentageSplitSliderSet('ArrowRight', 10);
  // await expect(endUsersSection.percentageSplitSlider).toHaveValue('95');
  await endUsersSection.setPrimaryPurpose('information');

  await tcsEstimator.calculateButton.click();
  await estimationsSection.assertDiagramScreenshot('T13-apex-chart-kilograms.png');
  await estimationsSection.percentageButton.click();
  await estimationsSection.assertDiagramScreenshot('T13-apex-chart-percentages.png');
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
  const expectedEmissionKilograms = [
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
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);

  await estimationsSection.diagramViewButton.click();
  await cloudServicesSection.cloudUnusedTickbox.uncheck();
  await expect(cloudServicesSection.serverLocation).toBeVisible();
  await cloudServicesSection.setCloudLocation('Globally');
  await cloudServicesSection.setCloudLocation("I don't know");

  await tcsEstimator.calculateButton.click();
  await estimationsSection.percentageButton.click();
  await estimationsSection.assertDiagramScreenshot('T13-apex-chart-1.png');
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
  const expectedEmissionKilograms1 = [
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
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms1);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages1);
});
