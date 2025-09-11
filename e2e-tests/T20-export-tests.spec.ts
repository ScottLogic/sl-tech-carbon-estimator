import { test, expect } from './fixtures';
import { assertAllSectionElementsAreVisible } from './test-helpers';
import * as fs from 'fs';

test('T20', async ({
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

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export ▼' }).click(),
    page.getByRole('link', { name: 'Export JSON', exact: true }).click(),
  ]);

  const path = await download.path();
  if (!path) throw new Error('Download failed');

  //reading

  const fileContent = fs.readFileSync(path, 'utf-8');
  const json = JSON.parse(fileContent);

  // expect(json.values.version).toEqual('1.0.0');
  expect(json).toEqual({
    values: {
      version: '0.0.0-semantically-released',
      upstreamEmissions: {
        employee: 13708.333333333334,
        server: 3625,
        network: 1300,
        software: 0,
      },
      directEmissions: {
        employee: 6484.5694,
        server: 26189.56176,
        network: 3093.2690302799997,
      },
      indirectEmissions: {
        cloud: 620.874264,
        saas: 0,
        managed: 0,
      },
      downstreamEmissions: {
        endUser: 147.60952776716255,
        networkTransfer: 239.029161520401,
        downstreamInfrastructure: 0,
      },
      totalEmissions: 55408.2464769009,
    },
    percentages: {
      version: '0.0.0-semantically-released',
      upstreamEmissions: {
        employee: 24.740601273220566,
        server: 6.542347449149511,
        network: 2.346221154177756,
        software: 0,
      },
      directEmissions: {
        employee: 11.70325684770289,
        server: 47.26654139996678,
        network: 5.582687103389114,
      },
      indirectEmissions: {
        cloud: 1.1205448709856498,
        saas: 0,
        managed: 0,
      },
      downstreamEmissions: {
        endUser: 0.2664035358503889,
        networkTransfer: 0.4313963655573357,
        downstreamInfrastructure: 0,
      },
      totalEmissions: 55408.2464769009,
    },
  });
});
