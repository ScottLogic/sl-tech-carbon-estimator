import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class EndUsersSection {
  public readonly endUsersHeading: Locator;
  public readonly endUsersInfo: Locator;
  public readonly defaultMobileUserPercentage: Locator;
  public readonly defaultComputerUserPercentage: Locator;
  public readonly endUserLocationQuestion: Locator;
  public readonly noEndUsersText: Locator;
  public readonly endUserUnusedTickbox: Locator;
  public readonly percentageSplitSlider: Locator;
  public readonly percentageSplitQuestion: Locator;
  public readonly primaryPurposeQuestion: Locator;
  public readonly primaryPurposeField: Locator;
  public readonly endUserLocationField: Locator;
  public readonly monthlyActiveUsersQuestion: Locator;
  public readonly monthlyActiveUsersField: Locator;

  // locator types here
  constructor(public readonly page: Page) {
    // define locators for elements in the End Users section
    this.endUsersHeading = page.getByRole('heading', { name: 'End-Users' });
    this.endUsersInfo = page.getByText('Tell us about your end-users');
    this.noEndUsersText = page.getByText("We don't have any external");
    this.endUserUnusedTickbox = page.getByRole('checkbox', { name: "We don't have any external" });
    this.percentageSplitSlider = page.getByRole('slider', { name: 'What percentage of your end-' });
    this.primaryPurposeQuestion = page.getByLabel("What's the primary purpose of");
    this.primaryPurposeField = page.getByLabel("What's the primary purpose of");
    this.endUserLocationQuestion = page.getByText('Where are your end-users');
    this.endUserLocationField = page.getByLabel('Where are your end-users');
    this.monthlyActiveUsersQuestion = page.getByText('How many monthly active users');
    this.monthlyActiveUsersField = page.getByRole('spinbutton', { name: 'How many monthly active users' });
    this.percentageSplitQuestion = page.getByText('What percentage of your end-');
    this.defaultComputerUserPercentage = page.getByText('Computer 50%');
    this.defaultMobileUserPercentage = page.getByText('Mobile 50%');
  }

  async assertEndUserSectionVisible() {
    await expect(this.endUsersHeading).toBeVisible();
    await expect(this.endUsersInfo).toBeVisible();
    await expect(this.defaultMobileUserPercentage).toBeVisible();
    await expect(this.defaultComputerUserPercentage).toBeVisible();
    await expect(this.endUserLocationQuestion).toBeVisible();
    await expect(this.endUserLocationField).toHaveValue('WORLD');
    await expect(this.monthlyActiveUsersQuestion).toBeVisible();
    await expect(this.monthlyActiveUsersField).toHaveValue('100');
    await expect(this.primaryPurposeQuestion).toBeVisible();
    await expect(this.primaryPurposeField).toHaveValue('average');
    await expect(this.percentageSplitQuestion).toBeVisible();
    await expect(this.percentageSplitSlider).toBeVisible();
    await expect(this.noEndUsersText).toBeVisible();
    await expect(this.endUserUnusedTickbox).not.toBeChecked();
  }

  async setPrimaryPurpose(text: string) {
    await this.primaryPurposeField.click();
    await this.primaryPurposeField.fill(text);
  }

  async setEndUserLocation(text: string) {
    await this.endUserLocationField.click();
    await this.endUserLocationField.selectOption(text);
  }

  async setMonthlyActiveUsers(text: string) {
    await this.monthlyActiveUsersField.click();
    await this.monthlyActiveUsersField.fill(text);
  }

  async percentageSplitSliderSet(direction: 'ArrowRight' | 'ArrowLeft', clickCount: number) {
    await this.percentageSplitSlider.click();
    for (let i = 0; i < clickCount; i++) {
      await this.percentageSplitSlider.press(direction);
    }
  }
}
