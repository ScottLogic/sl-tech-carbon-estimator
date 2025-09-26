import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class TableSection {
  public readonly categoryHeading: Locator;
  public readonly emissionsHeading: Locator;
  public readonly noEstimationsText: Locator;
  public readonly upstreamEmissionsEstimate: Locator;
  public readonly employeeHardware: Locator;
  public readonly serversStorageHardware: Locator;
  public readonly networkingInfrastructurehardware: Locator;
  public readonly directEmissionsEstimate: Locator;
  public readonly employeeDevices: Locator;
  public readonly serversStorage: Locator;
  public readonly networkingInfrastructure: Locator;
  public readonly indirectEmissionsEstimate: Locator;
  public readonly cloudServices: Locator;
  public readonly aiInferenceEmissionsEstimate: Locator;
  public readonly aiInference: Locator;
  public readonly downstreamEmissionsEstimate: Locator;
  public readonly endUserDevices: Locator;
  public readonly networkDataTransfer: Locator;
  public readonly totalEmissionsEstimate: Locator;
  public readonly kilogramsColumn: Locator;
  public readonly percentageColumn: Locator;

  constructor(public page: Page) {
    this.categoryHeading = page.getByRole('gridcell', { name: 'Category' });
    this.emissionsHeading = page.getByRole('gridcell', { name: 'Emissions' });
    this.noEstimationsText = page.getByRole('gridcell', { name: 'No estimation available' });
    this.upstreamEmissionsEstimate = page.getByRole('gridcell', { name: 'Upstream Emissions Estimate', exact: true });
    this.employeeHardware = page.getByRole('gridcell', { name: 'Employee Hardware', exact: true });
    this.serversStorageHardware = page.getByRole('gridcell', { name: 'Servers and Storage Hardware', exact: true });
    this.networkingInfrastructurehardware = page.getByRole('gridcell', {
      name: 'Networking and Infrastructure Hardware',
      exact: true,
    });

    this.directEmissionsEstimate = page.getByRole('gridcell', { name: 'Direct Emissions Estimate', exact: true });
    this.employeeDevices = page.getByRole('gridcell', { name: 'Employee Devices', exact: true });
    this.serversStorage = page.getByRole('gridcell', { name: 'Servers and Storage', exact: true });
    this.networkingInfrastructure = page.getByRole('gridcell', { name: 'Networking and Infrastructure', exact: true });
    this.indirectEmissionsEstimate = page.getByRole('gridcell', { name: 'Indirect Emissions Estimate', exact: true });
    this.cloudServices = page.getByRole('gridcell', { name: 'Cloud Services', exact: true });
    this.aiInferenceEmissionsEstimate = page.getByRole('gridcell', { name: 'AI Inference Emissions Estimate', exact: true });
    this.aiInference = page.getByRole('gridcell', { name: 'AI Inference', exact: true });
    this.downstreamEmissionsEstimate = page.getByRole('gridcell', {
      name: 'Downstream Emissions Estimate',
      exact: true,
    });
    this.endUserDevices = page.getByRole('gridcell', { name: 'End-User Devices', exact: true });
    this.networkDataTransfer = page.getByRole('gridcell', { name: 'Network Data Transfer', exact: true });
    this.totalEmissionsEstimate = page.getByRole('gridcell', { name: 'Total Emissions Estimate', exact: true });
    this.kilogramsColumn = page.getByRole('treegrid').locator('td:nth-child(2)');
    this.percentageColumn = page.getByRole('treegrid').locator('td:nth-child(3)');
  }

  async assertDefaultTableStructure() {
    await expect(this.categoryHeading).toBeVisible();
    await expect(this.emissionsHeading).toBeVisible();
    await expect(this.noEstimationsText).toBeVisible();
  }

  async assertPopulatedTableStructure() {
    await expect(this.upstreamEmissionsEstimate).toBeVisible();
    await expect(this.employeeHardware).toBeVisible();
    await expect(this.serversStorageHardware).toBeVisible();
    await expect(this.networkingInfrastructurehardware).toBeVisible();
    await expect(this.directEmissionsEstimate).toBeVisible();
    await expect(this.employeeDevices).toBeVisible();
    await expect(this.serversStorage).toBeVisible();
    await expect(this.networkingInfrastructure).toBeVisible();
    await expect(this.indirectEmissionsEstimate).toBeVisible();
    await expect(this.cloudServices).toBeVisible();
    await expect(this.downstreamEmissionsEstimate).toBeVisible();
    await expect(this.endUserDevices).toBeVisible();
    await expect(this.networkDataTransfer).toBeVisible();
    await expect(this.totalEmissionsEstimate).toBeVisible();
  }

  async assertCorrectKilogramColumnValues(expectedKilogramsArray: string[]) {
    await expect(this.kilogramsColumn).toHaveText(expectedKilogramsArray);
  }

  async assertCorrectPercentageColumnValues(expectedPercentageArray: string[]) {
    await expect(this.percentageColumn).toHaveText(expectedPercentageArray);
  }

  async assertTableContainsAIInference() {
    await expect(this.aiInferenceEmissionsEstimate).toBeVisible();
    await expect(this.aiInference).toBeVisible();
  }

  async assertTableDoesNotContainAIInference() {
    await expect(this.aiInferenceEmissionsEstimate).not.toBeVisible();
    await expect(this.aiInference).not.toBeVisible();
  }

  async assertAIInferenceHighContribution() {
    // Assert that AI inference has a significant contribution (visible in table)
    await expect(this.aiInferenceEmissionsEstimate).toBeVisible();
    await expect(this.aiInference).toBeVisible();
    
    // Check that AI inference value is not zero or negligible
    const aiInferenceText = await this.aiInference.textContent();
    expect(aiInferenceText).not.toBe('0 kg');
    expect(aiInferenceText).not.toBe('<1 kg');
  }

  async assertAIInferenceZeroValues() {
    // Assert that AI inference appears in table but with zero values
    await expect(this.aiInferenceEmissionsEstimate).toBeVisible();
    await expect(this.aiInference).toBeVisible();
    
    // Check that AI inference value is zero or negligible
    const aiInferenceText = await this.aiInference.textContent();
    expect(aiInferenceText === '0 kg' || aiInferenceText === '<1 kg').toBeTruthy();
  }

  async assertAIInferenceNotInResults() {
    // When AI inference is disabled, the category header exists but the AI inference value cell doesn't
    // This is the expected behavior
    await expect(this.aiInferenceEmissionsEstimate).toBeVisible();
    
    // The AI inference value cell should not exist when disabled
    await expect(this.aiInference).not.toBeVisible();
  }
}
