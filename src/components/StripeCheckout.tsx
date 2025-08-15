import React from 'react';
import { Button } from 'react-bootstrap';

interface Props {
  productId: string;
  onCheckout: (productId: string) => void;
}

export default function StripeCheckout({ productId, onCheckout }: Props) {
  // Use productId prop in the checkout handler
  const handleClick = () => {
    if (productId) {
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
