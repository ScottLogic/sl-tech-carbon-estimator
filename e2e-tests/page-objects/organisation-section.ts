import type { Page, Locator } from '@playwright/test';

export class OrganisationSection {
  public readonly selectEmployees: Locator;

  constructor(public readonly page: Page) {
    this.selectEmployees = this.page.getByLabel('How many employees are in the');
  }

  async selectNumberOfEmployess(text: string) {
    await this.selectEmployees.click();
    await this.selectEmployees.fill(text);
  }
}

