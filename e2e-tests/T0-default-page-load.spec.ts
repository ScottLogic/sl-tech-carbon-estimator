import { test } from './fixtures';

test('Default page screenshot assertion,elements are visible and apex chart displays expected values', async ({
  organisationSection,
  onPremSection,
  cloudServicesSection,
  endUsersSection,
  tcsEstimator,
  estimationsSection,
  tableSection,
}) => {
  await tcsEstimator.gotoHome();
  await organisationSection.assertOrganisationSectionVisible();
  await onPremSection.assertOnPremiseSectionVisible();
  await cloudServicesSection.assertDefaultCloudElementVisibility();
  await endUsersSection.assertEndUserSectionVisible();

  await estimationsSection.assertResultsElementVIsibility();
  await estimationsSection.tableViewButton.click();
  await tableSection.assertDefaultTableStructure();
  await estimationsSection.diagramViewButton.click();
  await tcsEstimator.calculateButton.click();
  await estimationsSection.percentageButton.click();
  await estimationsSection.assertDiagramScreenshot('T0-apex-chart.png');
});
