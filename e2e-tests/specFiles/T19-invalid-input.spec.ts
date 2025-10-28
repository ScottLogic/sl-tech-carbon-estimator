import { test, expect } from '../utilities/fixtures';
import { assertAllSectionElementsAreVisible } from '../utilities/test-helpers';

test.describe('Assert errors based on input value', () => {
  test.beforeEach(
    async ({
      tcsEstimator,
      organisationSection,
      onPremSection,
      cloudServicesSection,
      customersSection,
      estimationsSection,
    }) => {
      await tcsEstimator.gotoHome();
      await assertAllSectionElementsAreVisible(
        organisationSection,
        onPremSection,
        cloudServicesSection,
        customersSection
      );
      await estimationsSection.assertResultsElementVisibility();
    }
  );
  test('Assert error when number of servers is -1', async ({ tcsEstimator, onPremSection }) => {
    await onPremSection.selectNumberOfServers('-1');
    await expect(onPremSection.numberOfServersError).toBeVisible();
    await tcsEstimator.calculateButton.click();
    await expect(tcsEstimator.serversCalculationError).toBeVisible();
  });

  test('Assert no Error when number of servers is 0', async ({ tcsEstimator, onPremSection }) => {
    await onPremSection.selectNumberOfServers('0');
    await expect(onPremSection.numberOfServersError).not.toBeVisible();
    await tcsEstimator.calculateButton.click();
    await expect(tcsEstimator.serversCalculationError).not.toBeVisible();
  });

  test('Assert error when number of employees is 0 ', async ({
    tcsEstimator,

    organisationSection,
  }) => {
    await organisationSection.selectNumberOfEmployess('0');
    await expect(organisationSection.headCountError).toBeVisible();
    await tcsEstimator.calculateButton.click();
    await expect(organisationSection.employeesCalculationError).toBeVisible();
  });

  test('Assert error when number of employees is -1 ', async ({
    tcsEstimator,

    organisationSection,
  }) => {
    await organisationSection.selectNumberOfEmployess('-1');
    await expect(organisationSection.headCountError).toBeVisible();
    await tcsEstimator.calculateButton.click();
    await expect(organisationSection.employeesCalculationError).toBeVisible();
  });

  test('Assert no error when number of employees is 1 ', async ({
    tcsEstimator,

    organisationSection,
  }) => {
    await organisationSection.selectNumberOfEmployess('1');
    await expect(organisationSection.headCountError).not.toBeVisible();
    await tcsEstimator.calculateButton.click();
    await expect(organisationSection.employeesCalculationError).not.toBeVisible();
  });

  test('Assert error when number of users is 0 ', async ({
    tcsEstimator,

    customersSection,
  }) => {
    await customersSection.setMonthlyActiveUsers('0');
    await expect(customersSection.monthlyActiveUsersError).toBeVisible();
    await tcsEstimator.calculateButton.click();
    await expect(tcsEstimator.monthlyUsersCalculationError).toBeVisible();
  });

  test('Assert error when number of users is -1 ', async ({ tcsEstimator, customersSection }) => {
    await customersSection.setMonthlyActiveUsers('-1');
    await expect(customersSection.monthlyActiveUsersError).toBeVisible();
    await tcsEstimator.calculateButton.click();
    await expect(tcsEstimator.monthlyUsersCalculationError).toBeVisible();
  });

  test('Assert no error when number of users is 1 ', async ({ tcsEstimator, customersSection }) => {
    await customersSection.setMonthlyActiveUsers('1');
    await expect(customersSection.monthlyActiveUsersError).not.toBeVisible();
    await tcsEstimator.calculateButton.click();
    await expect(tcsEstimator.monthlyUsersCalculationError).not.toBeVisible();
  });
});
