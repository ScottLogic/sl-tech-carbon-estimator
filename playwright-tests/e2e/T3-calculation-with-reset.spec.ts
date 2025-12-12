import { test, expect } from '../utilities/fixtures';
import { assertAllSectionElementsAreVisible } from '../utilities/test-helpers';

test('T3 - Verify reset functionality works as expected', async ({
  organisationSection,
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  saasSection,
  customersSection,
  estimationsSection,
  tableSection,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();

  await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, customersSection);
  await organisationSection.selectNumberOfEmployess('100');

  await onPremSection.selectNumberOfServers('10');
  await onPremSection.selectLocationOfServers('in the UK');
  await onPremSection.selectLocationOfServers('Globally');

  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setCloudLocation('WORLD');
  await cloudServicesSection.setMonthlyCloudBill('5: Object');

  await customersSection.setPrimaryPurpose('socialMedia');
  await customersSection.setCustomersLocation('GBR');
  await customersSection.setCustomersLocation('WORLD');
  await customersSection.setMonthlyActiveUsers('100');

  await onPremSection.selectLocationOfServers('GBR');
  await onPremSection.selectLocationOfServers('Globally');

  await cloudServicesSection.setMonthlyCloudBill('1: Object');
  await cloudServicesSection.setMonthlyCloudBill('0: Object');

  await saasSection.m365CheckBox.click();
  await saasSection.setM365UsersCount('1000');

  await customersSection.setCustomersLocation('Globally');
  await expect(customersSection.monthlyActiveUsersField).toHaveValue('100');
  await customersSection.setPrimaryPurpose('average');

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
