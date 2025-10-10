import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T12 verify calculated values are coherent with selected employees, servers and users', async ({
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

  await organisationSection.selectNumberOfEmployess('10');
  await organisationSection.percentageSlider.click();
  await organisationSection.percentageSliderSet('ArrowLeft', 10);

  await onPremSection.selectNumberOfServers('5');
  await onPremSection.selectLocationOfServers('in the UK');

  await cloudServicesSection.cloudUnusedTickbox.check();
  await expect(cloudServicesSection.cloudUnusedTickbox).toBeChecked();
  await expect(cloudServicesSection.percentageSplitQuestion).not.toBeVisible();

  await customersSection.setCustomersLocation('in the UK');
  await customersSection.setMonthlyActiveUsers('5000');
  await customersSection.percentageSlider.click();
  await customersSection.percentageSliderSet('ArrowLeft', 1);
  await customersSection.percentageSliderSet('ArrowRight', 5);
  await expect(customersSection.percentageSlider).toHaveValue('70');
  await customersSection.setPrimaryPurpose('eCommerce');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T12-apex-chart-kilograms.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T12-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();

  const expectedEmissionPercentages = [
    '32%',
    '11%',
    '18%',
    '3%',
    '67%',
    '4%',
    '57%',
    '6%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilograms = [
    ' 3296 kg ',
    ' 1158 kg ',
    ' 1813 kg ',
    ' 325 kg ',
    ' 6861 kg ',
    ' 409 kg ',
    ' 5838 kg ',
    ' 614 kg ',
    ' <1 kg ',
    ' 45 kg ',
    ' 21 kg ',
    ' 24 kg ',
    ' 10202 kg ',
  ];
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilograms);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
