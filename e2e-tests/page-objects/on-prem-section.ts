import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
export class OnPremSection {
  private readonly numberOfServers: Locator;
  private readonly locationOfServers: Locator;
  public readonly onPremHeading: Locator;
  public readonly onPremServerQuestion: Locator;
  public readonly onPremTickbox: Locator;
  public readonly onPremSectionSummary: Locator;
  public readonly serverLocationText: Locator;
  public readonly serverLocationTextExpansion: Locator;
  public readonly serversUnknownLabel: Locator;
  public readonly hideOnPremSection: Locator;
  public readonly showOnPremSection: Locator;
  public readonly showAdditionalSectionInfo: Locator;
  public readonly hideAdditionalSectionInfo: Locator;

  constructor(public readonly page: Page) {
    this.numberOfServers = page.getByLabel('Number of Servers:');
    this.onPremSectionSummary = page.getByText("We'll use the number of");
    this.locationOfServers = page.getByLabel('Where are they primarily located?', { exact: true });
    this.onPremHeading = page.getByRole('heading', { name: 'On-Premise Servers' });
    this.onPremServerQuestion = page.getByText('How many on-premise servers');
    this.onPremTickbox = page.getByRole('checkbox', { name: "I don't know" });
    this.serverLocationText = page.getByText('Where are they primarily located? expand_more');
    this.serverLocationTextExpansion = page.getByText('Where are they primarily located?');
    this.serversUnknownLabel = page.locator('label').filter({ hasText: "I don't know" });
    this.hideOnPremSection = page
      .locator('expansion-panel')
      .filter({ hasText: 'On-Premise Servers' })
      .getByLabel('Hide details');
    this.showOnPremSection = page
      .locator('expansion-panel')
      .filter({ hasText: 'On-Premise Servers' })
      .getByLabel('Show details');
    this.showAdditionalSectionInfo = page
      .locator('expansion-panel')
      .filter({ hasText: 'Where are they primarily' })
      .getByLabel('Show details');
    this.hideAdditionalSectionInfo = page
      .locator('expansion-panel')
      .filter({ hasText: 'Where are they primarily' })
      .getByLabel('Hide details');
  }

  async assertOnPremiseSectionVisible() {
    await expect(this.onPremHeading).toBeVisible();
    await expect(this.onPremSectionSummary).toBeVisible();
    await expect(this.numberOfServers).toHaveValue('10');
    await expect(this.onPremTickbox).toBeVisible();
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
