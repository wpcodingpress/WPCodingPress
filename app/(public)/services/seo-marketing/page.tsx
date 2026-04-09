import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SEO & Digital Marketing | WPCodingPress',
  description: 'Advanced SEO strategies and digital marketing to grow your online presence and drive more conversions.',
  keywords: 'seo, digital marketing, search engine optimization, content marketing, link building',
};

const features = [
  { title: 'Keyword Research', description: 'Find the right keywords to rank for.', icon: '🔑' },
  { title: 'On-Page SEO', description: 'Optimize every page for search engines.', icon: '📄' },
  { title: 'Technical SEO', description: 'Site speed, schema, and architecture.', icon: '⚙️' },
  { title: 'Content Strategy', description: 'Content that attracts and converts.', icon: '📝' },
  { title: 'Link Building', description: 'Quality backlinks that boost authority.', icon: '🔗' },
  { title: 'Analytics & Reports', description: 'Track progress with detailed reports.', icon: '📊' },
];

const pricingTiers = [
  { name: 'Basic', price: '$150/mo', features: ['Keyword Research', 'On-page SEO', 'Google Analytics', 'Monthly Report', '5 Keywords'] },
  { name: 'Standard', price: '$300/mo', features: ['Technical SEO', 'Content Strategy', 'Link Building', 'Social Media', '20 Keywords'], popular: true },
  { name: 'Premium', price: '$500/mo', features: ['Full SEO Audit', 'Competitor Analysis', 'PR & Outreach', 'Conversion Optimization', 'Unlimited Keywords'] },
];

export default function SEOMarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium mb-6">
            SEO & Marketing
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Dominate Search
            <span className="block bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Rankings
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Advanced SEO strategies that drive organic traffic and grow your business.
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
            <h2 className="text-4xl font-bold text-white mb-4">Monthly Plans</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`relative bg-slate-800 border rounded-2xl p-8 ${tier.popular ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-slate-700'}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 rounded-full text-white text-sm font-semibold">Popular</div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-white mb-6">{tier.price}</div>
                <ul className="space-y-2 mb-8">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="block text-center py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors">
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/services/woocommerce-stores" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            WooCommerce Stores
          </Link>
          <Link href="/services/web-applications" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            Web Applications
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
