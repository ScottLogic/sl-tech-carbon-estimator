import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { TcsEstimator } from './tcs-estimator';

export class OrganisationSection extends TcsEstimator {
  public readonly selectEmployees: Locator;
  public readonly organisationHeading: Locator;
  public readonly percentageSlider: Locator;
  public readonly percentageSliderText: Locator;
  public readonly serverLocation: Locator;
  public readonly defaultDesktopPercentage: Locator;
  public readonly defaultLaptopPercentage: Locator;
  public readonly organisationSectionInfo: Locator;
  public readonly hideOrganisationSection: Locator;
  public readonly showOrganisationSection: Locator;
  public readonly headCountError: Locator;
  public readonly showEmployeeLocationTooltip: Locator;
  public readonly hideEmployeeLocationTooltip: Locator;

  constructor(page: Page) {
    super(page);
    this.selectEmployees = page.getByLabel('How many employees are in the');
    this.organisationHeading = page.getByRole('heading', { name: 'Organisation' });
    this.percentageSlider = page.getByRole('slider', { name: 'What percentage of those' });
    this.serverLocation = page.getByLabel('Where are your employees');
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
    this.headCountError = page.locator('#headCountError').getByText('The number of employees');
    this.showEmployeeLocationTooltip = page
      .locator('expansion-panel')
      .filter({ hasText: 'Where are your employees' })
      .getByLabel('Show details');
    this.hideEmployeeLocationTooltip = page
      .locator('expansion-panel')
      .filter({ hasText: 'Where are your employees' })
      .getByLabel('Hide details');
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

  async percentageSliderSet(value: string) {
    await this.percentageSlider.fill(value);
  }

  async selectNumberOfEmployess(text: string) {
    await this.selectEmployees.click();
    await this.selectEmployees.fill(text);
  }

  async selectLocationOfServers(text: string) {
    await this.serverLocation.press('Enter');
    await this.serverLocation.selectOption(text);
  }

  async organisationInputs(number_of_employees: string, percentage: string, location: string) {
    await this.selectNumberOfEmployess(number_of_employees);
    await this.percentageSliderSet(percentage);
    await this.selectLocationOfServers(location);
  }
}
