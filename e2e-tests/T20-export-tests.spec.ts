import { test, expect } from './fixtures';
import {
  createDefaultPercentagesJsonExport,
  createDefaultInputJsonExport,
  createDefaultValuesJsonExport,
} from './test-helpers';

test.describe('Export JSON files', () => {
  test.beforeEach(
    async ({
      organisationSection,
      tcsEstimator,
      onPremSection,
      cloudServicesSection,
      endUsersSection,
      estimationsSection,
      tableSection,
    }) => {
      await tcsEstimator.gotoHome();
      await organisationSection.assertOrganisationSectionVisible();
      await onPremSection.assertOnPremiseSectionVisible();
      await cloudServicesSection.assertDefaultCloudElementVisibility();
      await endUsersSection.assertEndUserSectionVisible();

      await estimationsSection.assertResultsElementVisibility();
      await estimationsSection.tableViewButton.click();
      await tableSection.assertDefaultTableStructure();
      await estimationsSection.diagramViewButton.click();
      await expect(estimationsSection.exportButton).toBeDisabled();
      await tcsEstimator.calculateButton.click();
    }
  );

  test('T20 Export and read JSON', async ({ page, estimationsSection }) => {
    const downloadPath = await estimationsSection.exportJsonContent(page, 'Export JSON');
    const jsonParse = await estimationsSection.readJsonFileContent(downloadPath);

    const expectedValuesJsonContent = createDefaultValuesJsonExport({});
    const expectedPercentagesJsonContent = createDefaultPercentagesJsonExport({});

    expect(jsonParse.values).toEqual(expectedValuesJsonContent.values);
    expect(jsonParse.percentages).toEqual(expectedPercentagesJsonContent.percentages);
  });

  test('T20 Export and read JSON with inputs', async ({ page, estimationsSection }) => {
    const downloadPath = await estimationsSection.exportJsonContent(page, 'Export JSON with Inputs');
    const jsonParse = await estimationsSection.readJsonFileContent(downloadPath);

    const expectedValuesJsonContent = createDefaultValuesJsonExport({});
    const expectedPercentagesJsonContent = createDefaultPercentagesJsonExport({});
    const expectedInputsJsonContent = createDefaultInputJsonExport({});

    expect(jsonParse.estimate.values).toEqual(expectedValuesJsonContent.values);
    expect(jsonParse.estimate.percentages).toEqual(expectedPercentagesJsonContent.percentages);
    expect(jsonParse.input).toEqual(expectedInputsJsonContent.input);
  });
});
