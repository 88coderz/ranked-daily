'use client'

import { Card } from 'react-bootstrap';
import { Article } from '@/interfaces/article';
import Carousel from 'react-bootstrap/Carousel';
import Link from 'next/link';

export default function ArticleCarousel({ articles }: { articles: Article[] }) {
  return (
    <Carousel>
      {articles.map((article) => (
        <Carousel.Item key={article.id}>
          <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card>
              <Card.Body>
                <Card.Title>{article.title || 'Untitled Article'}</Card.Title>
                <Card.Text>
                  {article.summary || 'No summary available.'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}