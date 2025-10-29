import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class CustomersSection {
  public readonly customersHeading: Locator;
  public readonly customersSummary: Locator;
  public readonly defaultMobileUserPercentage: Locator;
  public readonly defaultComputerUserPercentage: Locator;
  public readonly customerLocationQuestion: Locator;
  public readonly noCustomersText: Locator;
  public readonly customersUnusedTickbox: Locator;
  public readonly percentageSlider: Locator;
  public readonly percentageSplitQuestion: Locator;
  public readonly primaryPurposeQuestion: Locator;
  public readonly primaryPurposeField: Locator;
  public readonly customerLocationField: Locator;
  public readonly monthlyActiveUsersQuestion: Locator;
  public readonly monthlyActiveUsersField: Locator;
  public readonly hideCustomersSection: Locator;
  public readonly showCustomersSection: Locator;
  public readonly showPrimaryPurposeTooltip: Locator;
  public readonly hidePrimaryPurposeTooltip: Locator;
  public readonly showCustomersLocationTooltip: Locator;
  public readonly hideCustomersLocationTooltip: Locator;
  public readonly showCustomersPercentageTooltip: Locator;
  public readonly hideCustomersPercentageTooltip: Locator;
  public readonly monthlyActiveUsersError: Locator;

  constructor(public readonly page: Page) {
    this.customersHeading = page.getByRole('heading', { name: 'Customers' });
    this.customersSummary = page.getByText('Tell us about your customers');
    this.noCustomersText = page.getByText("We don't have any external");
    this.customersUnusedTickbox = page.getByRole('checkbox', { name: "We don't have any external" });
    this.percentageSlider = page.getByRole('slider', { name: 'What percentage of your customers' });
    this.primaryPurposeQuestion = page.getByLabel("What's the primary purpose of");
    this.primaryPurposeField = page.getByLabel("What's the primary purpose of");
    this.customerLocationQuestion = page.getByText('Where are your customers');
    this.customerLocationField = page.getByLabel('Where are your customers');
    this.monthlyActiveUsersQuestion = page.getByText('How many monthly active users');
    this.monthlyActiveUsersField = page.getByRole('spinbutton', { name: 'How many monthly active users' });
    this.percentageSplitQuestion = page.getByText('What percentage of your customers');
    this.defaultComputerUserPercentage = page.getByText('Computer 50%');
    this.defaultMobileUserPercentage = page.getByText('Mobile 50%');
    this.hideCustomersSection = page
      .locator('expansion-panel')
      .filter({ hasText: 'Customers expand_less Tell us' })
      .getByLabel('Hide details');
    this.showCustomersSection = page
      .locator('expansion-panel')
      .filter({ hasText: 'Customers expand_more Tell us' })
      .getByLabel('Show details');
    this.showPrimaryPurposeTooltip = page
      .locator('expansion-panel')
      .filter({ hasText: "What's the primary purpose of" })
      .getByLabel('Show details');
    this.hidePrimaryPurposeTooltip = page
      .locator('expansion-panel')
      .filter({ hasText: "What's the primary purpose of" })
      .getByLabel('Hide details');
    this.showCustomersLocationTooltip = page
      .locator('expansion-panel')
      .filter({ hasText: 'Where are your customers' })
      .getByLabel('Show details');
    this.hideCustomersLocationTooltip = page
      .locator('expansion-panel')
      .filter({ hasText: 'Where are your customers' })
      .getByLabel('Hide details');
    this.showCustomersPercentageTooltip = page
      .locator('expansion-panel')
      .filter({ hasText: 'What percentage of your customers are mobile or personal computer users?' })
      .getByLabel('Show details');
    this.hideCustomersPercentageTooltip = page
      .locator('expansion-panel')
      .filter({ hasText: 'What percentage of your customers are mobile or personal computer users?' })
      .getByLabel('Hide details');
    this.monthlyActiveUsersError = page.locator('#monthlyActiveUsersError').getByText('The number of monthly active');
  }

  async assertCustomersSectionVisible() {
    await expect(this.customersHeading).toBeVisible();
    await expect(this.customersSummary).toBeVisible();
    await expect(this.defaultMobileUserPercentage).toBeVisible();
    await expect(this.defaultComputerUserPercentage).toBeVisible();
    await expect(this.customerLocationQuestion).toBeVisible();
    await expect(this.customerLocationField).toHaveValue('WORLD');
    await expect(this.monthlyActiveUsersQuestion).toBeVisible();
    await expect(this.monthlyActiveUsersField).toHaveValue('100');
    await expect(this.primaryPurposeQuestion).toBeVisible();
    await expect(this.primaryPurposeField).toHaveValue('average');
    await expect(this.percentageSplitQuestion).toBeVisible();
    await expect(this.percentageSlider).toBeVisible();
    await expect(this.noCustomersText).toBeVisible();
    await expect(this.customersUnusedTickbox).not.toBeChecked();
  }

  async setPrimaryPurpose(text: string) {
    await this.primaryPurposeField.click();
    await this.primaryPurposeField.selectOption(text);
  }

  async setCustomersLocation(text: string) {
    await this.customerLocationField.click();
    await this.customerLocationField.selectOption(text);
  }

  async setMonthlyActiveUsers(text: string) {
    await this.monthlyActiveUsersField.click();
    await this.monthlyActiveUsersField.fill(text);
  }

  async percentageSliderSet(direction: 'ArrowRight' | 'ArrowLeft', clickCount: number) {
    for (let i = 0; i < clickCount; i++) {
      await this.percentageSlider.press(direction);
    }
  }
}
