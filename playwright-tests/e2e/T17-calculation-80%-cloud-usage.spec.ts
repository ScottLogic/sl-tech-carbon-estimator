import { test, expect } from '../utilities/fixtures';
import { assertAllSectionElementsAreVisible } from '../utilities/test-helpers';

test('T17 calculations show 80% cloud usage', async ({
  organisationSection,
  page,
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  customersSection,
  diagramSection,
  estimationsSection,
}) => {
  await tcsEstimator.gotoHome();
  await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, customersSection);

  await organisationSection.selectNumberOfEmployess('1000');
  await expect(organisationSection.percentageSliderText).toBeVisible();

  await page.getByLabel('Number of Servers:').click();
  await onPremSection.selectNumberOfServers('10');
  await onPremSection.selectLocationOfServers('WORLD');

  await page.getByText('On-premise 50%').click();
  await cloudServicesSection.setCloudLocation('in the UK');
  await cloudServicesSection.setMonthlyCloudBill('10: Object');

  await customersSection.setCustomersLocation('in the UK');
  await customersSection.setMonthlyActiveUsers('100');
  await customersSection.setPrimaryPurpose('streaming');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T17-apex-chart-kilograms-annual.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T17-apex-chart-kilograms-monthly.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T17-apex-chart-percentages.png');
});
