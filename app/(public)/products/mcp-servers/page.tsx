import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  Cpu, 
  ArrowRight, 
  Check,
  Star
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'MCP Servers | WPCodingPress',
  description: 'Model Context Protocol servers for seamless AI integration. Connect AI to databases, APIs, filesystems, and more.',
  keywords: 'mcp servers, model context protocol, ai integration, ai tools, machine learning servers',
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

export default async function MCPServersPage() {
  const products = await getProductsByType('mcp_server');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-300 text-sm font-medium mb-6">
            MCP Servers
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Model Context Protocol Servers</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Connect AI models to databases, APIs, filesystems, and more. 
            Build powerful AI-powered applications with our MCP servers.
          </p>
        </div>
      </section>

      {/* Products */}
      {products.length === 0 ? (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-12">
              <div className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-6">
                <Cpu className="w-10 h-10 text-pink-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">No MCP Servers Available Yet</h2>
              <p className="text-slate-400 text-lg mb-8">We're building powerful AI integration tools. Check back soon!</p>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500/20 text-pink-400 rounded-xl hover:bg-pink-500/30 transition-colors"
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
                    className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-pink-500/50 hover:bg-slate-800/70 transition-all"
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
                          <Cpu className="w-16 h-16 text-slate-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {product.isFeatured && (
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 mb-4 line-clamp-2">{product.shortDesc || product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${product.price === 0 ? 'text-green-400' : 'text-white'}`}>
                          {product.price === 0 ? 'Free' : `$${product.price >= 100 ? (product.price / 100).toFixed(2) : product.price.toFixed(2)}`}
                        </span>
                        <span className="text-sm text-pink-400 group-hover:text-pink-300">
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
            <h2 className="text-2xl font-bold text-white mb-6">Key Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Database connectivity',
                'API integration',
                'File system access',
                'Secure authentication',
                'Real-time processing',
                'Easy configuration'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-slate-300">
                  <Check className="w-5 h-5 text-pink-400" />
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
          <Link href="/products/ai-agents" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            AI Agents
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}