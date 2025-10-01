'use client'

import { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import Carousel from 'react-bootstrap/Carousel';

interface CarouselItem {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  image_url?: string;
}

interface CustomCarouselProps {
  items: CarouselItem[];
  itemType: 'articles' | 'products';
}

export default function CustomCarousel({ items, itemType }: CustomCarouselProps) {
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1200) {
        setItemsToShow(3);
      } else {
        setItemsToShow(5);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const groupedItems = [];
  for (let i = 0; i < items.length; i += itemsToShow) {
    groupedItems.push(items.slice(i, i + itemsToShow));
  }

  if (!items.length) {
    return null;
  }

  return (
    <Carousel interval={5000} indicators={false}>
      {groupedItems.map((group, idx) => (
        <Carousel.Item key={idx}>
          <Row>
            {group.map((item) => (
              <Col key={item.id}>
                <Link href={`/${itemType}/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Card style={{ marginBottom: '20px' }}>
                    {item.image_url && <Card.Img variant="top" src={item.image_url} />}
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text>{item.summary}</Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
