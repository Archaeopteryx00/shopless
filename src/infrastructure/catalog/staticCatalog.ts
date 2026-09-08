import productsData from '@/data/products.json';
import { Product, ProductCategory } from '@/domain/models/Product';

export class StaticCatalogService {
  private products: Product[] = productsData as Product[];

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  getProductsByCategory(category: ProductCategory | 'All'): Product[] {
    if (category === 'All') return this.products;
    return this.products.filter((p) => p.category === category);
  }

  searchProducts(query: string, category: ProductCategory | 'All' = 'All'): Product[] {
    const q = query.toLowerCase().trim();
    let filtered = this.products;

    if (category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (!q) return filtered;

    return filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  getDeals(limit = 8): Product[] {
    return this.products
      .filter((p) => p.originalPrice && p.originalPrice > p.price)
      .slice(0, limit);
  }

  getPopularProducts(limit = 8): Product[] {
    return [...this.products]
      .sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating)
      .slice(0, limit);
  }

  getForYouProducts(limit = 12): Product[] {
    // Weighted recommendation logic matching PRD Section 16
    const popular = this.getPopularProducts(6);
    const weird = this.products.filter((p) => p.tags.includes('weird'));
    const impulsive = this.products.filter((p) => p.tags.includes('impulsive'));
    const novelty = this.products.filter((p) => p.tags.includes('novelty'));

    const mixed = [...popular, ...weird, ...impulsive, ...novelty];
    const uniqueMap = new Map<string, Product>();
    mixed.forEach((p) => uniqueMap.set(p.id, p));

    const result = Array.from(uniqueMap.values());
    return result.slice(0, limit);
  }
}

export const staticCatalog = new StaticCatalogService();
