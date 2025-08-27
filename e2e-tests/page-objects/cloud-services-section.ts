import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class CloudServicesSection {
  public readonly cloudServicesHeading: Locator;
  public readonly cloudServicesSummary: Locator;
  public readonly defaultCloudPercentage: Locator;
  public readonly defaultOnPremisePercentage: Locator;
  public readonly serverLocation: Locator;
  public readonly monthlyCloudBill: Locator;
  public readonly CloudServicesNotUsedText: Locator;
  public readonly cloudUnusedTickbox: Locator;
  public readonly percentageSlider: Locator;
  public readonly percentageSplitQuestion: Locator;
  public readonly derivedRoughEstimateText: Locator;
  public readonly hideCloudSection: Locator;
  public readonly showCloudSection: Locator;
  public readonly showAdditionalSectionInfo: Locator;
  public readonly hideAdditionalSectionInfo: Locator;

  constructor(public readonly page: Page) {
    this.cloudServicesHeading = page.getByRole('heading', { name: 'Cloud Services' });
    this.cloudServicesSummary = page.getByText('Tell us about your cloud services');
    this.defaultCloudPercentage = page.getByText('Cloud 50%');
    this.defaultOnPremisePercentage = page.getByText('On-premise 50%');
    this.serverLocation = page.getByLabel('Where are your cloud servers');
    this.monthlyCloudBill = page.getByLabel('What is your monthly cloud');
    this.CloudServicesNotUsedText = page.getByText("We don't use cloud services");
    this.cloudUnusedTickbox = page.getByRole('checkbox', { name: "We don't use cloud services" });
    this.percentageSlider = page.getByRole('slider', {
      name: 'What percentage of your servers are cloud services vs on-premise?',
    });
    this.percentageSplitQuestion = page.getByText('What percentage of your servers are cloud services vs on-premise?');
    this.derivedRoughEstimateText = page.getByText('We have derived a rough');
    this.hideCloudSection = page
      .locator('expansion-panel')
      .filter({ hasText: 'Cloud Services expand_less' })
      .getByLabel('Hide details');
    this.showCloudSection = page
      .locator('expansion-panel')
      .filter({ hasText: 'Cloud Services expand_more' })
      .getByLabel('Show details');
    this.showAdditionalSectionInfo = page
      .locator('expansion-panel')
      .filter({ hasText: 'Where are your cloud servers' })
      .getByLabel('Show details');
    this.hideAdditionalSectionInfo = page
      .locator('expansion-panel')
      .filter({ hasText: 'Where are your cloud servers' })
      .getByLabel('Hide details');
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
    await expect(this.cloudServicesSummary).toBeVisible();
    await expect(this.defaultCloudPercentage).toBeVisible();
    await expect(this.defaultOnPremisePercentage).toBeVisible();
    await expect(this.serverLocation).toHaveValue('WORLD');
    await expect(this.monthlyCloudBill).toHaveValue('0: Object');
    await expect(this.CloudServicesNotUsedText).toBeVisible();
    await expect(this.cloudUnusedTickbox).not.toBeChecked();
    await expect(this.percentageSlider).toBeVisible();
    await expect(this.percentageSplitQuestion).toBeVisible();
    await expect(this.derivedRoughEstimateText).toBeVisible();
  }

  async percentageSliderSet(direction: 'ArrowRight' | 'ArrowLeft', clickCount: number) {
    await this.percentageSlider.click();
    for (let i = 0; i < clickCount; i++) {
      await this.percentageSlider.press(direction);
    }
  }
}
