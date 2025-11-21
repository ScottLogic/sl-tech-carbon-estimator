import type { Page, Locator } from '@playwright/test';

export class TcsEstimator {
  readonly baseURL: string;
  readonly calculateButton: Locator;
  readonly resetButton: Locator;
  readonly serversCalculationError: Locator;
  readonly monthlyUsersCalculationError: Locator;
  readonly employeesCalculationError: Locator;
  readonly assumptionsAndLimitationsTab: Locator;
  readonly estimationInputsTab: Locator;

  constructor(public readonly page: Page) {
    this.baseURL = '/';
    this.calculateButton = page.getByRole('button', { name: 'Calculate' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.serversCalculationError = page.getByRole('link', { name: 'The number of servers must be' });
    this.monthlyUsersCalculationError = page.getByRole('link', { name: 'The number of monthly active' });
    this.employeesCalculationError = page.getByRole('link', { name: 'The number of employees must be' });
    this.assumptionsAndLimitationsTab = page.getByRole('tab', { name: 'Assumptions and Limitations' });
    this.estimationInputsTab = page.getByRole('tab', { name: 'Estimation Inputs' });
  }

  async gotoHome() {
    await this.page.goto(this.baseURL);
  }
}
