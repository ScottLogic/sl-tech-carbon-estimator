import { test, expect } from '@playwright/test';

test('T16 assert text for assumptions and limitations', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Carbon Estimator' })).toBeVisible();

  // Organisation
  await page.getByLabel('How many employees are in the').click();
  await page.getByLabel('How many employees are in the').fill('6000');
  await expect(page.getByText('Desktops 50%')).toBeVisible();
  await page.getByLabel('What percentage of those').click();
  for (let i = 0; i < 6; i++) {
    await page.getByLabel('What percentage of those').press('ArrowRight');
  }
  await expect(page.getByText('Desktops 80%')).toBeVisible();
  // On Prem Servers
  await expect(page.getByText('How many on-premise servers')).toBeVisible();
  await page.getByLabel('Number of Servers:').click();
  await page.getByLabel('Number of Servers:').fill('479');
  await expect(page.getByLabel('Where are they primarily')).toHaveValue('WORLD');

  // Cloud
  await expect(page.getByRole('heading', { name: 'Cloud Services' })).toBeVisible();
  await expect(page.getByText('Tell us about your cloud')).toBeVisible();
  await expect(page.getByText("We don't use cloud services")).toBeVisible();
  await expect(page.getByLabel("We don't use cloud services")).not.toBeChecked();
  await page.getByLabel("We don't use cloud services").check();
  await expect(page.getByLabel("We don't use cloud services")).toBeChecked();
  await expect(page.getByText('What percentage of your servers are cloud services vs on-premise?')).not.toBeVisible();
  await expect(page.getByText('What is your monthly cloud')).not.toBeVisible();
  // await page.getByLabel("What is your monthly cloud").not_to_be_visible();

  // Users
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByText('Where are your end-users')).toBeVisible();
  await page.getByLabel('Where are your end-users').selectOption('in Europe');
  await page.getByLabel('How many monthly active users').click();
  await page.getByLabel('How many monthly active users').fill('650000');
  await page.getByLabel('What percentage of your end-users').click();
  await page.getByLabel('What percentage of your end-users').press('ArrowLeft');
  await expect(page.locator('form')).toContainText('Mobile 45%');
  await expect(page.getByText("What's the primary purpose of your")).toBeVisible();
  await page.getByLabel("What's the primary purpose of your").selectOption('eCommerce');
  await page.getByRole('button', { name: 'Calculate' }).click();

  // Not recording calcs in this test. Content is here to check link and content of "Assumptions and limitations" page

  await expect(page.getByRole('tab', { name: 'Assumptions and limitations' })).toBeVisible();
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
  await page.getByRole('heading', { name: 'End-User Devices' }).click();
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
