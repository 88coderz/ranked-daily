import { NextRequest } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(req: NextRequest) {
  const { productId } = await req.json();

  // Replace with your product lookup logic
  const line_items = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Demo Product',
        },
        unit_amount: 2000, // $20.00
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
  });

  return new Response(JSON.stringify({ sessionId: session.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
