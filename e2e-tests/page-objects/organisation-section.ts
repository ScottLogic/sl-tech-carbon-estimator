import type { Page, Locator } from '@playwright/test';

export class OrganisationSection {
  public readonly selectEmployees: Locator;
  public readonly organisationHeading: Locator;
  public readonly percentageSlider: Locator;

  constructor(public readonly page: Page) {
    this.selectEmployees = this.page.getByLabel('How many employees are in the');
    this.organisationHeading = this.page.getByRole('heading', { name: 'Organisation' });
    this.percentageSlider = this.page.getByRole('slider', { name: 'What percentage of those' });
  }

  async sliderPercentageSet(direction: 'ArrowRight' | 'ArrowLeft', clickCount: number) {
    await this.percentageSlider.click();
    for (let i = 0; i < clickCount; i++) {
      await this.percentageSlider.press(direction);
    }
  }
  async selectNumberOfEmployess(text: string) {
    await this.selectEmployees.click();
    await this.selectEmployees.fill(text);
  }
}
