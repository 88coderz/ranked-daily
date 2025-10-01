'use client'

import { Product } from '@/interfaces/product';
import CustomCarousel from './CustomCarousel';

export default function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <CustomCarousel items={products} itemType="products" />
  );
}
