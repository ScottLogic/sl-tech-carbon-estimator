import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible, createDefaultInputJsonExport } from './test-helpers';
// import { createDefaultCalculationJsonExport } from './test-helpers';
import { createDefaultValuesJsonExport } from './test-helpers';
import { createDefaultPercentagesJsonExport } from './test-helpers';
import * as fs from 'fs';

test.describe('Export JSON files', () => {
  test.beforeEach(
    async ({
      organisationSection,
      page,
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
      await tcsEstimator.calculateButton.click();
    }
  );

  test('T20 Export and read JSON', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export ▼' }).click(),
      page.getByRole('link', { name: 'Export JSON', exact: true }).click(),
    ]);

    const path = await download.path();
    if (!path) throw new Error('Download failed');



    const fileContent = fs.readFileSync(path, 'utf-8');
    const json = JSON.parse(fileContent);

    const expectedValuesJsonContent = createDefaultValuesJsonExport({});
    const expectedPercentagesJsonContent = createDefaultPercentagesJsonExport({});

    expect(json.values).toEqual(expectedValuesJsonContent.values);
    expect(json.percentages).toEqual(expectedPercentagesJsonContent.percentages);
  });

  test('T20 Export and read JSON with inputs', async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export ▼' }).click(),
      page.getByRole('link', { name: 'Export JSON with Inputs', exact: true }).click(),
    ]);

    const path = await download.path();
    if (!path) throw new Error('Download failed');


    const fileContent = fs.readFileSync(path, 'utf-8');
    const json = JSON.parse(fileContent);

    const expectedValuesJsonContent = createDefaultValuesJsonExport({});
    const expectedPercentagesJsonContent = createDefaultPercentagesJsonExport({});
    const expectedInputsJsonContent = createDefaultInputJsonExport({});

    expect(json.estimate.values).toEqual(expectedValuesJsonContent.values);
    expect(json.estimate.percentages).toEqual(expectedPercentagesJsonContent.percentages);
    expect(json.input).toEqual(expectedInputsJsonContent.input);
  });
});
