import { test, expect } from '../utilities/fixtures';

// Input values for test case
const input_values = {
  employees: '100',
  hardware_percentage: '75',
  employees_location: 'in the UK',
  unknown_servers: false,
  number_of_servers: '10',
  server_location: 'in the UK',
  no_cloud: false,
  cloud_percentage: '50',
  cloud_location: 'in the UK',
  monthly_cloud_cost: '5: Object',
  uses_m365: true,
  m365_users: '1000',
  no_downstream: false,
  downstream_type: 'socialMedia',
  downstream_location: 'Globally',
  downstream_users: '100',
  downstream_mobile_percentage: '25',
};

test('T3 - Verify reset functionality works as expected', async ({
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
  await tcsEstimator.resetButton.click();
  await diagramSection.assertDiagramScreenshot('T3-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T3-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T3-apex-chart-percentages.png');
  await estimationsSection.tableViewButton.click();
  await expect(tableSection.noEstimationsText).toBeVisible();
});
