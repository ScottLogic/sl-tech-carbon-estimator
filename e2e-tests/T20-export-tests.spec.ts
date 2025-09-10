import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';
import * as fs from 'fs';

test('T20', async ({
  organisationSection,
  page,
  tcsEstimator,
  onPremSection,
  cloudServicesSection,
  endUsersSection,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();
  await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, endUsersSection);

  await organisationSection.selectNumberOfEmployess('1000');
  await expect(organisationSection.percentageSliderText).toBeVisible();

  await page.getByLabel('Number of Servers:').click();
  await onPremSection.selectNumberOfServers('10');
  await onPremSection.selectLocationOfServers('WORLD');

  await page.getByText('On-premise 50%').click();
  await cloudServicesSection.setCloudLocation('in the UK');
  await cloudServicesSection.setMonthlyCloudBill('10: Object');

  await endUsersSection.setEndUserLocation('in the UK');
  await endUsersSection.setMonthlyActiveUsers('100');
  await endUsersSection.setPrimaryPurpose('streaming');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T17-apex-chart-kilograms.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T17-apex-chart-percentages.png');

  // await page.getByRole('button', { name: 'Export ▼' }).click();
  // await page.getByRole('link', { name: 'Export JSON', exact: true }).click();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export ▼' }).click(),
    page.getByRole('link', { name: 'Export JSON', exact: true }).click(),
  ]);

  const path = await download.path();
  if (!path) throw new Error('Download failed');

  //reading

  const fileContent = fs.readFileSync(path, 'utf-8');
  const json = JSON.parse(fileContent);

  expect(json.values.version).toEqual('1.0.0');
});
