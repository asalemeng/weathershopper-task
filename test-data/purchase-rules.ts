import type { ProductRequirement } from '../models/product';

export const PURCHASE_RULES = {
  aloe: {
    label: 'least expensive moisturizer containing aloe',
    category: 'moisturizer',
    pattern: /\baloe\b/i,
  },
  almond: {
    label: 'least expensive moisturizer containing almond',
    category: 'moisturizer',
    pattern: /\balmond\b/i,
  },
  spf50: {
    label: 'least expensive sunscreen with SPF-50',
    category: 'sunscreen',
    pattern: /\bspf[-\s]?50\b/i,
  },
  spf30: {
    label: 'least expensive sunscreen with SPF-30',
    category: 'sunscreen',
    pattern: /\bspf[-\s]?30\b/i,
  },
} as const satisfies Record<string, ProductRequirement>;

/** The rules grouped by the department that fulfils them. */
export const RULES_BY_CATEGORY = {
  moisturizer: [PURCHASE_RULES.aloe, PURCHASE_RULES.almond],
  sunscreen: [PURCHASE_RULES.spf50, PURCHASE_RULES.spf30],
} as const;
