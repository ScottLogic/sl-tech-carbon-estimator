import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
export class DiagramSection {
  public readonly percentageButton: Locator;
  public readonly kilogramsButton: Locator;
  public readonly diagramScreenshotField: Locator;
  public readonly totalEmissionsEstimate: Locator;
  public readonly downStreamEmissionsEstimate: Locator;
  public readonly indirectEmissionsEstimate: Locator;
  public readonly directEmissionsEstimate: Locator;
  public readonly upstreamEmissionsEstimate: Locator;

  constructor(public readonly page: Page) {
    this.totalEmissionsEstimate = page.getByText('Total Emissions Estimate');
    this.upstreamEmissionsEstimate = page.locator('span').filter({ hasText: 'Upstream Emissions Estimate' });
    this.directEmissionsEstimate = page.locator('span').filter({ hasText: /^Direct Emissions Estimate - \?$/ });
    this.indirectEmissionsEstimate = page.locator('span').filter({ hasText: 'Indirect Emissions Estimate' });
    this.downStreamEmissionsEstimate = page.locator('span').filter({ hasText: 'Downstream Emissions Estimate' });
    this.percentageButton = page.getByText('%', { exact: true });
    this.kilogramsButton = page.getByText('kg', { exact: true });
    this.diagramScreenshotField = page.locator('foreignobject');
  }
  async assertDiagramScreenshot(screenshotName: string) {
    await expect(this.diagramScreenshotField).toHaveScreenshot(screenshotName);
  }
}
