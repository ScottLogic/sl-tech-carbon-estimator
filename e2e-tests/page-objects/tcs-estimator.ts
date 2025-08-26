import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { OrganisationSection } from './organisation-section';

export class TcsEstimator {
  readonly baseURL: string;
  readonly calculateButton: Locator;

  constructor(public readonly page: Page) {
    this.baseURL = '/';
    this.calculateButton = page.getByRole('button', { name: 'Calculate' });
  }

  async gotoHome() {
    await this.page.goto(this.baseURL);
  }

}
