import { test } from './fixtures';

test('Default page screenshot assertion,elements are visible and apex chart displays expected values', async ({
  organisationSection,
  onPremSection,
  cloudServicesSection,
  endUsersSection,
  tcsEstimator,
  estimationsSection,
  tableSection,
  diagramSection,
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
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T0-apex-chart.png');
});
