import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Services | WPCodingPress',
  description: 'Expert web development services: WordPress to Next.js conversion, Elementor design, WooCommerce stores, SEO, web apps, cloud DevOps, and domain hosting.',
  keywords: 'web development services, wordpress to nextjs, elementor design, woocommerce, seo marketing, web applications',
};

const iconMap: Record<string, string> = {
  code: '⚡',
  palette: '🎨',
  'shopping-cart': '🛒',
  zap: '📈',
  globe: '🌐',
  settings: '☁️',
};

const colorMap: Record<string, string> = {
  code: 'from-indigo-500 to-purple-500',
  palette: 'from-pink-500 to-rose-500',
  'shopping-cart': 'from-green-500 to-emerald-500',
  zap: 'from-orange-500 to-amber-500',
  globe: 'from-blue-500 to-cyan-500',
  settings: 'from-slate-500 to-gray-500',
};

async function getServices() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-6">
            Our Services
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Expert Web
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Development
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            From WordPress migrations to custom web applications, we deliver 
            high-performance solutions that drive results.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-indigo-500/50 transition-all hover:-translate-y-1"
              >
                {index === 0 && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorMap[service.icon] || 'from-indigo-500 to-purple-500'} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {iconMap[service.icon] || '⚡'}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {service.name}
                </h3>
                <p className="text-slate-400 mb-4">
                  {service.description}
                </p>
                <div className="flex items-center gap-2 text-indigo-400 group-hover:gap-4 transition-all">
                  <span className="font-medium">Learn More</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Contact us for a free consultation and let's build something amazing together.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all"
          >
            Get Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
