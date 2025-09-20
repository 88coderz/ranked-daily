import React, { useState, useEffect } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial render

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0); // Reset index when articles change
  }, [articles]);


  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? articles.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === articles.length - 1 ? 0 : prevIndex + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext();
    }

    if (touchStart - touchEnd < -50) {
      handlePrev();
    }
  };

  if (!articles || articles.length === 0) {
    return <p>No articles found for the selected categories.</p>;
  }

  const currentArticle = articles[currentIndex];

  const articleCard = (
    <Card>
      <Card.Body>
        <Card.Title>{currentArticle.title}</Card.Title>
        <Card.Text>{currentArticle.summary}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Button variant="success" size="sm" onClick={() => onUpvote(currentArticle.id)}>
              ▲ {currentArticle.upvotes}
            </Button>{' '}
            <Button variant="danger" size="sm" onClick={() => onDownvote(currentArticle.id)}>
              ▼ {currentArticle.downvotes}
            </Button>
          </div>
          <div>
            <Button variant={currentArticle.favorited ? 'warning' : 'outline-warning'} size="sm" onClick={() => onFavorite(currentArticle.id)}>
              ★
            </Button>{' '}
            <Button variant="outline-secondary" size="sm" onClick={() => onArchive(currentArticle.id)}>
              Archive
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div>
      {isMobile ? (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {articleCard}
        </div>
      ) : (
        <Row className="align-items-center">
          <Col xs="auto">
            <Button onClick={handlePrev}>&lt;</Button>
          </Col>
          <Col>{articleCard}</Col>
          <Col xs="auto">
            <Button onClick={handleNext}>&gt;</Button>
          </Col>
        </Row>
      )}
    </div>
  );
}