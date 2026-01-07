import { test } from '../utilities/fixtures';
import * as TestData from '../utilities/test-data';

// Input values for test case
const input_values = {
  employees: '100',
  hardware_percentage: '50',
  employees_location: 'Globally',
  unknown_servers: false,
  number_of_servers: '10',
  server_location: 'Globally',
  no_cloud: false,
  cloud_location: 'WORLD',
  monthly_cloud_cost: '0: Object',
  uses_m365: true,
  m365_users: '100',
  no_downstream: false,
  downstream_type: 'average',
  downstream_location: 'Globally',
  downstream_users: '100',
  downstream_mobile_percentage: '50',
};

test('T2 verify calculated values are coherent with selected options', async ({
  allSections,
  tcsEstimator,
  estimationsSection,
  tableSection,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();
  await allSections.assertAllSectionElementsAreVisible();
  await allSections.fillAllSections(input_values);
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T2-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T2-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T2-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t2ExpectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t2ExpectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t2ExpectedEmissionPercentages);
});
