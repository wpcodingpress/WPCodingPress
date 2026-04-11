import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'WordPress Plugins | WPCodingPress',
  description: 'Premium WordPress plugins for performance, security, SEO, and functionality.',
};

async function getPlugins() {
  try {
    const products = await prisma.product.findMany({
      where: {
        type: 'plugin',
        isActive: true,
      },
      orderBy: { order: 'asc' },
    });
    return products;
  } catch (error) {
    console.error('Error fetching plugins:', error);
    return [];
  }
}

export default async function PluginsPage() {
  const plugins = await getPlugins();

  if (plugins.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <section className="relative py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <span className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
              Coming Soon
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">WordPress Plugins</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Premium plugins to supercharge your WordPress site.
            </p>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-16">
              <div className="text-8xl mb-8">🔌</div>
              <h2 className="text-3xl font-bold text-white mb-4">Plugin Suite Under Development</h2>
              <p className="text-slate-400 text-lg mb-8">Performance, security, SEO, and more.</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full">Performance</span>
                <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full">Security</span>
                <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full">SEO</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-6 border-t border-slate-800">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/products" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              All Products
            </Link>
            <Link href="/products/templates" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              Next.js Templates
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
            WordPress Plugins
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Premium WordPress Plugins</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Powerful plugins to enhance your WordPress website functionality.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plugins.map((plugin) => {
              const images = plugin.images as { featuredImage?: string } | null;
              const featuredImage = images?.featuredImage;
              
              return (
                <Link
                  key={plugin.id}
                  href={`/products/${plugin.slug}`}
                  className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800/80 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="relative mb-4 overflow-hidden rounded-xl aspect-video bg-slate-700">
                    {featuredImage ? (
                      <img 
                        src={featuredImage} 
                        alt={plugin.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 group-hover:from-blue-500/30 group-hover:to-indigo-600/30 transition-all"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-16 h-16 text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-6 pt-0">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {plugin.name}
                    </h3>
                    {plugin.shortDesc && (
                      <p className="text-slate-400 mt-2 text-sm">{plugin.shortDesc}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      {plugin.price === 0 ? (
                        <span className="text-green-400 font-semibold">Free</span>
                      ) : (
                        <span className="text-white font-semibold">${(plugin.price / 100).toFixed(2)}</span>
                      )}
                      <span className="text-slate-500 text-sm group-hover:text-blue-400 transition-colors">
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

      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/products" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            All Products
          </Link>
          <Link href="/products/templates" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            Next.js Templates
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}