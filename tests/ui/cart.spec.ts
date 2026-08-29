import { test } from '../../fixtures/test';
import { RULES_BY_CATEGORY } from '../../test-data/purchase-rules';

test(
  'cart holds the two required moisturizers and totals them correctly',
  { tag: ['@ui', '@regression'] },
  async ({ poManager }) => {
    const listPage = poManager.getMoisturizerPage();
    await listPage.open();

    const purchased = await listPage.addCheapestMatchingAll(RULES_BY_CATEGORY.moisturizer);
    await listPage.openCart();

    const cartPage = poManager.getCartPage();
    await cartPage.expectLoaded();
    await cartPage.assertContainsExactly(purchased);
    await cartPage.assertTotalEqualsSumOf(purchased);
  },
);

test(
  'cart holds the two required sunscreens and totals them correctly',
  { tag: ['@ui', '@regression'] },
  async ({ poManager }) => {
    const listPage = poManager.getSunscreenPage();
    await listPage.open();

    const purchased = await listPage.addCheapestMatchingAll(RULES_BY_CATEGORY.sunscreen);
    await listPage.openCart();

    const cartPage = poManager.getCartPage();
    await cartPage.expectLoaded();
    await cartPage.assertContainsExactly(purchased);
    await cartPage.assertTotalEqualsSumOf(purchased);
  },
);
