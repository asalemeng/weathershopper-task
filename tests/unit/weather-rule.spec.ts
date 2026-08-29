import { test, expect } from '@playwright/test';
import { decidePurchase, type ShoppingDecision } from '../../models/weather';

const cases: ReadonlyArray<[number, ShoppingDecision]> = [
  [-5, 'moisturizer'],
  [18, 'moisturizer'],
  [19, 'none'], // boundary: the rule says "less than 19"
  [27, 'none'],
  [34, 'none'], // boundary: the rule says "greater than 34"
  [35, 'sunscreen'],
  [49, 'sunscreen'],
];

for (const [temperature, expected] of cases) {
  test(`${temperature} C -> ${expected}`, () => {
    expect(decidePurchase(temperature)).toBe(expected);
  });
}

test('rejects a temperature that could not be read', () => {
  expect(() => decidePurchase(Number.NaN)).toThrow(/not a finite number/i);
});
