import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class OrganisationSection {
  public readonly selectEmployees: Locator;
  public readonly organisationHeading: Locator;
  public readonly percentageSlider: Locator;
  public readonly percentageSliderText: Locator;
  public readonly defaultDesktopPercentage: Locator;
  public readonly defaultLaptopPercentage: Locator;
  public readonly organisationSectionInfo: Locator;

  constructor(public readonly page: Page) {
    this.selectEmployees = page.getByLabel('How many employees are in the');
    this.organisationHeading = page.getByRole('heading', { name: 'Organisation' });
    this.percentageSlider = page.getByRole('slider', { name: 'What percentage of those' });
    this.defaultDesktopPercentage = page.getByText('Desktops 50%');
    this.defaultLaptopPercentage = page.getByText('Laptops 50%');
    this.organisationSectionInfo = page.getByText('To understand the scale of');
    this.percentageSliderText = page.getByText('What percentage of those');
  }

  async assertOrganisationSectionVisible() {
    await expect(this.organisationHeading).toBeVisible();
    await expect(this.organisationSectionInfo).toBeVisible();
    await expect(this.selectEmployees).toHaveValue('100');
    await expect(this.defaultDesktopPercentage).toBeVisible();
    await expect(this.defaultLaptopPercentage).toBeVisible();
    await expect(this.percentageSliderText).toBeVisible();
    await expect(this.percentageSlider).toBeVisible();
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
