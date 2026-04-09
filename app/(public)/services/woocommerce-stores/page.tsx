import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'WooCommerce Stores | WPCodingPress',
  description: 'Full-featured e-commerce solutions with seamless payment integration, inventory management, and order tracking.',
  keywords: 'woocommerce, woocommerce store, ecommerce, online store, shopify alternative',
};

const features = [
  { title: 'Payment Gateway Integration', description: 'Stripe, PayPal, and 50+ payment methods.', icon: '💳' },
  { title: 'Inventory Management', description: 'Track stock, variations, and product options.', icon: '📦' },
  { title: 'Order Tracking', description: 'Real-time order status and shipping updates.', icon: '🚚' },
  { title: 'Mobile Commerce', description: 'Fully responsive shopping experience.', icon: '📱' },
  { title: 'Marketing Tools', description: 'Coupons, discounts, and email campaigns.', icon: '🎁' },
  { title: 'Analytics Dashboard', description: 'Sales reports and customer insights.', icon: '📊' },
];

const pricingTiers = [
  { name: 'Basic', price: '$250', timeline: '7-10 days', features: ['Up to 20 Products', 'Payment Gateway', 'Cart & Checkout', 'Mobile Responsive', 'Basic Reports'] },
  { name: 'Standard', price: '$450', timeline: '14-21 days', features: ['Up to 100 Products', 'Inventory System', 'Shipping Options', 'Coupons & Discounts', 'Email Marketing'], popular: true },
  { name: 'Premium', price: '$700', timeline: '30+ days', features: ['Unlimited Products', 'Subscriptions', 'Multi-vendor', 'Advanced Analytics', 'API Integration'] },
];

export default function WooCommerceStoresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-6">
            WooCommerce
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Powerful
            <span className="block bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              WooCommerce Stores
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Full-featured e-commerce solutions that drive sales. 
            From small shops to enterprise marketplaces.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Pricing Plans</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`relative bg-slate-800 border rounded-2xl p-8 ${tier.popular ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-slate-700'}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 rounded-full text-white text-sm font-semibold">Popular</div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-white mb-2">{tier.price}</div>
                <p className="text-slate-400 text-sm mb-6">{tier.timeline}</p>
                <ul className="space-y-2 mb-8">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="block text-center py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/services/elementor-pro-design" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Elementor Pro Design
          </Link>
          <Link href="/services/seo-marketing" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            SEO & Marketing
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
