import { test, expect } from '@playwright/test';
import { cheapestMatching, filterMatching, sumPrices } from '../../utils/selection';
import { PURCHASE_RULES } from '../../test-data/purchase-rules';
import { CATALOGUES } from '../../test-data/product-catalogues';

test('picks the cheapest product matching the rule', () => {
  expect(cheapestMatching(CATALOGUES.moisturizers, PURCHASE_RULES.aloe).name).toBe(
    'Vassily Aloe Attack',
  );
  expect(cheapestMatching(CATALOGUES.moisturizers, PURCHASE_RULES.almond).name).toBe(
    'Mikhail Natural Almond Moisturizer',
  );
});

test('ignores products that do not match the rule', () => {
  expect(filterMatching(CATALOGUES.moisturizers, PURCHASE_RULES.almond)).toHaveLength(3);
});

test('SPF-50 must not match SPF-500 or SPF-5', () => {
  expect(cheapestMatching(CATALOGUES.spfLookalikes, PURCHASE_RULES.spf50).name).toBe(
    'Anatoly Ultra Sunblock SPF-50',
  );
});

test('lower-case spf-30 still matches - the app renders both cases', () => {
  expect(cheapestMatching(CATALOGUES.mixedCaseSpf, PURCHASE_RULES.spf30).name).toBe(
    'Paul Magnificient SPF-30',
  );
});

test('breaks price ties by page order, so runs are reproducible', () => {
  expect(cheapestMatching(CATALOGUES.tiedOnPrice, PURCHASE_RULES.aloe).name).toBe('Aloe One');
});

test('reports the whole catalogue when nothing matches', () => {
  expect(() => cheapestMatching(CATALOGUES.noMatches, PURCHASE_RULES.aloe)).toThrow(
    /no product matched.*Plain Cream/is,
  );
});

test('sums prices for the expected cart total', () => {
  expect(sumPrices([{ price: 199 }, { price: 220 }])).toBe(419);
});
