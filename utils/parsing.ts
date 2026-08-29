const NUMBER_PATTERN = /-?\d+(?:[.,]\d+)?/;

function extractNumber(raw: string, what: string): number {
  const match = NUMBER_PATTERN.exec(raw.replace(/,(?=\d{3}\b)/g, ''));
  if (!match) {
    throw new Error(`Could not read a ${what} from ${JSON.stringify(raw)}`);
  }
  const value = Number(match[0].replace(',', '.'));
  if (!Number.isFinite(value)) {
    throw new Error(`Parsed a non-finite ${what} from ${JSON.stringify(raw)}`);
  }
  return value;
}

//"Price: Rs. 215" -> 215, and "Price: 220" -> 220
export function parsePrice(raw: string): number {
  const price = extractNumber(raw, 'price');
  if (price < 0) throw new Error(`Negative price parsed from ${JSON.stringify(raw)}`);
  return price;
}

//"43 °C" -> 43, "12 ℃" -> 12, "-4 °C" -> -4
export function parseTemperature(raw: string): number {
  return extractNumber(raw, 'temperature');
}

/** "Total: Rupees 419" -> 419 */
export function parseTotal(raw: string): number {
  return extractNumber(raw, 'total');
}
