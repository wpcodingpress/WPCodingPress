import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  categories?: {
    nodes: Array<{ name: string; slug: string }>;
  };
  author?: {
    node: { name: string; slug: string };
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

interface SiteData {
  posts: Post[];
  categories: Category[];
  site_info: {
    name: string;
    description: string;
  };
}

interface HeadlessSiteRendererProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
}

async function fetchWPData(wpSiteUrl: string, apiKey: string): Promise<SiteData | null> {
  try {
    const baseUrl = wpSiteUrl.replace(/\/$/, '');
    const headers = {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    };

    const [exportRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/wp-json/headless/v1/export`, { headers, next: { revalidate: 60 } }),
      fetch(`${baseUrl}/wp-json/headless/v1/categories`, { headers, next: { revalidate: 60 } }),
    ]);

    if (!exportRes.ok) return null;

    const exportData = await exportRes.json();
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

    return {
      posts: exportData.posts || [],
      categories: categoriesData,
      site_info: exportData.site_info || { name: 'News Site', description: '' },
    };
  } catch {
    return null;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default async function HeadlessSiteRenderer({
  wpSiteUrl,
  apiKey,
  siteName,
}: HeadlessSiteRendererProps) {
  const data = await fetchWPData(wpSiteUrl, apiKey);
  const siteSlug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Site Temporarily Unavailable</h1>
          <p className="text-slate-600">Unable to connect to the WordPress server. Please try again later.</p>
        </div>
      </div>
    );
  }

  const { posts, categories, site_info } = data;
  
  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">No Posts Found</h1>
          <p className="text-slate-600">This site doesn't have any content yet.</p>
        </div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const trendingPosts = posts.slice(1, 4);
  const remainingPosts = posts.slice(4);

  return (
    <div className="min-h-screen bg-white">
      {/* ============ HEADER ============ */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={`/sites/${siteSlug}`} className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">{site_info.name || siteName}</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href={`/sites/${siteSlug}`} className="text-sm font-medium text-slate-700 hover:text-red-600 transition">
                Home
              </Link>
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/sites/${siteSlug}/category/${cat.slug}`}
                  className="text-sm font-medium text-slate-600 hover:text-red-600 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Search & Subscribe */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ============ BREAKING NEWS TICKER ============ */}
      <div className="bg-red-600 text-white py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <span className="bg-white text-red-600 text-xs font-bold px-2 py-0.5 rounded mr-4 uppercase">Breaking</span>
          <div className="flex items-center space-x-8 overflow-hidden">
            <span className="text-sm whitespace-nowrap">{featuredPost?.title}</span>
          </div>
        </div>
      </div>

      {/* ============ HERO SECTION ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Featured */}
          <div className="lg:col-span-8">
            {featuredPost && (
              <article className="relative group cursor-pointer">
                <div className="aspect-[16/9] rounded-xl overflow-hidden">
                  {featuredPost.featuredImage?.node?.sourceUrl ? (
                    <img
                      src={featuredPost.featuredImage.node.sourceUrl}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {featuredPost.categories?.nodes?.[0] && (
                    <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded mb-3 uppercase">
                      {featuredPost.categories.nodes[0].name}
                    </span>
                  )}
                  <Link href={`/sites/${siteSlug}/post/${featuredPost.slug}`}>
                    <h1 className="text-2xl md:text-4xl font-bold text-white hover:text-red-400 transition line-clamp-2">
                      {featuredPost.title}
                    </h1>
                  </Link>
                  <p className="text-slate-300 mt-3 line-clamp-2 hidden md:block">
                    {featuredPost.excerpt || featuredPost.content.slice(0, 150)}...
                  </p>
                  <div className="flex items-center mt-4 text-sm text-slate-400">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {featuredPost.author?.node?.name || 'Editor'}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(featuredPost.date)}</span>
                  </div>
                </div>
              </article>
            )}
          </div>

          {/* Sidebar - Trending */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Trending Now
              </h3>
              <div className="space-y-4">
                {trendingPosts.map((post, index) => (
                  <article key={post.id} className="flex items-start space-x-4 group cursor-pointer">
                    <span className="text-3xl font-bold text-slate-200">{index + 1}</span>
                    <div>
                      <Link href={`/sites/${siteSlug}/post/${post.slug}`}>
                        <h4 className="font-semibold text-slate-900 group-hover:text-red-600 transition line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(post.date)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mt-6 bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/sites/${siteSlug}/category/${cat.slug}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-red-400 hover:text-red-600 transition"
                  >
                    {cat.name} ({cat.count})
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6 bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
              <p className="text-red-100 text-sm mb-4">Get the latest news delivered to your inbox.</p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-red-200 border border-red-400/30 focus:outline-none focus:border-white"
                />
                <button className="w-full bg-white text-red-600 font-semibold py-2 rounded-lg hover:bg-red-50 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LATEST ARTICLES GRID ============ */}
      {remainingPosts.length > 0 && (
        <section className="bg-slate-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <div className="w-1 h-8 bg-red-600 rounded mr-4" />
              <h2 className="text-2xl font-bold text-slate-900">Latest Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {remainingPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group">
                  <div className="aspect-[16/10] overflow-hidden">
                    {post.featuredImage?.node?.sourceUrl ? (
                      <img
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
                    )}
                  </div>
                  <div className="p-4">
                    {post.categories?.nodes?.[0] && (
                      <span className="text-xs font-bold text-red-600 uppercase">
                        {post.categories.nodes[0].name}
                      </span>
                    )}
                    <Link href={`/sites/${siteSlug}/post/${post.slug}`}>
                      <h3 className="font-bold text-slate-900 mt-2 line-clamp-2 group-hover:text-red-600 transition">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                      {post.excerpt || post.content.slice(0, 80)}...
                    </p>
                    <div className="flex items-center mt-3 text-xs text-slate-400">
                      <span>{formatDate(post.date)}</span>
                      <span className="mx-2">•</span>
                      <span>{post.author?.node?.name || 'Editor'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FOOTER ============ */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-white text-xl font-bold mb-4">{site_info.name || siteName}</h4>
              <p className="text-sm mb-4 max-w-md">{site_info.description || 'Your trusted source for the latest news and updates.'}</p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.7-.03-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-sm">
                {categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/sites/${siteSlug}/category/${cat.slug}`} className="hover:text-red-400 transition">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href={`/sites/${siteSlug}`} className="hover:text-red-400 transition">Home</Link></li>
                <li><a href={wpSiteUrl} target="_blank" className="hover:text-red-400 transition">About Us</a></li>
                <li><a href={wpSiteUrl} target="_blank" className="hover:text-red-400 transition">Contact</a></li>
                <li><a href={wpSiteUrl} target="_blank" className="hover:text-red-400 transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} {site_info.name || siteName}. All rights reserved. Powered by <span className="text-red-500">WPCodingPress</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}