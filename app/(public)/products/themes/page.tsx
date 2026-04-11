import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'WordPress Themes | WPCodingPress',
  description: 'Premium WordPress themes for every industry.',
};

async function getThemes() {
  try {
    const products = await prisma.product.findMany({
      where: {
        type: 'theme',
        isActive: true,
      },
      orderBy: { order: 'asc' },
    });
    return products;
  } catch (error) {
    console.error('Error fetching themes:', error);
    return [];
  }
}

export default async function ThemesPage() {
  const themes = await getThemes();

  if (themes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <section className="relative py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent" />
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <span className="inline-block px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-6">
              Coming Soon
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">WordPress Themes</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Beautiful themes for speed, conversion, and design.
            </p>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-16">
              <div className="text-8xl mb-8">🎨</div>
              <h2 className="text-3xl font-bold text-white mb-4">Theme Collection Arriving Soon</h2>
              <p className="text-slate-400 text-lg mb-8">Business, portfolio, e-commerce, and blog themes.</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full">Business</span>
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full">Portfolio</span>
                <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full">E-commerce</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-6 border-t border-slate-800">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/products/ai-agents" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              AI Agents
            </Link>
            <Link href="/products" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
              All Products
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-6">
            WordPress Themes
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Premium WordPress Themes</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Beautiful, performance-optimized themes for every type of website.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => {
              const images = theme.images as { featuredImage?: string } | null;
              const featuredImage = images?.featuredImage;
              
              return (
                <Link
                  key={theme.id}
                  href={`/products/${theme.slug}`}
                  className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:bg-slate-800/80 hover:border-green-500/30 transition-all duration-300"
                >
                  <div className="relative mb-4 overflow-hidden rounded-xl aspect-video bg-slate-700">
                    {featuredImage ? (
                      <img 
                        src={featuredImage} 
                        alt={theme.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20 group-hover:from-green-500/30 group-hover:to-emerald-600/30 transition-all"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-16 h-16 text-green-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-6 pt-0">
                    <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                      {theme.name}
                    </h3>
                    {theme.shortDesc && (
                      <p className="text-slate-400 mt-2 text-sm">{theme.shortDesc}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      {theme.price === 0 ? (
                        <span className="text-green-400 font-semibold">Free</span>
                      ) : (
                        <span className="text-white font-semibold">${(theme.price / 100).toFixed(2)}</span>
                      )}
                      <span className="text-slate-500 text-sm group-hover:text-green-400 transition-colors">
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
          <Link href="/products/ai-agents" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            AI Agents
          </Link>
          <Link href="/products" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            All Products
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}