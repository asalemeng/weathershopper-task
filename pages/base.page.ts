import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(
    protected readonly page: Page,
    /** Path relative to `baseURL`, e.g. "/moisturizer". */
    private readonly path: string,
  ) {}

  async open(): Promise<void> {
    await this.page.goto(this.path);
    await this.expectLoaded();
  }

  abstract expectLoaded(): Promise<void>;
}
