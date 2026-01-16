import { test, expect } from '../utilities/fixtures';
import { createDefaultJsonExport, createDefaultInputJsonExport, pdfComparison } from '../utilities/test-helpers';
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

    const expectedAnnualJsonContent = createDefaultJsonExport();

    expect(jsonParse).toEqual(expectedAnnualJsonContent);
  });

  test('T20 Export and read JSON (Monthly)', async ({ page, estimationsSection }) => {
    await estimationsSection.monthlyViewButton.click();
    const downloadPath = await estimationsSection.downloadFile(page, 'Export JSON');
    const jsonParse = await estimationsSection.readJsonFileContent(downloadPath);

    expect(jsonParse).toEqual(TestData.t20ExpectedMonthlyJson);
  });

  test('T20 Export and read JSON with inputs (Annual)', async ({ page, estimationsSection }) => {
    const downloadPath = await estimationsSection.downloadFile(page, 'Export JSON with Inputs');
    const jsonParse = await estimationsSection.readJsonFileContent(downloadPath);

    const expectedJsonContent = createDefaultJsonExport();
    const expectedInputsJsonContent = createDefaultInputJsonExport(expectedJsonContent);

    expect(jsonParse).toEqual(expectedInputsJsonContent);
  });

  test('T20 Export and read JSON with inputs (Monthly)', async ({ page, estimationsSection }) => {
    await estimationsSection.monthlyViewButton.click();
    const downloadPath = await estimationsSection.downloadFile(page, 'Export JSON with Inputs');
    const jsonParse = await estimationsSection.readJsonFileContent(downloadPath);

    const expectedInputsJsonContent = createDefaultInputJsonExport(TestData.t20ExpectedMonthlyJson);

    expect(jsonParse).toEqual(expectedInputsJsonContent);
    console.log(downloadPath);
  });

  test('T20 Verify that download is executed for PDF file (Monthly)', async ({ page, estimationsSection }) => {
    await estimationsSection.monthlyViewButton.click();
    const path = await estimationsSection.downloadFile(page, 'Export PDF');
    expect(path).toBeTruthy();
    // If PDF design changes, replace the expected baseline PDF and then update snapshot
    await pdfComparison(path, './playwright-tests/snapshot-directory/pdf-export-monthly.pdf');
  });

  test('T20 Verify that download is executed for PDF file (Annual)', async ({ page, estimationsSection }) => {
    await estimationsSection.annualViewButton.click();
    const path = await estimationsSection.downloadFile(page, 'Export PDF');
    expect(path).toBeTruthy();
    // If PDF design changes, replace the expected baseline PDF and then update snapshots
    await pdfComparison(path, './playwright-tests/snapshot-directory/pdf-export-annual.pdf');
  });

  test('T20 Close Export Modal', async ({ estimationsSection }) => {
    await estimationsSection.openPdfExportModal();
    await expect(estimationsSection.exportModal).toBeVisible();
    await estimationsSection.modalCloseButton.click();
    await expect(estimationsSection.exportModal).not.toBeVisible();
  });
});
