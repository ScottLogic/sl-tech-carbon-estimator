import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { OrganisationSection } from './organisation-section';

export class EstimationsSection {
  public readonly diagramViewButton: Locator;
  public readonly tableViewButton: Locator;
  public readonly percentageButton: Locator;
  public readonly kilogramsButton: Locator;
  public readonly diagramScreenshotField: Locator;

  constructor(public readonly page: Page) {
    this.diagramViewButton = page.getByRole('tab', { name: 'Diagram' });
    this.tableViewButton = page.getByRole('tab', { name: 'Table' });
    this.percentageButton = page.getByText('%', { exact: true });
    this.kilogramsButton = page.getByText('kg', { exact: true });
    this.diagramScreenshotField = page.locator('foreignobject');
  }

  async assertResultsElementVIsibility() {
    await expect(this.diagramViewButton).toBeVisible();
    await expect(this.tableViewButton).toBeVisible();
  }

  async assertDiagramScreenshot(screenshotName: string) {
    await expect(this.diagramScreenshotField).toHaveScreenshot(screenshotName);
  }
}
