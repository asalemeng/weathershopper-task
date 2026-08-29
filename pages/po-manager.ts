import type { Page } from '@playwright/test';
import { HomePage, type ProductCategory } from './home.page';
import { ProductListPage } from './product-list.page';
import { CartPage } from './cart.page';
import { StripeCheckoutPage } from './stripe-checkout.page';
import { PaymentConfirmationPage } from './payment-confirmation.page';

// Single place tests get page objects from. Instances are created lazily and cached per test.
export class PageObjectManager {
  private homePage?: HomePage;
  private readonly productListPages = new Map<ProductCategory, ProductListPage>();
  private cartPage?: CartPage;
  private stripeCheckoutPage?: StripeCheckoutPage;
  private confirmationPage?: PaymentConfirmationPage;
  constructor(private readonly page: Page) {}

  getHomePage(): HomePage {
    return (this.homePage ??= new HomePage(this.page));
  }

  getProductListPage(category: ProductCategory): ProductListPage {
    let listPage = this.productListPages.get(category);
    if (!listPage) {
      listPage = new ProductListPage(this.page, category);
      this.productListPages.set(category, listPage);
    }
    return listPage;
  }

  getMoisturizerPage(): ProductListPage {
    return this.getProductListPage('moisturizer');
  }

  getSunscreenPage(): ProductListPage {
    return this.getProductListPage('sunscreen');
  }

  getCartPage(): CartPage {
    return (this.cartPage ??= new CartPage(this.page));
  }

  getStripeCheckoutPage(): StripeCheckoutPage {
    return (this.stripeCheckoutPage ??= new StripeCheckoutPage(this.page));
  }

  getPaymentConfirmationPage(): PaymentConfirmationPage {
    return (this.confirmationPage ??= new PaymentConfirmationPage(this.page));
  }
}
