import { test, expect } from '../utilities/fixtures';
import { assertAllSectionElementsAreVisible } from '../test-helpers';

test('T16 assert text for assumptions and limitations', async ({
  page,
  organisationSection,
  onPremSection,
  customersSection,
  cloudServicesSection,
  tcsEstimator,
}) => {
  await tcsEstimator.gotoHome();
  await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, customersSection);

  await page.getByRole('tab', { name: 'Assumptions and limitations' }).click();
  await expect(page.getByRole('heading', { name: 'Assumptions and Limitations' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Estimation Input' })).toBeVisible();
  await expect(page.getByText('The Technology Carbon Estimator tool is designed to')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Assumptions', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Time period' })).toBeVisible();
  await expect(page.getByText('The estimation is based on a')).toBeVisible();
  await expect(page.getByText('Desktops, Laptops and')).toBeVisible();
  await expect(page.getByText('Servers and Networking')).toBeVisible();
  await expect(page.getByText('Obviously, this may not match')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Number of Employee Devices' })).toBeVisible();
  await expect(
    page.getByText('Without a specified number of devices, we estimate based on the number of')
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Number of Servers' })).toBeVisible();
  await expect(
    page.getByText('Without a specified number of servers, we give an initial estimate based on the')
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Number of Networking Devices' })).toBeVisible();
  await expect(page.getByText('At present, we estimate a')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Power consumption' })).toBeVisible();
  await expect(
    page.getByText('Each class of device is given an average power demand, based on data compiled')
  ).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Device Type' }).first()).toBeVisible();
  await expect(page.getByText('In the case of servers and')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Carbon Intensity' })).toBeVisible();
  await expect(page.getByText('We make use of the latest')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'World Location' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Upstream Emissions' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Device Type' }).nth(1)).toBeVisible();
  await expect(page.getByText('* The network device figure')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByText('We have derived average')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Figure' })).toBeVisible();
  await expect(page.getByText('Clearly there is a large')).toBeVisible();
  await expect(page.getByText('The estimated kWh of cloud')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Downstream Emissions' })).toBeVisible();
  await expect(page.getByText('At present we focus on the')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Type', exact: true })).toBeVisible();
  await expect(page.getByText('These figures are combined')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Network Data Transfer' })).toBeVisible();
  await expect(page.getByText('Our outgoing network data')).toBeVisible();
  await page.getByRole('heading', { name: 'Customer Devices' }).click();
  await expect(page.getByText('We combine device information')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Limitations', exact: true })).toBeVisible();
  await expect(page.getByText('Here are some aspects of the')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Upstream Emissions' }).nth(1)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Off the Shelf Software' })).toBeVisible();
  await expect(page.getByText('This is a tough area to')).toBeVisible();
  await expect(page.getByText('Without this kind of detailed')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Operational Emissions - Direct' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Generators' })).toBeVisible();
  await expect(page.getByText('In the interests of using')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Operational Emissions - Indirect' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'SaaS' })).toBeVisible();
  await expect(page.getByText('Like Off the shelf and open')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Managed Services' })).toBeVisible();
  await expect(page.getByText('We currently do not make a')).toBeVisible();
  await page.getByRole('tab', { name: 'Estimation Input' }).click();
  await expect(page.getByRole('heading', { name: 'Technology Carbon Estimator' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Organisation' })).toBeVisible();
});
