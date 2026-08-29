import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import { parsePrice, parseTotal } from '../utils/parsing';
import { sumPrices } from '../utils/selection';
import type { Product } from '../models/product';

/** One line of the cart table. */
export interface CartLine {
  readonly name: string;
  readonly price: number;
}

export class CartPage extends BasePage {
  private readonly rows: Locator;
  private readonly total: Locator;
  private readonly payWithCardButton: Locator;

  constructor(page: Page) {
    super(page, '/cart');
    // table rows have real ARIA roles; the total only has its id
    this.rows = page.getByRole('row').filter({ has: page.getByRole('cell') });
    this.total = page.locator('#total');
    this.payWithCardButton = page.getByRole('button', { name: /pay with card/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.payWithCardButton, 'no Pay with Card button on the cart page').toBeVisible();
  }

  /** Every product line in the cart. */
  async readLines(): Promise<CartLine[]> {
    const lines: CartLine[] = [];
    for (const row of await this.rows.all()) {
      const cells = await row.getByRole('cell').allInnerTexts();
      const first = cells[0]?.trim() ?? '';
      const last = cells[cells.length - 1]?.trim() ?? '';
      if (cells.length < 2 || /^total\b/i.test(first)) continue;
      lines.push({ name: first, price: parsePrice(last) });
    }
    return lines;
  }

  async readDisplayedTotal(): Promise<number> {
    await expect(this.total, 'total is not visible').toBeVisible();
    return parseTotal((await this.total.innerText()).trim());
  }

  async assertContainsExactly(expected: readonly Product[]): Promise<void> {
    const lines = await this.readLines();

    expect(lines, 'cart has a different number of items than were added').toHaveLength(
      expected.length,
    );
    expect(lines.map((line) => line.name).sort()).toEqual(
      expected.map((product) => product.name).sort(),
    );
    for (const product of expected) {
      const line = lines.find((candidate) => candidate.name === product.name);
      expect(line?.price, `price of "${product.name}" must match the listing`).toBe(product.price);
    }
  }

  async assertTotalEqualsSumOf(expected: readonly Product[]): Promise<void> {
    expect(await this.readDisplayedTotal(), 'cart total does not match the sum of the lines').toBe(
      sumPrices(expected),
    );
  }

  async payWithCard(): Promise<void> {
    await this.payWithCardButton.click();
  }
}
