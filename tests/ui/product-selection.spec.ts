import { test, expect } from '../../fixtures/test';
import { PURCHASE_RULES } from '../../test-data/purchase-rules';
import { cheapestMatching, filterMatching } from '../../utils/selection';

for (const requirement of Object.values(PURCHASE_RULES)) {
  test(
    `the app offers the ${requirement.label}`,
    { tag: ['@ui', '@regression'] },
    async ({ poManager }) => {
      const listPage = poManager.getProductListPage(requirement.category);
      await listPage.open();

      const products = await listPage.listProducts();
      const matches = filterMatching(products, requirement);

      expect(
        matches.length,
        `no product matches ${requirement.pattern}. ` +
          `Page offered: ${products.map((p) => p.name).join(' | ')}`,
      ).toBeGreaterThan(0);

      // Nothing matching the rule may be cheaper than the product we would pick.
      const chosen = cheapestMatching(products, requirement);
      for (const candidate of matches) {
        expect(
          candidate.price,
          `"${candidate.name}" is cheaper than the chosen "${chosen.name}"`,
        ).toBeGreaterThanOrEqual(chosen.price);
      }
    },
  );
}
