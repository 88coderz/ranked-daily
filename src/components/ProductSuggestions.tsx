import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

export interface Product {
  id: string;
  name: string;
  description: string;
  link: string;
}

interface Props {
  products: Product[];
}

export default function ProductSuggestions({ products }: Props) {
  if (!products.length) return null;
  return (
    <div className="mt-4">
      <h4>Suggested Products</h4>
      <Row>
        {products.map((product) => (
          <Col key={product.id} md={6} lg={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <a href={product.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  View Product
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
