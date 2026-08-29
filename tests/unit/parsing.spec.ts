import { test, expect } from '@playwright/test';
import { parsePrice, parseTemperature } from '../../utils/parsing';

test('reads a price whether or not the currency is shown', () => {
  // Both formats appear on the same page of the real application.
  expect(parsePrice('Price: Rs. 215')).toBe(215);
  expect(parsePrice('Price: 220')).toBe(220);
  expect(parsePrice(' 1,250 ')).toBe(1250);
});

test('reads a temperature in either unit the app renders', () => {
  expect(parseTemperature('43 °C')).toBe(43); // summer branch
  expect(parseTemperature('12 ℃')).toBe(12); // winter branch, different symbol
  expect(parseTemperature('-4 °C')).toBe(-4);
});

test('fails loudly instead of returning NaN', () => {
  expect(() => parsePrice('Price: unavailable')).toThrow(/could not read a price/i);
});
