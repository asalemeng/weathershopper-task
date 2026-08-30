import { test } from '../../fixtures/test';
import { RULES_BY_CATEGORY } from '../../test-data/purchase-rules';
import { CHECKOUT_DATA } from '../../test-data/checkout.data';

// The full journey in one test: splitting it up would just repeat the setup or
// chain the tests together. The individual rules have their own tests.

// Scoped to this journey only:
// - retries: the cart page tooltip says "the payment screen will error 5% of
//   the time by design"; a real bug still fails all 3 attempts.
// - timeout: ~15s of shopping happens before the payment wait of up to 30s,
//   so the default 30s budget is not enough here. Other specs keep it.
test.describe.configure({ retries: 2, timeout: 60_000 });

test(
  'buys what the weather requires and pays by card',
  { tag: ['@ui', '@e2e', '@smoke'] },
  async ({ poManager }) => {
    const homePage = poManager.getHomePage();

    const category = await test.step('pick the department the temperature calls for', async () => {
      await homePage.open();
      const department = await homePage.requireDepartment();
      test.info().annotations.push({
        type: 'temperature',
        description: `${await homePage.readTemperature()} C -> ${department}`,
      });
      return department;
    });

    await homePage.openDepartment(category);

    const listPage = poManager.getProductListPage(category);
    await listPage.expectLoaded();

    const purchased = await test.step(`buy the two required ${category}s`, async () =>
      listPage.addCheapestMatchingAll(RULES_BY_CATEGORY[category]));

    await listPage.openCart();

    const cartPage = poManager.getCartPage();

    await test.step('the cart holds the right products at the right total', async () => {
      await cartPage.expectLoaded();
      await cartPage.assertContainsExactly(purchased);
      await cartPage.assertTotalEqualsSumOf(purchased);
    });

    await test.step('pay with the Stripe test card', async () => {
      await cartPage.payWithCard();
      const checkout = poManager.getStripeCheckoutPage();
      await checkout.expectLoaded();
      await checkout.pay(CHECKOUT_DATA.card);
    });

    await poManager.getPaymentConfirmationPage().assertPaymentSuccess();
  },
);
