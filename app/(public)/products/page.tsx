import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Products | WPCodingPress',
  description: 'Premium WordPress plugins, Next.js templates, MCP servers, AI agents, and themes. Powerful tools to supercharge your web projects.',
  keywords: 'wordpress plugins, nextjs templates, mcp servers, ai agents, wordpress themes, web development tools',
};

const products = [
  {
    name: 'WordPress Plugins',
    description: 'Premium plugins to extend WordPress functionality',
    icon: '🔌',
    href: '/products/plugins',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Next.js Templates',
    description: 'Production-ready templates for fast deployment',
    icon: '⚛️',
    href: '/products/templates',
    color: 'from-white to-gray-300',
  },
  {
    name: 'MCP Servers',
    description: 'Model Context Protocol servers for AI integration',
    icon: '🤖',
    href: '/products/mcp-servers',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'AI Agents',
    description: 'Intelligent agents for automation and assistance',
    icon: '🧠',
    href: '/products/ai-agents',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    name: 'WordPress Themes',
    description: 'Beautiful, customizable theme collection',
    icon: '🎨',
    href: '/products/themes',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-6">
            Our Products
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Supercharge Your
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Web Projects
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Premium tools, templates, and solutions built by experts. 
            Everything you need to build better websites faster.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Link
                key={index}
                href={product.href}
                className="group relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-indigo-500/50 transition-all hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {product.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-400 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 text-indigo-400 group-hover:gap-4 transition-all">
                  <span className="font-medium">Coming Soon</span>
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
            Want Early Access?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Join our waitlist to get notified when products launch and receive exclusive discounts.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all"
          >
            Join Waitlist
          </Link>
        </div>
      </section>
    </div>
  );
}
