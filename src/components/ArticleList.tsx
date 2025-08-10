import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

export interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  upvotes: number;
  downvotes: number;
  favorited: boolean;
}

interface Props {
  articles: Article[];
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onFavorite: (id: string) => void;
  onArchive: (id: string) => void;
}

export default function ArticleList({ articles, onUpvote, onDownvote, onFavorite, onArchive }: Props) {
  return (
    <Row>
      {articles.map((article) => (
        <Col key={article.id} md={6} lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>{article.title}</Card.Title>
              <Card.Text>{article.summary}</Card.Text>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Button variant="success" size="sm" onClick={() => onUpvote(article.id)}>
                    ▲ {article.upvotes}
                  </Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => onDownvote(article.id)}>
                    ▼ {article.downvotes}
                  </Button>
                </div>
                <div>
                  <Button variant={article.favorited ? 'warning' : 'outline-warning'} size="sm" onClick={() => onFavorite(article.id)}>
                    ★
                  </Button>{' '}
                  <Button variant="outline-secondary" size="sm" onClick={() => onArchive(article.id)}>
                    Archive
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
