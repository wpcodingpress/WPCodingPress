import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export const stripe = {
  get instance() {
    if (!stripeInstance) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error('STRIPE_SECRET_KEY is not set');
      }
      stripeInstance = new Stripe(key, {
        apiVersion: '2026-03-25.dahlia' as any,
      });
    }
    return stripeInstance;
  },
};

export const getStripeInstance = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return stripe.instance;
};
