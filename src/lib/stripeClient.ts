import { loadStripe } from '@stripe/stripe-js';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
	throw new Error('Stripe publishable key is missing. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.');
}
export const stripePromise = loadStripe(stripeKey);
