export type ProductCategory =
  | 'Tech'
  | 'Books & Learning'
  | 'Lifestyle'
  | 'Fashion'
  | 'Hobbies';

export type ProductTag =
  | 'desirable'
  | 'useful'
  | 'impulsive'
  | 'weird'
  | 'cheap'
  | 'premium'
  | 'novelty';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  tags: ProductTag[];
}
