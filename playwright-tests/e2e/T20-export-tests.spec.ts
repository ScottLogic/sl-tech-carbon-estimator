import { test, expect } from '../utilities/fixtures';
import {
  createDefaultPercentagesJsonExport,
  createDefaultInputJsonExport,
  createDefaultValuesJsonExport,
} from '../utilities/test-helpers';
import * as TestData from '../utilities/test-data';

test.describe('Download and read files', () => {
  test.beforeEach(
    async ({
      organisationSection,
      tcsEstimator,
      onPremSection,
      cloudServicesSection,
      customersSection,
      estimationsSection,
      tableSection,
    }) => {
      await tcsEstimator.gotoHome();
      await organisationSection.assertOrganisationSectionVisible();
      await onPremSection.assertOnPremiseSectionVisible();
      await cloudServicesSection.assertDefaultCloudElementVisibility();
      await customersSection.assertCustomersSectionVisible();

      await estimationsSection.assertResultsElementVisibility();
      await estimationsSection.tableViewButton.click();
      await tableSection.assertDefaultTableStructure();
      await estimationsSection.diagramViewButton.click();
      await expect(estimationsSection.exportButton).toBeDisabled();
      await tcsEstimator.calculateButton.click();
    }
  );

  test('T20 Export and read JSON (Annual)', async ({ page, estimationsSection }) => {
    const downloadPath = await estimationsSection.downloadFile(page, 'Export JSON');
    const jsonParse = await estimationsSection.readJsonFileContent(downloadPath);

    const expectedAnnualValuesJsonContent = createDefaultValuesJsonExport({});
    const expectedPercentagesJsonContent = createDefaultPercentagesJsonExport({});

    expect(jsonParse.values).toEqual(expectedAnnualValuesJsonContent.values);
    expect(jsonParse.percentages).toEqual(expectedPercentagesJsonContent.percentages);
  });

  test('T20 Export and read JSON (Monthly)', async ({ page, estimationsSection }) => {
    await estimationsSection.monthlyViewButton.click();
    const downloadPath = await estimationsSection.downloadFile(page, 'Export JSON');
    const jsonParse = await estimationsSection.readJsonFileContent(downloadPath);

    const expectedPercentagesJsonContent = createDefaultPercentagesJsonExport({});

    expect(jsonParse.values).toEqual(TestData.t20ExpectedMonthlyValuesJson.values);
    expect(jsonParse.percentages).toEqual(expectedPercentagesJsonContent.percentages);
  });

  test('T20 Export and read JSON with inputs (Annual)', async ({ page, estimationsSection }) => {
    const downloadPath = await estimationsSection.downloadFile(page, 'Export JSON with Inputs');
    const jsonParse = await estimationsSection.readJsonFileContent(downloadPath);

    const expectedValuesJsonContent = createDefaultValuesJsonExport({});
    const expectedPercentagesJsonContent = createDefaultPercentagesJsonExport({});
    const expectedInputsJsonContent = createDefaultInputJsonExport({});

    expect(jsonParse.estimate.values).toEqual(expectedValuesJsonContent.values);
    expect(jsonParse.estimate.percentages).toEqual(expectedPercentagesJsonContent.percentages);
    expect(jsonParse.input).toEqual(expectedInputsJsonContent.input);
  });

  test('T20 Export and read JSON with inputs (Monthly)', async ({ page, estimationsSection }) => {
    await estimationsSection.monthlyViewButton.click();
    const downloadPath = await estimationsSection.downloadFile(page, 'Export JSON with Inputs');
    const jsonParse = await estimationsSection.readJsonFileContent(downloadPath);

    const expectedPercentagesJsonContent = createDefaultPercentagesJsonExport({});
    const expectedInputsJsonContent = createDefaultInputJsonExport({});

    expect(jsonParse.estimate.values).toEqual(TestData.t20ExpectedMonthlyValuesJson.values);
    expect(jsonParse.estimate.percentages).toEqual(expectedPercentagesJsonContent.percentages);
    expect(jsonParse.input).toEqual(expectedInputsJsonContent.input);
    console.log(downloadPath);
  });

  test('T20 Verify that download is executed for PDF file (Monthly)', async ({ page, estimationsSection }) => {
    await estimationsSection.monthlyViewButton.click();
    const path = await estimationsSection.downloadFile(page, 'Export PDF');
    expect(path).toBeTruthy();
  });

  test('T20 Verify that download is executed for PDF file (Annual)', async ({ page, estimationsSection }) => {
    await estimationsSection.annualViewButton.click();
    const path = await estimationsSection.downloadFile(page, 'Export PDF');
    expect(path).toBeTruthy();
  });
});
