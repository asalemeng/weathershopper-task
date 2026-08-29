import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import { decidePurchase, type ShoppingDecision } from '../models/weather';
import { parseTemperature } from '../utils/parsing';

export type ProductCategory = 'moisturizer' | 'sunscreen';

export class HomePage extends BasePage {
  private readonly temperature: Locator;
  private readonly buyMoisturizers: Locator;
  private readonly buySunscreens: Locator;

  constructor(page: Page) {
    super(page, '/');
    this.temperature = page.locator('#temperature');
    this.buyMoisturizers = page.getByRole('button', { name: /moisturizer/i });
    this.buySunscreens = page.getByRole('button', { name: /sunscreen/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.temperature, 'no temperature on the home page').toHaveText(/\d+/);
  }

  async requireDepartment(): Promise<ProductCategory> {
    const decision = await this.currentDecision();
    if (decision === 'none') {
      throw new Error(
        `The app shows ${await this.readTemperature()} C, which its own rule says ` +
          'means nothing to buy, so the shopping journey cannot start.',
      );
    }
    return decision;
  }

  async openDepartment(category: ProductCategory): Promise<void> {
    const button = category === 'moisturizer' ? this.buyMoisturizers : this.buySunscreens;
    await button.click();
  }

  async readTemperature(): Promise<number> {
    await this.expectLoaded();
    return parseTemperature((await this.temperature.innerText()).trim());
  }

  // what the app's rule says to buy at this temperature
  async currentDecision(): Promise<ShoppingDecision> {
    return decidePurchase(await this.readTemperature());
  }
}
