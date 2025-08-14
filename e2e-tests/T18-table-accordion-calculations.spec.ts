import { test, expect } from '@playwright/test';
import {
  gotoHome,
  assertAllSectionElementsAreVisible,
  assertDefaultTableStructure,
  assertColumnShowsCorrectValues,
} from './test-helpers';

test.describe('Table Accordion Calculations', async () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await assertAllSectionElementsAreVisible(page);
    await page.getByRole('tab', { name: 'Table' }).click();
    await assertDefaultTableStructure(page);
  });
  test('Table shows expected values (no checkboxes)', async ({ page }) => {
    await page.getByRole('button', { name: 'Calculate' }).click();

    const expectedEmissions = [
      '34%',
      '25%',
      '7%',
      '2%',
      '65%',
      '12%',
      '47%',
      '6%',
      '1%',
      '1%',
      '<1%',
      '<1%',
      '<1%',
      '100%',
    ];
    await assertColumnShowsCorrectValues(page, '3', expectedEmissions);
  });
  test('Table shows expected values (On-Premise is unknown)', async ({ page }) => {
    await page.getByRole('tab', { name: 'Table' }).click();
    await page.getByLabel("I don't know").check();
    await page.getByRole('button', { name: 'Calculate' }).click();

    const expectedEmissionsOnPremiseUnknownArray = [
      '42%',
      '34%',
      '4%',
      '3%',
      '56%',
      '16%',
      '32%',
      '8%',
      '2%',
      '2%',
      '<1%',
      '<1%',
      '<1%',
      '100%',
    ];
    await assertColumnShowsCorrectValues(page, '3', expectedEmissionsOnPremiseUnknownArray);
  });
  test('Table shows expected values (Cloud services not used)', async ({ page }) => {
    await page.getByLabel("We don't use cloud services").check();
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('gridcell', { name: 'Cloud Services', exact: true })).not.toBeVisible();

    const expectedEmissionsCloudNotUsedArray = [
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
    await assertColumnShowsCorrectValues(page, '3', expectedEmissionsCloudNotUsedArray);
  });
  test('Table shows expected values (No external users)', async ({ page }) => {
    await page.getByRole('checkbox', { name: "We don't have any external" }).check();
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByRole('gridcell', { name: 'End-User Devices', exact: true })).not.toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'Network Data Transfer', exact: true })).not.toBeVisible();

    const expectedEmissionsNoExternalUsersArray = [
      '34%',
      '25%',
      '7%',
      '2%',
      '65%',
      '12%',
      '48%',
      '6%',
      '1%',
      '1%',
      '<1%',
      '100%',
    ];
    await assertColumnShowsCorrectValues(page, '3', expectedEmissionsNoExternalUsersArray);
  });
});
