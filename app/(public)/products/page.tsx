import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  Code, 
  Layers, 
  Box, 
  Cpu, 
  Zap, 
  ArrowRight, 
  Check,
  Star,
  Shield,
  Clock,
  Users,
  BarChart3,
  Search,
  Palette,
  ShoppingCart
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Premium Products | WPCodingPress',
  description: 'Premium WordPress plugins, Next.js templates, MCP servers, AI agents, and themes. Powerful tools to supercharge your web development projects.',
  keywords: 'wordpress plugins, nextjs templates, mcp servers, ai agents, wordpress themes, web development tools, saas products',
};

const categories = [
  {
    name: 'WordPress Plugins',
    description: 'Extend your WordPress site with powerful, professionally coded plugins.',
    icon: Code,
    href: '/products/plugins',
    color: 'from-blue-500 to-cyan-400',
    features: ['Performance Optimization', 'SEO Tools', 'Security Features', 'E-commerce Integration'],
  },
  {
    name: 'WordPress Themes',
    description: 'Beautiful, responsive themes built for speed and conversion.',
    icon: Palette,
    href: '/products/themes',
    color: 'from-green-500 to-emerald-400',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Easy Customization'],
  },
  {
    name: 'Next.js Templates',
    description: 'Production-ready templates to launch your projects faster.',
    icon: Layers,
    href: '/products/templates',
    color: 'from-violet-500 to-purple-400',
    features: ['TypeScript Ready', 'Server-Side Rendering', 'API Routes', 'Modern UI Components'],
  },
  {
    name: 'MCP Servers',
    description: 'Model Context Protocol servers for seamless AI integration.',
    icon: Cpu,
    href: '/products/mcp-servers',
    color: 'from-pink-500 to-rose-400',
    features: ['AI Integration', 'Real-time Processing', 'Secure APIs', 'Easy Setup'],
  },
  {
    name: 'AI Agents',
    description: 'Intelligent automation agents to streamline your workflows.',
    icon: Zap,
    href: '/products/ai-agents',
    color: 'from-orange-500 to-amber-400',
    features: ['Smart Automation', 'Natural Language', '24/7 Availability', 'Custom Training'],
  },
];

const benefits = [
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'All products undergo rigorous security audits and testing.',
  },
  {
    icon: Clock,
    title: 'Lifetime Updates',
    description: 'Get free updates forever with your purchase.',
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Get help from our team of WordPress and Next.js experts.',
  },
  {
    icon: BarChart3,
    title: 'Proven Results',
    description: 'Used by thousands of developers worldwide.',
  },
];

const typeConfig: Record<string, { label: string; icon: string; color: string; gradient: string; slug: string }> = {
  plugin: { label: 'WordPress Plugins', icon: '🔌', color: 'blue', gradient: 'from-blue-500 to-cyan-400', slug: 'plugins' },
  theme: { label: 'WordPress Themes', icon: '🎨', color: 'green', gradient: 'from-green-500 to-emerald-400', slug: 'themes' },
  template: { label: 'Next.js Templates', icon: '⚛️', color: 'violet', gradient: 'from-violet-500 to-purple-400', slug: 'templates' },
  mcp_server: { label: 'MCP Servers', icon: '🤖', color: 'pink', gradient: 'from-pink-500 to-rose-400', slug: 'mcp-servers' },
  ai_agent: { label: 'AI Agents', icon: '🧠', color: 'orange', gradient: 'from-orange-500 to-amber-400', slug: 'ai-agents' },
};

async function getAllActiveProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      take: 100,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 6,
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

function getUniqueTypes(products: any[]) {
  const typeCounts: Record<string, number> = {};
  products.forEach(p => {
    typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
  });
  const types = [...new Set(products.map(p => p.type))];
  return types.filter(t => t && typeConfig[t]).map(t => ({ ...typeConfig[t!], count: typeCounts[t] || 0 }));
}

export default async function ProductsPage() {
  const products = await getAllActiveProducts();
  const featuredProducts = await getFeaturedProducts();
  const productTypes = getUniqueTypes(products);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent" />
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-6">
            Premium Products
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Supercharge Your
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Web Projects
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Premium WordPress plugins, Next.js templates, MCP servers, AI agents, and themes 
            built by experts. Everything you need to build better websites, faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#products" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore Our Product Categories
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Whether you need WordPress solutions, Next.js templates, or AI-powered tools, we have you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productTypes.length > 0 ? productTypes.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className="group relative bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all hover:-translate-y-1"
              >
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/10 text-slate-300 text-xs font-medium rounded-full">
                    {cat.count} {cat.count === 1 ? 'product' : 'products'}
                  </span>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{cat.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-slate-400 mb-4">
                  Browse our {cat.label.toLowerCase()}
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-slate-500">
                    <Check className="w-4 h-4 text-green-400" />
                    Premium quality
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-500">
                    <Check className="w-4 h-4 text-green-400" />
                    Regular updates
                  </li>
                </ul>
                <div className="flex items-center gap-2 text-indigo-400 font-medium group-hover:gap-3 transition-all">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400">No products available yet.</p>
                <Link href="/admin/products" className="text-indigo-400 hover:text-indigo-300 mt-2 inline-block">
                  Add products in admin →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products - Only show if there are featured products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-b from-slate-900/50 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                  <span className="text-amber-400 text-sm font-medium">Featured</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Premium Products
                </h2>
                <p className="text-slate-400 mt-2">
                  Hand-picked products for maximum value
                </p>
              </div>
              <Link 
                href="/products"
                className="hidden md:inline-flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => {
                const type = product.type;
                const images = product.images as { featuredImage?: string } | null;
                const typeInfo = typeConfig[type];
                
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group relative bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                  >
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    </div>
                    
                    {/* Image */}
                    <div className="aspect-video bg-slate-700/50 relative overflow-hidden">
                      {images?.featuredImage ? (
                        <img 
                          src={images.featuredImage} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <span className="text-5xl">{typeInfo?.icon || '📦'}</span>
                      </div>
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 relative">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium px-2 py-1 bg-white/10 text-slate-300 rounded-full capitalize">
                          {typeInfo?.label || type}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                        {product.shortDesc || product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-bold ${product.price === 0 ? 'text-green-400' : 'text-white'}`}>
                          {product.price === 0 ? 'Free' : `$${product.price >= 100 ? (product.price / 100).toFixed(2) : product.price.toFixed(2)}`}
                        </span>
                        <span className="text-sm text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
                          View <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10 md:hidden">
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all"
              >
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose WPCodingPress?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We're committed to delivering the best products and support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div 
                key={benefit.title}
                className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 text-center hover:border-indigo-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-slate-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need Something Custom?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            We also offer custom development services. From WordPress development 
            to Next.js applications, we've got you covered.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link 
              href="/services/wordpress-to-nextjs"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all"
            >
              <Zap className="w-5 h-5" />
              WordPress to Next.js
            </Link>
            <Link 
              href="/services/web-applications"
              className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all"
            >
              <Code className="w-5 h-5" />
              Custom Web Apps
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Browse our products or contact us for custom solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#products" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}