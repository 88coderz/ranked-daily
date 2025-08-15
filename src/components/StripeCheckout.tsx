import React from 'react';
import { Button } from 'react-bootstrap';

interface Props {
  productId: string;
  onCheckout: (productId: string) => void;
}

export default function StripeCheckout({ productId, onCheckout }: Props) {
  const handleClick = () => {
    if (productId && productId.trim()) {
      onCheckout(productId);
    } else {
      alert('No product selected for checkout.');
    }
  };

  return (
    <Button variant="success" onClick={handleClick}>
      Buy Now
    </Button>
  );
}
