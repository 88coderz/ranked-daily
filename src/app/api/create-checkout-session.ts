import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

// Initialize Supabase with your URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    // 1. Fetch the product from your Supabase database
    const { data: product, error } = await supabase
      .from('products')
      .select('stripe_price_id')
      .eq('id', productId)
      .single();

    if (error || !product) {
      console.error('Error fetching product from Supabase:', error);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const { stripe_price_id } = product;

    // 2. Create the Stripe Checkout Session using the fetched price ID
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripe_price_id, // Use the fetched Stripe Price ID
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
    });

    // 3. Return the session ID to the client
    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
