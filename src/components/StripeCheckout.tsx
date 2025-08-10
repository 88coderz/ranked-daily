import React from 'react';
import { Button } from 'react-bootstrap';

interface Props {
  productId: string;
  onCheckout: () => void;
}

export default function StripeCheckout({ productId, onCheckout }: Props) {
  return (
    <Button variant="success" onClick={onCheckout}>
      Buy Now
    </Button>
  );
}
