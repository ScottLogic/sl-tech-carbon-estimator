import { test } from '../utilities/fixtures';

test('T21 - AI inference basic workflow with text generation', async ({
  organisationSection,
  onPremSection,
  cloudServicesSection,
  customersSection,
  aiInferenceSection,
  tcsEstimator,
  estimationsSection,
  tableSection,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();

  // Verify all sections are visible
  await organisationSection.assertOrganisationSectionVisible();
  await onPremSection.assertOnPremiseSectionVisible();
  await cloudServicesSection.assertDefaultCloudElementVisibility();
  await customersSection.assertCustomersSectionVisible();
  await aiInferenceSection.assertAIInferenceSectionVisible();

  // Set up basic organization data
  await organisationSection.selectNumberOfEmployees('50');

  // Set up basic on-premise data
  await onPremSection.selectNumberOfServers('5');
  await onPremSection.selectLocationOfServers('in the UK');

  // Set up basic cloud services
  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setMonthlyCloudBill('1: Object');

  // Set up basic end users
  await customersSection.setPrimaryPurpose('average');
  await customersSection.setCustomersLocation('GBR');
  await customersSection.setMonthlyActiveUsers('1000');

  // Configure AI inference
  await aiInferenceSection.assertAIInferenceFormElementsVisible();
  await aiInferenceSection.selectTextGeneration();
  await aiInferenceSection.setMonthlyInferences('10000');
  await aiInferenceSection.selectOpenAI();

  // Calculate and verify results
  await tcsEstimator.calculateButton.click();

  // Take screenshot of results with AI inference
  await diagramSection.assertDiagramScreenshot('T21-ai-inference-text-generation-kg.png');

  // Switch to percentage view
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T21-ai-inference-text-generation-percent.png');

  // Verify table contains AI inference data
  await estimationsSection.tableViewButton.click();
  await tableSection.assertTableContainsAIInference();
});

test('T22 - AI inference disabled workflow', async ({
  organisationSection,
  onPremSection,
  cloudServicesSection,
  customersSection,
  aiInferenceSection,
  tcsEstimator,
  estimationsSection,
  tableSection,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();

  // Set up basic organization data
  await organisationSection.selectNumberOfEmployees('100');
  await onPremSection.selectNumberOfServers('10');
  await onPremSection.selectLocationOfServers('in the UK');
  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setMonthlyCloudBill('2: Object');
  await customersSection.setPrimaryPurpose('average');
  await customersSection.setCustomersLocation('GBR');
  await customersSection.setMonthlyActiveUsers('5000');

  // Disable AI inference
  await aiInferenceSection.checkNoAIInference();
  await aiInferenceSection.assertAIInferenceFormElementsHidden();

  // Calculate and verify results
  await tcsEstimator.calculateButton.click();

  // Verify AI inference section is not shown in results
  await diagramSection.assertDiagramScreenshot('T22-no-ai-inference-kg.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T22-no-ai-inference-percent.png');

  // Verify table does not contain AI inference data when disabled
  await estimationsSection.tableViewButton.click();
  await tableSection.assertAIInferenceNotInResults();
});

test('T23 - AI inference different task types comparison', async ({
  organisationSection,
  onPremSection,
  cloudServicesSection,
  customersSection,
  aiInferenceSection,
  tcsEstimator,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();

  // Set up consistent baseline data
  await organisationSection.selectNumberOfEmployees('100');
  await onPremSection.selectNumberOfServers('5');
  await onPremSection.selectLocationOfServers('in the UK');
  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setMonthlyCloudBill('1: Object');
  await customersSection.setPrimaryPurpose('average');
  await customersSection.setCustomersLocation('GBR');
  await customersSection.setMonthlyActiveUsers('2000');

  // Test Text Generation task type
  await aiInferenceSection.selectTextGeneration();
  await aiInferenceSection.setMonthlyInferences('50000');
  await aiInferenceSection.selectOpenAI();
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T23-text-generation-results.png');

  // Test Image Generation task type (typically higher energy consumption)
  await aiInferenceSection.selectImageGeneration();
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T23-image-generation-results.png');

  // Test Text Classification task type (typically lower energy consumption)
  await aiInferenceSection.selectTextClassification();
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T23-text-classification-results.png');

  // Test Mixed Usage
  await aiInferenceSection.selectMixedUsage();
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T23-mixed-usage-results.png');
});

test('T24 - AI inference high volume scenario', async ({
  organisationSection,
  onPremSection,
  cloudServicesSection,
  customersSection,
  aiInferenceSection,
  tcsEstimator,
  estimationsSection,
  diagramSection,
  tableSection,
}) => {
  await tcsEstimator.gotoHome();

  // Set up large organization scenario
  await organisationSection.selectNumberOfEmployees('1000');
  await onPremSection.selectNumberOfServers('50');
  await onPremSection.selectLocationOfServers('Globally');
  await cloudServicesSection.setCloudLocation('WORLD');
  await cloudServicesSection.setMonthlyCloudBill('4: Object'); // Higher cloud usage
  await customersSection.setPrimaryPurpose('average');
  await customersSection.setCustomersLocation('Globally');
  await customersSection.setMonthlyActiveUsers('100000');

  // Configure high-volume AI inference
  await aiInferenceSection.selectImageGeneration(); // Energy-intensive task
  await aiInferenceSection.setMonthlyInferences('1000000'); // 1 million inferences
  await aiInferenceSection.selectAmazonBedrock();

  await tcsEstimator.calculateButton.click();

  // Verify high AI inference contribution
  await diagramSection.assertDiagramScreenshot('T24-high-volume-ai-kg.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T24-high-volume-ai-percent.png');

  // Verify detailed breakdown in table
  await estimationsSection.tableViewButton.click();
  await tableSection.assertTableContainsAIInference();
  await tableSection.assertAIInferenceHighContribution();
});

test('T25 - AI inference form validation', async ({ aiInferenceSection, tcsEstimator }) => {
  await tcsEstimator.gotoHome();

  // Test that AI inference form is initially visible
  await aiInferenceSection.assertAIInferenceFormElementsVisible();

  // Test checkbox toggle
  await aiInferenceSection.checkNoAIInference();
  await aiInferenceSection.assertAIInferenceFormElementsHidden();

  await aiInferenceSection.uncheckNoAIInference();
  await aiInferenceSection.assertAIInferenceFormElementsVisible();

  // Test invalid monthly inferences (negative number)
  await aiInferenceSection.setMonthlyInferences('-100');
  await tcsEstimator.calculateButton.click();
  await aiInferenceSection.assertMonthlyInferencesError();

  // Test valid monthly inferences
  await aiInferenceSection.setMonthlyInferences('10000');
  await aiInferenceSection.assertNoMonthlyInferencesError();

  // Test empty monthly inferences
  await aiInferenceSection.setMonthlyInferences('');
  await tcsEstimator.calculateButton.click();
  await aiInferenceSection.assertMonthlyInferencesError();
});

test('T26 - AI inference different service providers', async ({
  organisationSection,
  onPremSection,
  cloudServicesSection,
  customersSection,
  aiInferenceSection,
  tcsEstimator,
  diagramSection,
}) => {
  await tcsEstimator.gotoHome();

  // Set up baseline data
  await organisationSection.selectNumberOfEmployees('200');
  await onPremSection.selectNumberOfServers('10');
  await onPremSection.selectLocationOfServers('in the UK');
  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setMonthlyCloudBill('2: Object');
  await customersSection.setPrimaryPurpose('average');
  await customersSection.setCustomersLocation('GBR');
  await customersSection.setMonthlyActiveUsers('5000');

  // Test with OpenAI
  await aiInferenceSection.selectTextGeneration();
  await aiInferenceSection.setMonthlyInferences('25000');
  await aiInferenceSection.selectOpenAI();
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T26-openai-provider.png');

  // Test with Amazon Bedrock
  await aiInferenceSection.selectAmazonBedrock();
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T26-amazon-bedrock-provider.png');

  // Test with Google AI
  await aiInferenceSection.selectGoogleAI();
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T26-google-ai-provider.png');

  // Test with Microsoft Azure
  await aiInferenceSection.selectMicrosoftAzure();
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T26-microsoft-azure-provider.png');

  // Test with Anthropic
  await aiInferenceSection.selectAnthropic();
  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T26-anthropic-provider.png');
});
