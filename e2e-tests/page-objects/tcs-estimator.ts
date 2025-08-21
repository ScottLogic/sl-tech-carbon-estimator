import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class TcsEstimator {
  constructor(public readonly page: Page) {}
}
