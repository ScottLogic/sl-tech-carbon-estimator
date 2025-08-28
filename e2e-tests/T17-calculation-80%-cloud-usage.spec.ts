import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';

test('T17 calculations show 80% cloud usage', async ({
  organisationSection,
  page,
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  endUsersSection,
  estimationsSection,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();
  await assertAllSectionElementsAreVisible(page);

  await organisationSection.selectNumberOfEmployess('1000');
  await expect(organisationSection.percentageSliderText).toBeVisible();

  await page.getByLabel('Number of Servers:').click();
  await onPremSection.selectNumberOfServers('10');
  await onPremSection.selectLocationOfServers('WORLD');

  await page.getByText('On-premise 50%').click();
  await cloudServicesSection.setCloudLocation('in the UK');
  await cloudServicesSection.setMonthlyCloudBill('10: Object'); // $1m-$2m

  await endUsersSection.setEndUserLocation('in the UK');
  await endUsersSection.setMonthlyActiveUsers('100');
  await endUsersSection.setPrimaryPurpose('streaming');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T17-apex-chart-kilograms.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T17-apex-chart-percentages.png');
});
