import type { Page, Locator } from '@playwright/test';

export class TcsEstimator {
  readonly baseURL: string;
  readonly calculateButton: Locator;
  readonly serversCalculationError: Locator;
  readonly monthlyUsersCalculationError: Locator;
  readonly employeesCalculationError: Locator;

  constructor(public readonly page: Page) {
    this.baseURL = '/';
    this.calculateButton = page.getByRole('button', { name: 'Calculate' });
    this.serversCalculationError = page.getByRole('link', { name: 'The number of servers must be' });
    this.monthlyUsersCalculationError = page.getByRole('link', { name: 'The number of monthly active' });
    this.employeesCalculationError = page.getByRole('link', { name: 'The number of employees must be' });
  }

  async gotoHome() {
    await this.page.goto(this.baseURL);
  }
}
