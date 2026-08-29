import { test as base, expect } from '@playwright/test';
import { PageObjectManager } from '../pages/po-manager';

interface WeatherShopperFixtures {
  /** Entry point to every page object for the current test. */
  poManager: PageObjectManager;
}

export const test = base.extend<WeatherShopperFixtures>({
  poManager: async ({ page }, use) => {
    await use(new PageObjectManager(page));
  },
});

export { expect };
