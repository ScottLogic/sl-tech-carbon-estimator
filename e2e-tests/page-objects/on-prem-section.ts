import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
export class OnPremSection {
  private readonly numberOfServers: Locator;
  private readonly locationOfServers: Locator;
  public readonly onPremHeading: Locator;
  public readonly onPremSectionInfo: Locator;
  public readonly onPremiseTickbox: Locator;
  public readonly serverLocationText: Locator;
  public readonly serverLocationTextExpansion: Locator;
  public readonly serversUnknownLabel: Locator;

  constructor(public readonly page: Page) {
    this.numberOfServers = page.getByLabel('Number of Servers:');
    this.locationOfServers = page.getByLabel('Where are they primarily located?', { exact: true });
    this.onPremHeading = page.getByRole('heading', { name: 'On-Premise Servers' });
    this.onPremSectionInfo = page.getByText('How many on-premise servers');
    this.onPremiseTickbox = page.getByRole('checkbox', { name: "I don't know" });
    this.serverLocationText = page.getByText('Where are they primarily located? expand_more');
    this.serverLocationTextExpansion = page.getByText('Where are they primarily located?');
    this.serversUnknownLabel = page.locator('label').filter({ hasText: "I don't know" });
  }

  async assertOnPremiseSectionVisible() {
    await expect(this.onPremHeading).toBeVisible();
    await expect(this.onPremSectionInfo).toBeVisible();
    await expect(this.numberOfServers).toHaveValue('10');
    await expect(this.onPremiseTickbox).toBeVisible();
    await expect(this.serversUnknownLabel).toBeVisible();
    await expect(this.locationOfServers).toBeVisible();
  }

  async selectNumberOfServers(text: string) {
    await this.numberOfServers.click();
    await this.numberOfServers.fill(text);
  }

  async selectLocationOfServers(text: string) {
    await this.locationOfServers.press('Enter');
    await this.locationOfServers.selectOption(text);
  }
}
