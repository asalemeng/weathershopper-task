import type { Product } from '../models/product';

export const CATALOGUES = {
  //a real moisturizer page: three aloe products, three almond ones.
  moisturizers: [
    { name: 'Tigran Aloe Isolani', price: 215, index: 0 },
    { name: 'Vassily Aloe Attack', price: 199, index: 1 },
    { name: 'Emmanuel Aloe Vera Beauty Gel', price: 299, index: 2 },
    { name: 'Mikhail Natural Almond Moisturizer', price: 220, index: 3 },
    { name: 'Mikhail Almond and Talc', price: 353, index: 4 },
    { name: 'Alexander Almond & Honey Moisturiser', price: 360, index: 5 },
  ],

  // Near-miss SPF values a careless pattern would match
  spfLookalikes: [
    { name: 'Cheap SPF-5 Sunscreen', price: 10, index: 0 },
    { name: 'Cheap SPF-500 Sunscreen', price: 20, index: 1 },
    { name: 'Anatoly Ultra Sunblock SPF-50', price: 289, index: 2 },
  ],

  mixedCaseSpf: [
    { name: 'Vishy La Shield Sunscreen spf-30', price: 195, index: 0 },
    { name: 'Paul Magnificient SPF-30', price: 121, index: 1 },
  ],

  tiedOnPrice: [
    { name: 'Aloe One', price: 100, index: 0 },
    { name: 'Aloe Two', price: 100, index: 1 },
  ],

  //nothing here satisfie any rule
  noMatches: [{ name: 'Plain Cream', price: 10, index: 0 }],
} as const satisfies Record<string, readonly Product[]>;
