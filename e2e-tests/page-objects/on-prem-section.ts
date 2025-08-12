import type { Page, Locator } from '@playwright/test';

export class OnPremSection {
  private readonly numberOfServers: Locator;
  private readonly locationOfServers: Locator;

  constructor(public readonly page: Page) {
    this.numberOfServers = this.page.getByLabel('Number of Servers:');
    this.locationOfServers = this.page.getByLabel('Where are they primarily located?', { exact: true });
  }

  async selectNumberOfServers(text: string) {
    await this.numberOfServers.click();
    await this.numberOfServers.fill(text);
  }

  async selectLocationOfServers(text: string) {
    await this.locationOfServers.press('Enter')
    await this.locationOfServers.selectOption(text)
  }
}
