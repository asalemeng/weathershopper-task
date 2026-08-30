import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import type { ProductCategory } from './home.page';
import type { Product, ProductRequirement } from '../models/product';
import { parsePrice } from '../utils/parsing';
import { cheapestMatching } from '../utils/selection';

const PATHS: Record<ProductCategory, string> = {
  moisturizer: '/moisturizer',
  sunscreen: '/sunscreen',
};

export class ProductListPage extends BasePage {
  readonly cards: Locator;
  readonly cartButton: Locator;

  constructor(
    page: Page,
    private readonly category: ProductCategory,
  ) {
    super(page, PATHS[category]);
    this.cards = page
      .locator('.text-center.col-4')
      .filter({ has: page.getByRole('button', { name: /^add/i }) });
    this.cartButton = page.getByRole('button', { name: /cart/i });
  }

  async expectLoaded(): Promise<void> {
    await this.page.waitForLoadState('load');
    await expect(this.cards, `no products listed on the ${this.category} page`).not.toHaveCount(0);
  }

  private nameOf(card: Locator): Locator {
    return card.locator('p.font-weight-bold, p:first-of-type').first();
  }

  // some cards say "Price: Rs. 215", others "Price: 220" - anchor on the Price label
  private priceOf(card: Locator): Locator {
    return card.locator('p:has-text("Price"), p:has-text("Rs")').first();
  }

  // read one card field, with an error that names the card instead of a bare timeout
  private async readField(locator: Locator, index: number, field: string): Promise<string> {
    const text = await locator.innerText({ timeout: 5_000 }).catch(() => null);
    if (text === null) {
      const card = (
        await this.cards
          .nth(index)
          .innerText()
          .catch(() => '')
      ).replace(/\s+/g, ' ');
      throw new Error(
        `${this.category} card #${index} has no ${field}. Card content: "${card.trim()}"`,
      );
    }
    return text.trim();
  }

  // all products in page order
  async listProducts(): Promise<Product[]> {
    const cards = await this.cards.all();
    const products: Product[] = [];
    for (const [index, card] of cards.entries()) {
      const name = await this.readField(this.nameOf(card), index, 'name');
      const price = parsePrice(await this.readField(this.priceOf(card), index, 'price'));
      products.push({ name, price, index });
    }
    if (products.length === 0) {
      throw new Error(`No products were read from the ${this.category} page.`);
    }
    return products;
  }

  async addToCartByIndex(index: number): Promise<void> {
    await this.cards.nth(index).getByRole('button', { name: /^add/i }).click();
  }

  // pick the cheapest product matching the rule and add it to the cart
  async addCheapestMatching(requirement: ProductRequirement): Promise<Product> {
    const products = await this.listProducts();
    const chosen = cheapestMatching(products, requirement);
    expect(chosen.name, `"${chosen.name}" must satisfy: ${requirement.label}`).toMatch(
      requirement.pattern,
    );
    await this.addToCartByIndex(chosen.index);
    return chosen;
  }

  async addCheapestMatchingAll(
    requirements: readonly ProductRequirement[],
  ): Promise<readonly Product[]> {
    const purchased: Product[] = [];
    for (const requirement of requirements) {
      purchased.push(await this.addCheapestMatching(requirement));
    }
    return purchased;
  }
  async openCart(): Promise<void> {
    // the app updates the cart with JS after each Add; clicking while the
    // button still says "Empty" does nothing and the test never leaves the page
    await expect(this.cartButton, 'cart never registered the added items').not.toHaveText(/empty/i);
    await this.cartButton.click();
  }
}
