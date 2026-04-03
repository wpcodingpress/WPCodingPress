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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>
          <Link href={`/sites/${siteSlug}`} className="text-indigo-600 hover:underline mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Link href={`/sites/${siteSlug}`} className="text-indigo-200 hover:text-white mb-4 inline-block">← Back to Home</Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {post.featuredImage?.node?.sourceUrl && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold text-slate-900 mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-slate-500 mb-8 pb-8 border-b border-slate-200">
          <span>By {post.author?.node?.name || 'Unknown'}</span>
          <span>•</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>

        {post.categories?.nodes && post.categories.nodes.length > 0 && (
          <div className="flex gap-2 mb-8">
            {post.categories.nodes.map((cat) => (
              <Link
                key={cat.slug}
                href={`/sites/${siteSlug}/category/${cat.slug}`}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <div
          className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-indigo-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href={`/sites/${siteSlug}`} className="text-indigo-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </article>
    </div>
  );
}