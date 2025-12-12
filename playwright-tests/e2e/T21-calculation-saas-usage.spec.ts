import { test } from '../utilities/fixtures';
import * as TestData from '../utilities/test-data';

test('Verify calculated values are coherent with 1000 SaaS users', async ({
  tcsEstimator,
  saasSection,
  diagramSection,
  estimationsSection,
  tableSection,
}) => {
  await tcsEstimator.gotoHome();

  //Set SaaS users to 1000, all other inputs are default
  await saasSection.m365CheckBox.click();
  await saasSection.setM365UsersCount('1000');

  await tcsEstimator.calculateButton.click();
  await diagramSection.assertDiagramScreenshot('T21-1000-annual-kg.png');
  await estimationsSection.monthlyViewButton.click();
  await diagramSection.assertDiagramScreenshot('T21-1000-monthly-kg.png');
  await diagramSection.percentageButton.click();
  await diagramSection.assertDiagramScreenshot('T21-1000-percentages.png');
  await estimationsSection.tableViewButton.click();
  await tableSection.assertPopulatedTableStructure;

  await tableSection.assertCorrectKilogramColumnValues(TestData.t21ExpectedEmissionKilogramsMonthly);
  await estimationsSection.annualViewButton.click();
  await tableSection.assertCorrectKilogramColumnValues(TestData.t21ExpectedEmissionKilogramsAnnual);
  await tableSection.assertCorrectPercentageColumnValues(TestData.t21ExpectedEmissionPercentages);
});
