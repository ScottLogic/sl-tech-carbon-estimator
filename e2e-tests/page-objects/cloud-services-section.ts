import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class CloudServicesSection {
  public readonly cloudServicesHeading: Locator;
  public readonly cloudServicesInfo: Locator;
  public readonly defaultCloudPercentage: Locator;
  public readonly defaultOnPremisePercentage: Locator;
  public readonly serverLocation: Locator;
  public readonly monthlyCloudBill: Locator;
  public readonly CloudServicesNotUsedText: Locator;
  public readonly cloudUnusedTickbox: Locator;
  public readonly cloudPercentageSlider: Locator;
  public readonly percentageSplitQuestion: Locator;
  public readonly derivedRoughEstimateText: Locator;

  constructor(public readonly page: Page) {
    this.cloudServicesHeading = page.getByRole('heading', { name: 'Cloud Services' });
    this.cloudServicesInfo = page.getByText('Tell us about your cloud services');
    this.defaultCloudPercentage = page.getByText('Cloud 50%');
    this.defaultOnPremisePercentage = page.getByText('On-premise 50%');
    this.serverLocation = page.getByLabel('Where are your cloud servers');
    this.monthlyCloudBill = page.getByLabel('What is your monthly cloud');
    this.CloudServicesNotUsedText = page.getByText("We don't use cloud services");
    this.cloudUnusedTickbox = page.getByRole('checkbox', { name: "We don't use cloud services" });
    this.cloudPercentageSlider = page.getByRole('slider', {
      name: 'What percentage of your servers are cloud services vs on-premise?',
    });
    this.percentageSplitQuestion = page.getByText('What percentage of your servers are cloud services vs on-premise?');
    this.derivedRoughEstimateText = page.getByText('We have derived a rough');
  }

  async setCloudLocation(text: string) {
    await this.serverLocation.click();
    await this.serverLocation.selectOption(text);
  }

  async setMonthlyCloudBill(text: string) {
    await this.monthlyCloudBill.click();
    await this.monthlyCloudBill.selectOption(text);
  }

  async assertDefaultCloudElementVisibility() {
    await expect(this.cloudServicesHeading).toBeVisible();
    await expect(this.cloudServicesInfo).toBeVisible();
    await expect(this.defaultCloudPercentage).toBeVisible();
    await expect(this.defaultOnPremisePercentage).toBeVisible();
    await expect(this.serverLocation).toHaveValue('WORLD');
    await expect(this.monthlyCloudBill).toHaveValue('0: Object');
    await expect(this.CloudServicesNotUsedText).toBeVisible();
    await expect(this.cloudUnusedTickbox).not.toBeChecked();
    await expect(this.cloudPercentageSlider).toBeVisible();
    await expect(this.percentageSplitQuestion).toBeVisible();
    await expect(this.derivedRoughEstimateText).toBeVisible();
  }

  async cloudPercentageSliderSet(direction: 'ArrowRight' | 'ArrowLeft', clickCount: number) {
    await this.cloudPercentageSlider.click();
    for (let i = 0; i < clickCount; i++) {
      await this.cloudPercentageSlider.press(direction);
    }
  }
}
