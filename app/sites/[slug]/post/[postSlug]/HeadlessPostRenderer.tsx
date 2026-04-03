import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
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
    node: { name: string };
  };
}

interface HeadlessPostRendererProps {
  wpSiteUrl: string;
  apiKey: string;
  siteName: string;
  postSlug: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

async function fetchPost(wpSiteUrl: string, apiKey: string, postSlug: string): Promise<Post | null> {
  try {
    const baseUrl = wpSiteUrl.replace(/\/$/, '');
    const headers = {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    };

    const response = await fetch(
      `${baseUrl}/wp-json/eyepress/v1/post/${postSlug}`,
      { headers, next: { revalidate: 60 } }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export default async function HeadlessPostRenderer({
  wpSiteUrl,
  apiKey,
  siteName,
  postSlug,
}: HeadlessPostRendererProps) {
  const post = await fetchPost(wpSiteUrl, apiKey, postSlug);
  const siteSlug = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Article Not Found</h1>
          <p className="text-slate-600 mb-4">The article you're looking for doesn't exist or has been removed.</p>
          <Link href={`/sites/${siteSlug}`} className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/sites/${siteSlug}`} className="flex items-center">
              <span className="text-2xl font-bold text-slate-900">{siteName}</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href={`/sites/${siteSlug}`} className="text-sm font-medium text-slate-700 hover:text-red-600 transition">
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-slate-500">
            <Link href={`/sites/${siteSlug}`} className="hover:text-red-600 transition">Home</Link>
            <span className="mx-2">/</span>
            {post.categories?.nodes?.[0] && (
              <>
                <Link
                  href={`/sites/${siteSlug}/category/${post.categories.nodes[0].slug}`}
                  className="hover:text-red-600 transition"
                >
                  {post.categories.nodes[0].name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-slate-800 truncate max-w-xs">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tag */}
        {post.categories?.nodes?.[0] && (
          <Link
            href={`/sites/${siteSlug}/category/${post.categories.nodes[0].slug}`}
            className="inline-block bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider hover:bg-red-700 transition mb-6"
          >
            {post.categories.nodes[0].name}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center flex-wrap gap-4 text-sm text-slate-500 pb-8 border-b border-slate-200 mb-8">
          {post.author?.node?.name && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mr-2">
                <span className="text-slate-600 font-semibold text-sm">{post.author.node.name.charAt(0)}</span>
              </div>
              <span className="font-medium text-slate-700">{post.author.node.name}</span>
            </div>
          )}
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(post.date)}
          </span>
          {post.modified && post.modified !== post.date && (
            <span className="text-slate-400">Updated: {formatDate(post.modified)}</span>
          )}
        </div>

        {/* Featured Image */}
        {post.featuredImage?.node?.sourceUrl && (
          <figure className="mb-10">
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              className="w-full rounded-xl shadow-lg"
            />
            {post.featuredImage.node.altText && (
              <figcaption className="mt-3 text-sm text-slate-500 text-center">
                {post.featuredImage.node.altText}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div
            className="article-content text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.8'
            }}
          />
        </div>

        {/* Tags */}
        {post.categories?.nodes && post.categories.nodes.length > 1 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Related Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {post.categories.nodes.slice(1).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/sites/${siteSlug}/category/${cat.slug}`}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-slate-200 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share & Back */}
        <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-200">
          <Link
            href={`/sites/${siteSlug}`}
            className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500">Share:</span>
            <div className="flex space-x-2">
              <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
              <button className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.183 1.24 8.475 3.44 1.477 1.58 2.366 3.623 2.613 5.752 1.06 1.128 1.494 2.248 1.478 3.385-.017 1.139-.843 2.112-1.965 2.902-.932 1.337-2.455 2.286-4.047 2.286-1.667 0-3.256-.672-4.457-1.818-1.26-1.201-1.972-2.812-1.972-4.557 0-2.204 1.26-4.098 3.166-4.986.943-.438 2.046-.667 3.124-.667 2.213 0 4.07 1.16 5.104 3.06 1.117 2.05 1.19 4.54.472 6.438l-1.514 6.163-6.17-1.563z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© {new Date().getFullYear()} {siteName}. Powered by <span className="text-red-500">WPCodingPress</span></p>
        </div>
      </footer>
    </div>
  );
}