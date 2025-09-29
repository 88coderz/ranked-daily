'use client';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'next/image';

const products = [
  { id: 1, name: 'Dog Treat', slug: 'dog-treat', description: 'A tasty treat for your best friend.', image: '/dog-treat.jpg' },
  { id: 2, name: 'Tool Box', slug: 'tool-box', description: 'All the tools you need.', image: '/tool-box.jpg' },
  { id: 3, name: 'Water Bottle', slug: 'water-bottle', description: 'Stay hydrated on the go.', image: '/water-bottle.jpg' },
];

export default function SuggestedProducts() {
  return (
    <div className="mt-5">
      <h2>Suggested Products</h2>
      <Carousel>
        {products.map((product, index) => (
          <Carousel.Item key={product.id}>
            <a href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer">
              <Image
                className="d-block w-100"
                src={product.image}
                alt={product.name}
                width={800}
                height={400}
                priority={index === 0}
                style={{ height: 'auto' }}
              />
              <Carousel.Caption>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </Carousel.Caption>
            </a>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
