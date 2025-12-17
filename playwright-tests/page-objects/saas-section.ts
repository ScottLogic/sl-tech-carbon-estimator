import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class SaasSection {
  public readonly root: Locator;
  public readonly sectionHeading: Locator;
  public readonly sectionHideExpansion: Locator;
  public readonly saasSummary: Locator;
  public readonly m365CheckBox: Locator;
  public readonly m365Question: Locator;
  public readonly m365Users: Locator;
  public readonly sectionShowExpansion: Locator;

  constructor(public readonly page: Page) {
    this.page = page;
    this.root = page.getByText('SaaS Services expand_less Tell us about the SaaS services you use.Do you use');
    this.sectionHeading = page.getByRole('heading', { name: 'SaaS Services' });
    this.sectionHideExpansion = page.locator('saas-form-section').getByRole('button', { name: 'Hide details' });
    this.sectionShowExpansion = page.locator('saas-form-section').getByRole('button', { name: 'Show details' });
    this.saasSummary = page.getByText('Tell us about the SaaS services you use');
    this.m365CheckBox = page.getByRole('checkbox', { name: 'Do you use Microsoft 365?' });
    this.m365Question = page.getByText('Do you use Microsoft 365?');
    this.m365Users = page.getByText('On average, how many user do');
  }

  async assertSaasSectionVisible() {
    await this.m365CheckBox.click();
    await expect(this.root).toBeVisible();
    await expect(this.sectionHeading).toBeVisible();
    await expect(this.sectionHideExpansion).toBeVisible();
    await expect(this.saasSummary).toBeVisible();
    await expect(this.m365Question).toBeVisible();
    await expect(this.m365CheckBox).toBeVisible();
    await expect(this.m365Users).toBeVisible();
    // Uncheck after assertion
    await this.m365CheckBox.click();
  }

  async setM365UsersCount(userCount: string) {
    await this.m365Users.click();
    await this.m365Users.fill(userCount);
  }

  async saasInputs(m365: boolean, users: string) {
    if (m365 == true) {
      await this.m365CheckBox.click();
      await this.setM365UsersCount(users);
    }
  }
}
