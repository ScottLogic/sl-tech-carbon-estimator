import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { TcsEstimator } from './tcs-estimator';

export class OrganisationSection extends TcsEstimator {
  public readonly selectEmployees: Locator;
  public readonly organisationHeading: Locator;
  public readonly percentageSlider: Locator;
  public readonly percentageSliderText: Locator;
  public readonly defaultDesktopPercentage: Locator;
  public readonly defaultLaptopPercentage: Locator;
  public readonly organisationSectionInfo: Locator;
  public readonly hideOrganisationSection: Locator;
  public readonly showOrganisationSection: Locator;
  public readonly showAdditionalSectionInfo: Locator;
  public readonly hideAdditionalSectionInfo: Locator;
  public readonly headCountError: Locator;

  constructor(page: Page) {
    super(page);
    this.selectEmployees = page.getByLabel('How many employees are in the');
    this.organisationHeading = page.getByRole('heading', { name: 'Organisation' });
    this.percentageSlider = page.getByRole('slider', { name: 'What percentage of those' });
    this.defaultDesktopPercentage = page.getByText('Desktops 50%');
    this.defaultLaptopPercentage = page.getByText('Laptops 50%');
    this.organisationSectionInfo = page.getByText('To understand the scale of');
    this.percentageSliderText = page.getByText('What percentage of those');
    this.hideOrganisationSection = page
      .locator('expansion-panel')
      .filter({ hasText: 'Organisation expand_less To' })
      .getByLabel('Hide details');
    this.showOrganisationSection = page
      .locator('expansion-panel')
      .filter({ hasText: 'Organisation expand_more To' })
      .getByLabel('Show details');
    this.showAdditionalSectionInfo = page
      .locator('expansion-panel')
      .filter({ hasText: 'Where are your employees' })
      .getByLabel('Show details');
    this.hideAdditionalSectionInfo = page
      .locator('expansion-panel')
      .filter({ hasText: 'Where are your employees' })
      .getByLabel('Hide details');
    this.headCountError = page.locator('#headCountError').getByText('The number of employees');
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
