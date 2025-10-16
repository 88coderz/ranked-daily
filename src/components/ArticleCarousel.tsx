'use client'

import { Article } from '@/interfaces/article';
import CustomCarousel from './CustomCarousel';

export default function ArticleCarousel({ articles }: { articles: Article[] }) {
  return (
    <CustomCarousel items={articles} itemType="articles" />
  );
}
