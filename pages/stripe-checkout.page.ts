import type { FrameLocator, Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { CardDetails } from '../test-data/checkout.data';

export class StripeCheckoutPage {
  private readonly frame: FrameLocator;
  private readonly email: Locator;
  private readonly cardNumber: Locator;
  private readonly expiry: Locator;
  private readonly cvc: Locator;
  private readonly payButton: Locator;

  constructor(page: Page) {
    this.frame = page.frameLocator('iframe[name="stripe_checkout_app"]');
    this.email = this.frame.getByPlaceholder('Email');
    this.cardNumber = this.frame.getByPlaceholder('Card number');
    this.expiry = this.frame.getByPlaceholder(/MM\s*\/\s*YY/i);
    this.cvc = this.frame.getByPlaceholder('CVC');
    this.payButton = this.frame.getByRole('button', { name: /^pay/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.email, 'Stripe overlay did not open').toBeVisible();
  }

  async pay(card: CardDetails): Promise<void> {
    await this.email.fill(card.email);
    await this.cardNumber.fill(card.number);
    await this.expiry.fill(card.expiry);
    await this.cvc.fill(card.cvc);
    await this.payButton.click();
  }
}
