import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { TcsEstimator } from './tcs-estimator';

export class AIInferenceSection extends TcsEstimator {
  public readonly aiInferenceHeading: Locator;
  public readonly noAIInferenceCheckbox: Locator;
  public readonly noAIInferenceLabel: Locator;
  public readonly primaryTaskTypeQuestion: Locator;
  public readonly primaryTaskTypeSelect: Locator;
  public readonly monthlyInferencesInput: Locator;
  public readonly monthlyInferencesLabel: Locator;
  public readonly monthlyInferencesError: Locator;
  public readonly aiServiceProviderQuestion: Locator;
  public readonly aiServiceProviderSelect: Locator;
  public readonly aiInferenceSectionInfo: Locator;
  public readonly hideAIInferenceSection: Locator;
  public readonly showAIInferenceSection: Locator;

  constructor(page: Page) {
    super(page);

    // Main heading for AI Inference section
    this.aiInferenceHeading = page.getByRole('heading', { name: 'AI Inference' });

    // Checkbox and label for "We don't use AI inference services"
    this.noAIInferenceCheckbox = page.locator('#noAIInference');
    this.noAIInferenceLabel = page.getByLabel("We don't use AI inference services");

    // Primary task type question and dropdown
    this.primaryTaskTypeQuestion = page.getByText("What's the primary type of AI tasks your organization performs?");
    this.primaryTaskTypeSelect = page.locator('#primaryTaskType');

    // Monthly inferences input and related elements
    this.monthlyInferencesLabel = page.getByText('How many monthly AI inferences does your organization make?');
    this.monthlyInferencesInput = page.locator('#monthlyInferences');
    this.monthlyInferencesError = page.locator('#monthlyInferencesError');

    // AI service provider question and dropdown
    this.aiServiceProviderQuestion = page.getByText('Which AI service provider do you primarily use?');
    this.aiServiceProviderSelect = page.locator('#aiServiceProvider');

    // Section info text
    this.aiInferenceSectionInfo = page.getByText('Different AI task types have varying computational requirements');

    // Expand/collapse controls
    this.hideAIInferenceSection = page
      .locator('expansion-panel')
      .filter({ hasText: 'AI Inference expand_less' })
      .getByLabel('Hide details');
    this.showAIInferenceSection = page
      .locator('expansion-panel')
      .filter({ hasText: 'AI Inference expand_more' })
      .getByLabel('Show details');
  }

  async assertAIInferenceSectionVisible() {
    await expect(this.aiInferenceHeading).toBeVisible();
    await expect(this.noAIInferenceCheckbox).toBeVisible();
    await expect(this.noAIInferenceLabel).toBeVisible();
  }

  async assertAIInferenceFormElementsVisible() {
    await expect(this.primaryTaskTypeQuestion).toBeVisible();
    await expect(this.primaryTaskTypeSelect).toBeVisible();
    await expect(this.monthlyInferencesLabel).toBeVisible();
    await expect(this.monthlyInferencesInput).toBeVisible();
    await expect(this.aiServiceProviderQuestion).toBeVisible();
    await expect(this.aiServiceProviderSelect).toBeVisible();
  }

  async assertAIInferenceFormElementsHidden() {
    await expect(this.primaryTaskTypeQuestion).not.toBeVisible();
    await expect(this.primaryTaskTypeSelect).not.toBeVisible();
    await expect(this.monthlyInferencesLabel).not.toBeVisible();
    await expect(this.monthlyInferencesInput).not.toBeVisible();
    await expect(this.aiServiceProviderQuestion).not.toBeVisible();
    await expect(this.aiServiceProviderSelect).not.toBeVisible();
  }

  async checkNoAIInference() {
    await this.noAIInferenceCheckbox.check();
    await expect(this.noAIInferenceCheckbox).toBeChecked();
  }

  async uncheckNoAIInference() {
    await this.noAIInferenceCheckbox.uncheck();
    await expect(this.noAIInferenceCheckbox).not.toBeChecked();
  }

  async selectPrimaryTaskType(taskType: string) {
    await this.primaryTaskTypeSelect.selectOption(taskType);
    await expect(this.primaryTaskTypeSelect).toHaveValue(taskType);
  }

  async setMonthlyInferences(value: string) {
    await this.monthlyInferencesInput.fill(value);
    await expect(this.monthlyInferencesInput).toHaveValue(value);
  }

  async selectAIServiceProvider(provider: string) {
    await this.aiServiceProviderSelect.selectOption(provider);
    await expect(this.aiServiceProviderSelect).toHaveValue(provider);
  }

  async assertMonthlyInferencesError() {
    await expect(this.monthlyInferencesError).toBeVisible();
  }

  async assertNoMonthlyInferencesError() {
    await expect(this.monthlyInferencesError).not.toBeVisible();
  }

  // Helper methods for common task types
  async selectTextGeneration() {
    await this.selectPrimaryTaskType('text-generation');
  }

  async selectImageGeneration() {
    await this.selectPrimaryTaskType('image-generation');
  }

  async selectTextClassification() {
    await this.selectPrimaryTaskType('text-classification');
  }

  async selectQuestionAnswering() {
    await this.selectPrimaryTaskType('extractive-qa');
  }

  async selectMixedUsage() {
    await this.selectPrimaryTaskType('mixed-usage');
  }

  // Helper methods for common service providers
  async selectOpenAI() {
    await this.selectAIServiceProvider('openai');
  }

  async selectAnthropic() {
    await this.selectAIServiceProvider('anthropic');
  }

  async selectGoogleAI() {
    await this.selectAIServiceProvider('google');
  }

  async selectMicrosoftAzure() {
    await this.selectAIServiceProvider('microsoft');
  }

  async selectAmazonBedrock() {
    await this.selectAIServiceProvider('amazon');
  }

  async selectMetaAI() {
    await this.selectAIServiceProvider('meta');
  }

  async selectOtherProvider() {
    await this.selectAIServiceProvider('other');
  }
}
