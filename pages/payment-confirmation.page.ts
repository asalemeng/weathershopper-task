import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

// GET /confirmation returns 405 - this page only exists as the payment POST response,
// so there's no open() here.
export class PaymentConfirmationPage {
  private readonly message: Locator;

  constructor(page: Page) {
    // the app's two outcome headings are "PAYMENT SUCCESS" and "PAYMENT FAILED"
    this.message = page.getByText(/payment (success|failed)/i).first();
  }

  async assertPaymentSuccess(): Promise<void> {
    // Stripe's redirect back takes a while, hence the longer timeout on just this assertion
    await expect(this.message, 'no payment outcome shown').toBeVisible({
      timeout: 30_000,
    });
    await expect(this.message, 'the payment should succeed').toHaveText(/payment success/i);
  }
}
