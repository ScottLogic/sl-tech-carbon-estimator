import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class EstimationsSection {
  public readonly diagramViewButton: Locator;
  public readonly tableViewButton: Locator;

  constructor(public readonly page: Page) {
    this.diagramViewButton = page.getByRole('tab', { name: 'Diagram' });
    this.tableViewButton = page.getByRole('tab', { name: 'Table' });
  }
  async assertResultsElementVisibility() {
    await expect(this.diagramViewButton).toBeVisible();
    await expect(this.tableViewButton).toBeVisible();
  }
}
