'use client'

import { Card } from 'react-bootstrap';
import { Article } from '@/interfaces/article';
import Carousel from 'react-bootstrap/Carousel';

export default function ArticleCarousel({ articles }: { articles: Article[] }) {
  return (
    <Carousel>
      {articles.map((article) => (
        <Carousel.Item key={article.id}>
          <a href={`https://www.rankeddaily.com/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} target="_blank" rel="noopener noreferrer">
            <Card>
              <Card.Body>
                <Card.Title>{article.title || 'Untitled Article'}</Card.Title>
                <Card.Text>
                  {article.summary || 'No summary available.'}
                </Card.Text>
              </Card.Body>
            </Card>
          </a>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}