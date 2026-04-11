import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  Zap, 
  ArrowRight, 
  Check,
  Star
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Agents | WPCodingPress',
  description: 'Intelligent AI agents for automation, customer service, and business workflows. Build smart automation for your business.',
  keywords: 'ai agents, artificial intelligence, automation, ai assistants, chatbots, smart automation',
};

async function getProductsByType(type: string) {
  try {
    return await prisma.product.findMany({
      where: { type, isActive: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function AIAgentsPage() {
  const products = await getProductsByType('ai_agent');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium mb-6">
            AI Agents
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Intelligent AI Agents</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Powerful AI agents that work 24/7 for your business. Automate customer support, 
            lead generation, content creation, and more.
          </p>
        </div>
      </section>

      {/* Products */}
      {products.length === 0 ? (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-12">
              <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">No AI Agents Available Yet</h2>
              <p className="text-slate-400 text-lg mb-8">We're building powerful AI agents for you. Check back soon!</p>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/20 text-orange-400 rounded-xl hover:bg-orange-500/30 transition-colors"
              >
                Browse All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const images = product.images as { featuredImage?: string } | null;
                const featuredImage = images?.featuredImage;
                
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-orange-500/50 hover:bg-slate-800/70 transition-all"
                  >
                    <div className="aspect-video bg-slate-700/50 relative overflow-hidden">
                      {featuredImage ? (
                        <img 
                          src={featuredImage} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Zap className="w-16 h-16 text-slate-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {product.isFeatured && (
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 mb-4 line-clamp-2">{product.shortDesc || product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${product.price === 0 ? 'text-green-400' : 'text-white'}`}>
                          {product.price === 0 ? 'Free' : `$${product.price >= 100 ? (product.price / 100).toFixed(2) : product.price.toFixed(2)}`}
                        </span>
                        <span className="text-sm text-orange-400 group-hover:text-orange-300">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features Info */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Agent Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                '24/7 availability',
                'Natural language processing',
                'Custom training',
                'Multi-platform integration',
                'Lead qualification',
                'Analytics dashboard'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-orange-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/products" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            All Products
          </Link>
          <Link href="/products/themes" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            WordPress Themes
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}