import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import * as fs from 'fs';

export class EstimationsSection {
  public readonly diagramViewButton: Locator;
  public readonly tableViewButton: Locator;
  public readonly exportButton: Locator;
  public readonly exportJsonButton: Locator;
  public readonly exportJsonInputsButton: Locator;
  public readonly exportPdfButton: Locator;
  public readonly downloadPdfButton: Locator;
  public readonly monthlyViewButton: Locator;
  public readonly annualViewButton: Locator;
  public readonly modalCloseButton: Locator;
  public readonly exportModal: Locator;
  public readonly treeMapHandle: string;
  public readonly pdfTitle: Locator;

  constructor(public readonly page: Page) {
    this.diagramViewButton = page.getByRole('tab', { name: 'Diagram' });
    this.tableViewButton = page.getByRole('tab', { name: 'Table' });
    this.exportButton = page.getByRole('button', { name: 'Export ▼' });
    this.monthlyViewButton = page.getByText('Monthly', { exact: true });
    this.annualViewButton = page.getByText('Annual', { exact: true });
    this.downloadPdfButton = page.getByRole('button', { name: 'Download PDF' });
    this.exportJsonButton = page.getByRole('link', { name: 'Export JSON', exact: true });
    this.exportJsonInputsButton = page.getByRole('link', { name: 'Export JSON with Inputs', exact: true });
    this.exportPdfButton = page.getByRole('button', { name: 'Export PDF' });
    this.modalCloseButton = page.getByRole('button', { name: 'X', exact: true });
    this.exportModal = page.getByText('Report Name: XCarbon');
    this.treeMapHandle = 'apexcharts-grid';
    this.pdfTitle = page.getByRole('textbox', { name: 'Report Name:' });
  }

  async assertResultsElementVisibility() {
    await expect(this.diagramViewButton).toBeVisible();
    await expect(this.tableViewButton).toBeVisible();
    await expect(this.exportButton).toBeVisible();
  }

  async downloadFile(page: Page, exportType: 'Export JSON' | 'Export JSON with Inputs' | 'Export PDF') {
    const downloadPromise = page.waitForEvent('download', { timeout: 50000 });
    await this.exportButton.click();
    const exportListOption = page
      .getByRole('link', { name: exportType, exact: true })
      .or(page.getByRole('button', { name: exportType, exact: true }));
    await exportListOption.click();

    if (exportType === 'Export PDF') {
      await this.pdfTitle.fill('Test PDF Export');
      await this.downloadPdfButton.click();
    }
    const download = await downloadPromise;
    const path = await download.path();
    if (!path) throw new Error('Download failed');
    return path;
  }

  async readJsonFileContent(path: string) {
    const fileContent = fs.readFileSync(path, 'utf-8');
    const json = JSON.parse(fileContent);

    return json;
  }

  async openPdfExportModal() {
    await this.exportButton.click();
    await this.exportPdfButton.click();
  }

  async editPdfName(text: string) {
    await this.pdfTitle.fill(text);
  }
}
