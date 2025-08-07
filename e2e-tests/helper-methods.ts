import AxeBuilder from '@axe-core/playwright';
import { Page, expect } from '@playwright/test';

export const expectNoA11yViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
};
