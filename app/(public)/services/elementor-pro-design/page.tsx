import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Elementor Pro Design | WPCodingPress',
  description: 'Stunning, conversion-focused designs using Elementor page builder. Pixel-perfect templates tailored to your brand identity.',
  keywords: 'elementor pro, elementor design, wordpress design, page builder, website design',
};

const features = [
  { title: 'Pixel-Perfect Design', description: 'Every pixel aligned to create visually stunning layouts.', icon: '🎯' },
  { title: 'Mobile Responsive', description: 'Perfect on every device - desktop, tablet, and mobile.', icon: '📱' },
  { title: 'Conversion Optimized', description: 'Designs crafted to maximize your conversion rates.', icon: '📈' },
  { title: 'Fast Loading', description: 'Lightweight code for lightning-fast page speeds.', icon: '⚡' },
  { title: 'SEO Friendly', description: 'Clean HTML structure for better search rankings.', icon: '🔍' },
  { title: 'Easy to Edit', description: 'Simple to update content without coding knowledge.', icon: '✏️' },
];

const pricingTiers = [
  { name: 'Basic', price: '$100', timeline: '3-5 days', features: ['5 Sections', 'Custom Header/Footer', 'Mobile Responsive', 'Contact Form', 'Basic Animations'] },
  { name: 'Standard', price: '$200', timeline: '7-10 days', features: ['10 Sections', 'Popups & Forms', 'WooCommerce Elements', 'Custom Widgets', 'Advanced Animations'], popular: true },
  { name: 'Premium', price: '$350', timeline: '14-21 days', features: ['Full Website', 'Custom CSS/JS', 'Dynamic Content', 'Template Library', 'Priority Support'] },
];

export default function ElementorProDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-300 text-sm font-medium mb-6">
            Elementor Pro
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Stunning
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Elementor Designs
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Professional Elementor Pro designs that convert visitors into customers. 
            Pixel-perfect, responsive, and optimized for performance.
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
              <div key={index} className={`relative bg-slate-800 border rounded-2xl p-8 ${tier.popular ? 'border-pink-500 shadow-lg shadow-pink-500/20' : 'border-slate-700'}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-pink-500 rounded-full text-white text-sm font-semibold">Popular</div>
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
                <Link href="/contact" className="block text-center py-3 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-600 transition-colors">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/services/wordpress-to-nextjs" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            WordPress to Next.js
          </Link>
          <Link href="/services/woocommerce-stores" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            WooCommerce Stores
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
