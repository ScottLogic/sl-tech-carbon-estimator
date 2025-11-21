import { test, expect } from '../utilities/fixtures';
import AxeBuilder from '@axe-core/playwright';

test('AI inference accessibility test - light mode', async ({
  page,
  organisationSection,
  onPremSection,
  cloudServicesSection,
  customersSection,
  aiInferenceSection,
  tcsEstimator,
}) => {
  await tcsEstimator.gotoHome();

  // Fill out form with AI inference enabled
  await organisationSection.selectNumberOfEmployees('100');
  await onPremSection.selectNumberOfServers('10');
  await onPremSection.selectLocationOfServers('in the UK');
  await cloudServicesSection.setCloudLocation('GBR');
  await cloudServicesSection.setMonthlyCloudBill('2: Object');
  await customersSection.setPrimaryPurpose('average');
  await customersSection.setCustomersLocation('GBR');
  await customersSection.setMonthlyActiveUsers('5000');

  // Configure AI inference
  await aiInferenceSection.selectTextGeneration();
  await aiInferenceSection.setMonthlyInferences('25000');
  await aiInferenceSection.selectOpenAI();

  await tcsEstimator.calculateButton.click();

  // Run accessibility scan on results page with AI inference
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('AI inference accessibility test - dark mode', async ({
  page,
  organisationSection,
  onPremSection,
  cloudServicesSection,
  customersSection,
  aiInferenceSection,
  tcsEstimator,
}) => {
  await tcsEstimator.gotoHome();

  // Enable dark mode
  await page.emulateMedia({ colorScheme: 'dark' });

  // Fill out form with AI inference disabled
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

  await tcsEstimator.calculateButton.click();

  // Run accessibility scan in dark mode without AI inference
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('AI inference form accessibility validation', async ({ page, aiInferenceSection, tcsEstimator }) => {
  await tcsEstimator.gotoHome();

  // Test form validation accessibility
  await aiInferenceSection.setMonthlyInferences('-100'); // Invalid input
  await tcsEstimator.calculateButton.click();

  // Run accessibility scan with validation errors
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);

  // Verify error message is properly associated with input
  await aiInferenceSection.assertMonthlyInferencesError();
});
