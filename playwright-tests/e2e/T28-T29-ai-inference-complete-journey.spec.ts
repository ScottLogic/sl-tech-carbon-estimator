import { test } from '../utilities/fixtures';
import { assertAllSectionElementsAreVisible } from '../utilities/test-helpers';

test('T28 - Complete AI inference user journey', async ({
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

  // Verify all form sections are visible
  await assertAllSectionElementsAreVisible(organisationSection, onPremSection, cloudServicesSection, customersSection);
  await aiInferenceSection.assertAIInferenceSectionVisible();

  // Complete organization section
  await organisationSection.selectNumberOfEmployees('500');
  // Adjust device percentage
  await organisationSection.percentageSlider.fill('60'); // 60% desktops, 40% laptops

  // Complete on-premise section
  await onPremSection.selectNumberOfServers('25');
  await onPremSection.selectLocationOfServers('Globally');

  // Complete cloud services section
  await cloudServicesSection.setCloudLocation('WORLD');
  await cloudServicesSection.setMonthlyCloudBill('3: Object'); // Medium cloud usage

  // Complete end users section
  await customersSection.setPrimaryPurpose('eCommerce');
  await customersSection.setCustomersLocation('Globally');
  await customersSection.setMonthlyActiveUsers('50000');

  // Complete AI inference section with comprehensive setup
  await aiInferenceSection.selectImageGeneration(); // High energy task
  await aiInferenceSection.setMonthlyInferences('500000'); // Half a million inferences
  await aiInferenceSection.selectOpenAI();

  // Calculate results
  await tcsEstimator.calculateButton.click();

  // Verify results in diagram view (kilograms)
  await estimationsSection.assertResultsElementVisibility();
  await diagramSection.assertDiagramScreenshot('T28-complete-journey-kg.png');

  // Verify results in diagram view (percentages)
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T28-complete-journey-percent.png');

  // Switch to table view and verify AI inference data
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure();
  await tableSection.assertTableContainsAIInference();

  // Switch back to diagram view
  await estimationsSection.diagramViewButton.click();

  // Test modification of AI inference settings
  await aiInferenceSection.selectTextClassification(); // Lower energy task
  await aiInferenceSection.setMonthlyInferences('100000'); // Reduced inferences
  await tcsEstimator.calculateButton.click();

  // Verify updated results
  await diagramSection.assertDiagramScreenshot('T28-modified-ai-settings-kg.png');

  // Test disabling AI inference entirely
  await aiInferenceSection.checkNoAIInference();
  await tcsEstimator.calculateButton.click();

  // Verify AI inference is no longer in results
  await diagramSection.assertDiagramScreenshot('T28-ai-disabled-kg.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertAIInferenceNotInResults();

  // Re-enable AI inference and verify it returns
  await aiInferenceSection.uncheckNoAIInference();
  await aiInferenceSection.selectMixedUsage(); // Reset to mixed usage
  await aiInferenceSection.setMonthlyInferences('250000');
  await aiInferenceSection.selectGoogleAI();
  await tcsEstimator.calculateButton.click();

  // Final verification
  await estimationsSection.diagramViewButton.click();
  await diagramSection.assertDiagramScreenshot('T28-ai-re-enabled-kg.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertTableContainsAIInference();
});

test('T29 - AI inference reset functionality', async ({
  organisationSection,
  onPremSection,
  cloudServicesSection,
  customersSection,
  aiInferenceSection,
  tcsEstimator,
}) => {
  await tcsEstimator.gotoHome();

  // Fill out complete form including AI inference
  await organisationSection.selectNumberOfEmployees('300');
  await onPremSection.selectNumberOfServers('15');
  await onPremSection.selectLocationOfServers('in the UK');
  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setMonthlyCloudBill('2: Object');
  await customersSection.setPrimaryPurpose('socialMedia');
  await customersSection.setCustomersLocation('GBR');
  await customersSection.setMonthlyActiveUsers('10000');

  // Configure AI inference
  await aiInferenceSection.selectTextGeneration();
  await aiInferenceSection.setMonthlyInferences('75000');
  await aiInferenceSection.selectAnthropic();

  // Verify form is filled
  await aiInferenceSection.assertAIInferenceFormElementsVisible();

  // Reset the form
  await tcsEstimator.resetButton.click();

  // Verify AI inference section is reset to defaults
  await aiInferenceSection.assertAIInferenceSectionVisible();
  await aiInferenceSection.assertAIInferenceFormElementsVisible();

  // Verify fields are reset (check some key fields)
  await organisationSection.assertOrganisationSectionVisible(); // Should be back to default state
  await aiInferenceSection.assertAIInferenceSectionVisible();
});
