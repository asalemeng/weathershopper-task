import type { Product, ProductRequirement } from '../models/product';

/** Every product whose name satisfies the rule, in page order. */
export function filterMatching(
  products: readonly Product[],
  requirement: ProductRequirement,
): Product[] {
  return products.filter((product) => requirement.pattern.test(product.name));
}

export function cheapestMatching(
  products: readonly Product[],
  requirement: ProductRequirement,
): Product {
  const candidates = filterMatching(products, requirement);
  if (candidates.length === 0) {
    throw new Error(
      `No product matched "${requirement.label}" (${requirement.pattern}). ` +
        `Products on the page: ${products.map((p) => p.name).join(' | ') || '<none>'}`,
    );
  }
  return candidates.reduce((cheapest, candidate) =>
    candidate.price < cheapest.price ? candidate : cheapest,
  );
}

/** Sum of the prices of the given products. */
export function sumPrices(products: readonly { price: number }[]): number {
  return products.reduce((total, product) => total + product.price, 0);
}
