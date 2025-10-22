import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T9 verify calculated values are coherent when on-prem is known and cloud is not used', async ({
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  customersSection,
  estimationsSection,
  tableSection,
  diagramSection,
  organisationSection,
}) => {
  await tcsEstimator.gotoHome();

  await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, customersSection);

  await onPremSection.selectLocationOfServers('GBR');
  await onPremSection.selectLocationOfServers('WORLD');

  await cloudServicesSection.cloudUnusedTickbox.check();
  await expect(cloudServicesSection.cloudUnusedTickbox).toBeChecked();
  await expect(cloudServicesSection.percentageSplitQuestion).not.toBeVisible();

  await customersSection.setCustomersLocation('Globally');
  await customersSection.setPrimaryPurpose('socialMedia');
  await customersSection.setPrimaryPurpose('average');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T9-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T9-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T9-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();

  const expectedEmissionPercentages = [
    '34%',
    '25%',
    '7%',
    '2%',
    '65%',
    '12%',
    '48%',
    '6%',
    '<1%',
    '<1%',
    '<1%',
    '<1%',
    '100%',
  ];
  const expectedEmissionKilogramsAnnual = [
    ' 18633 kg ',
    ' 13708 kg ',
    ' 3625 kg ',
    ' 1300 kg ',
    ' 35767 kg ',
    ' 6485 kg ',
    ' 26190 kg ',
    ' 3093 kg ',
    ' <1 kg ',
    ' 387 kg ',
    ' 148 kg ',
    ' 239 kg ',
    ' 54787 kg ',
  ];

  const expectedEmissionKilogramsMonthly = [
    ' 1553 kg ',
    ' 1142 kg ',
    ' 302 kg ',
    ' 108 kg ',
    ' 2981 kg ',
    ' 540 kg ',
    ' 2182 kg ',
    ' 258 kg ',
    ' <1 kg ',
    ' 32 kg ',
    ' 12 kg ',
    ' 20 kg ',
    ' 4566 kg ',
  ];
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(expectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(expectedEmissionPercentages);
});
