import type { ProductCategory } from '../pages/home.page';

export interface Product {
  readonly name: string;
  readonly price: number;
  readonly index: number;
}

export interface ProductRequirement {
  readonly label: string;
  readonly category: ProductCategory;
  readonly pattern: RegExp;
}
