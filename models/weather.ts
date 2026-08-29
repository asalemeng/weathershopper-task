export type ShoppingDecision = 'moisturizer' | 'sunscreen' | 'none';

/** Thresholds taken verbatim from the tooltip on the application's home page. */
export const TEMPERATURE_RULES = {
  // below 19
  moisturizerBelow: 19,
  // above 34
  sunscreenAbove: 34,
} as const;

export function decidePurchase(temperatureCelsius: number): ShoppingDecision {
  if (!Number.isFinite(temperatureCelsius)) {
    throw new Error(`Temperature is not a finite number: ${temperatureCelsius}`);
  }
  if (temperatureCelsius < TEMPERATURE_RULES.moisturizerBelow) return 'moisturizer';
  if (temperatureCelsius > TEMPERATURE_RULES.sunscreenAbove) return 'sunscreen';
  return 'none';
}
