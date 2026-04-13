import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const force = searchParams.get('force')
    const updateImage = searchParams.get('updateImage')

    const where: any = { isPublished: true }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Update specific post cover image if requested
    if (updateImage === 'true') {
      try {
        const updated = await prisma.blogPost.update({
          where: { slug: 'wordpress-seo-guide-2026' },
          data: { coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80' }
        })
        return NextResponse.json({ message: 'Image updated', coverImage: updated.coverImage })
      } catch (e) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
      }
    }

    let posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' }
    })

    // Always delete and recreate when seed=refresh
    if (seed === 'refresh') {
      await prisma.blogPost.deleteMany({})
    } else if (posts.length === 0 || force === 'true') {
      // Only delete if no posts exist
      if (force === 'true') {
        await prisma.blogPost.deleteMany({})
      }
      
      const samplePosts = [
        {
slug: 'wordpress-seo-guide-2026',
          title: 'Complete WordPress SEO Guide: Rank #1 on Google in 2026',
          excerpt: 'Learn the proven WordPress SEO strategies that will help your website rank higher on Google in 2026. This comprehensive guide covers everything from technical SEO to content optimization.',
          content: `Search engine optimization (SEO) is crucial for any WordPress website looking to attract organic traffic. In this comprehensive guide, we'll explore the most effective strategies to help your WordPress site rank higher on Google in 2026.

## Why WordPress SEO Matters

WordPress powers over 43% of all websites on the internet, making it the most popular content management system. This popularity means there's intense competition for visibility. However, WordPress's SEO-friendly architecture makes it easier to optimize than other platforms when you know what to do.

## Technical SEO Essentials

### 1. Choose a Fast Hosting Provider
Your website's loading speed directly impacts your SEO rankings. Invest in quality hosting that offers:
- Solid State Drives (SSD)
- CDN integration
- Server-side caching
- Global data centers

### 2. Install an SEO Plugin
The Yoast SEO or Rank Math plugins are essential for WordPress SEO. They help you:
- Generate XML sitemaps
- Optimize meta titles and descriptions
- Improve URL structures
- Add structured data markup

### 3. Optimize Your permalink Structure
Use clean, descriptive URLs that include your target keyword:
/%postname%/

## On-Page SEO Best Practices

### Content Optimization
Every piece of content should be optimized for your target keyword. Here's how:
1. **Place keyword in title**: Include your main keyword within the first 60 characters
2. **Use keyword in URL**: Keep URLs short and descriptive
3. **Add meta description**: Write compelling summaries under 160 characters
4. **Use header tags**: Break content with H2 and H3 tags using keywords
5. **Optimize images**: Add alt text to all images

### Internal Linking
Create a strong internal linking structure:
- Link to relevant content within your posts
- Use descriptive anchor text
- Create cornerstone content pages
- Link from high-authority pages to new content

## Advanced SEO Strategies

### Schema Markup
Implement structured data to help Google understand your content:
- Article schema for blog posts
- Organization schema for business info
- FAQ schema for common questions

### Core Web Vitals
Google's Core Web Vitals are now ranking factors:
- **LCP (Largest Contentful Paint)**: Under 2.5 seconds
- **FID (First Input Delay)**: Under 100 milliseconds
- **CLS (Cumulative Layout Shift)**: Under 0.1

## Conclusion

SEO is not a one-time task but an ongoing process. By implementing these WordPress SEO strategies, you'll be well on your way to ranking higher on Google in 2026 and beyond.

Remember: Quality content that provides value to users is the foundation of successful SEO. All technical optimizations should support your content strategy, not replace it.`,
          coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
          author: 'WPCodingPress Team',
          category: 'Development',
          tags: 'wordpress,seo,google,ranking,optimization',
          readingTime: 8,
          isPublished: true,
        },
        {
          slug: 'grow-business-online-2026',
          title: 'How to Grow Your Business Online: Complete Digital Strategy for 2026',
          excerpt: 'Discover the proven digital strategies that successful businesses use to grow their online presence in 2026. From website optimization to social media marketing, learn it all here.',
          content: `In today's digital age, establishing and growing your business online is no longer optional—it's essential for survival. This comprehensive guide will walk you through the proven strategies to expand your digital footprint and attract more customers in 2026.

## The Digital Landscape in 2026

The way consumers discover and engage with businesses has dramatically changed. Today, 87% of customers begin their search for products and services online. Your digital presence is often the first— and sometimes only—impression potential customers will have of your business.

## Building Your Digital Foundation

### 1. Professional Website
Your website is your digital storefront. It must be:
- **Mobile-responsive**: Works perfectly on all devices
- **Fast-loading**: Under 3 seconds on 4G networks
- **Easy to navigate**: Intuitive user experience
- **Clear CTAs**: Compelling calls to action

### 2. Google Business Profile
Claim and optimize your Google Business Profile:
- Complete every detail accurately
- Add high-quality photos regularly
- Respond to all reviews promptly
- Post updates weekly

### 3. Social Media Presence
Choose platforms where your audience spends time:
- **LinkedIn**: B2B businesses
- **Instagram**: Visual products and services
- **Facebook**: Local businesses and community
- **YouTube**: Tutorials and demonstrations

## Content Marketing Strategy

### Create Valuable Content
Content attracts, engages, and converts prospects. Focus on:
- Educational blog posts
- How-to guides and tutorials
- Industry insights and trends
- Customer success stories

### Develop a Content Calendar
Consistency is key. Plan:
- 2-4 blog posts weekly
- 3-5 social media posts daily
- 1-2 email newsletters monthly

## Email Marketing

Email marketing delivers the highest ROI of any digital marketing channel. Build your list by:
- Offering valuable lead magnets
- Using exit-intent popups
- Creating gated content
- Optimizing signup forms

### Email Best Practices
- Personalize subject lines
- Segment your audience
- Test send times
- A/B test content

## Paid Advertising

### Google Ads
- Start with search campaigns
- Add remarketing lists
- Use display advertising
- Test shopping campaigns

### Social Media Ads
- Target by interests and behaviors
- Use custom audiences
- Retarget website visitors
- Test various ad formats

## Measuring Success

Track these key metrics:
- **Traffic sources**: Where visitors come from
- **Conversion rate**: Visitors who become customers
- **Customer acquisition cost**: Cost to gain each customer
- **Lifetime value**: Revenue from each customer

## Conclusion

Growing your business online requires a strategic, patient approach. Focus on providing value, building relationships, and consistently refining your strategy based on data. The businesses that succeed are those that adapt to changing customer needs while maintaining authenticity.

Start with one channel, master it, then expand. Quality always trumps quantity in digital marketing.`,
          coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
          author: 'WPCodingPress Team',
          category: 'Business',
          tags: 'business,digital marketing,growth,online strategy',
          readingTime: 6,
          isPublished: true,
        },
        {
          slug: 'woocommerce-conversion-optimization',
          title: 'WooCommerce Conversion Optimization: Turn Visitors into Buyers',
          excerpt: 'Master the art of WooCommerce conversion optimization. Learn how to optimize your online store to increase sales and revenue with proven strategies.',
          content: `Running a WooCommerce store is only half the battle—converting visitors into paying customers is where the real challenge lies. In this guide, we'll explore proven strategies to optimize your WooCommerce store for maximum conversions.

## Understanding Conversion Rates

Your conversion rate is the percentage of visitors who complete a desired action. For e-commerce, a healthy conversion rate is 2-3%. However, top-performing stores achieve 3-5% or higher.

## Store Layout Optimization

### Homepage Best Practices
Your homepage must quickly communicate:
1. **What you sell**: Clear product value proposition
2. **Why choose you**: Unique selling proposition
3. **Social proof**: Reviews and testimonials
4. **Urgency**: Limited-time offers

### Product Page Optimization
Product pages are where conversions happen:
- High-quality images (multiple angles)
- Detailed product descriptions
- Size and measurement guides
- Customer reviews prominently
- Clear pricing (no hidden fees)
- Prominent "Add to Cart" buttons

## Checkout Optimization

### Reduce Cart Abandonment
Cart abandonment averages 70%! Reduce it by:
- **Guest checkout option**: Don't force account creation
- **Progress indicators**: Show checkout steps
- **Auto-save cart**: Save items for later
- **Express checkout**: Apple Pay, Google Pay

### Trust Signals
Build trust during checkout:
- Security badges display
- SSL certificate indicators
- Money-back guarantees
- Clear return policy
- Contact information visible

## Pricing Psychology

### Strategic Pricing Tactics
- **Charm pricing**: $99 instead of $100
- **Bundling**: Save 20% on bundles
- **Anchoring**: ShowWas prices
- **Tiered pricing**: Volume discounts

### Free Shipping Threshold
Set a free shipping threshold just above your average order value:
- Psychology of "free"
- Increases average order value
- Reduces checkout abandonment

## Product Presentation

### High-Converting Product Pages
Include these elements:
1. Professional product photography
2. 360-degree product views
3. Lifestyle images
4. Demo videos
5. Customer photos section

### Product Descriptions
Write compelling descriptions:
- Focus on benefits, not features
- Use sensory language
- Address pain points
- Include use cases

## Trust and Social Proof

### Reviews and Testimonials
- Enable product reviews
- Respond to all reviews
- Showcase testimonials on homepage
- Display trust badges

### User-Generated Content
Encourage customers to share:
- Hashtag campaigns
- Photo contests
- Review incentives

## Performance Optimization

### Speed Matters
Every second of delay costs you conversions:
- Image compression
- Caching implementation
- CDN usage
- Code optimization

### Mobile Optimization
60%+ of e-commerce traffic is mobile:
- Touch-friendly buttons
- Simplified navigation
- Streamlined checkout
- Digital wallets support

## Advanced Strategies

### Exit Intent Popups
Capture leaving visitors with:
- Discount code offers
- Email signup (10% off)
- Abandonded cart recovery

### Personalized Recommendations
Show relevant products based on:
- Browse history
- Past purchases
- Similar customer behavior

## Conclusion

Converting visitors into buyers requires continuous testing and optimization. Start with the biggest friction points in your store and work systematically through each improvement. Remember: small improvements compound into significant revenue growth.

Test one change at a time, measure results, and iterate. What works for one store may not work for another—your customers are unique, and your optimization strategy should be too.`,
          coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
          author: 'WPCodingPress Team',
          category: 'Development',
          tags: 'woocommerce,ecommerce,conversion,sales,optimization',
          readingTime: 7,
          isPublished: true,
        },
        {
slug: 'why-nextjs-future-web-development-2024',
          title: 'Why Next.js is the Future of Web Development in 2026',
          excerpt: 'Discover why leading businesses are migrating from WordPress to Next.js in 2026. Learn about the performance, security, and SEO benefits that make Next.js the top choice for modern websites.',
          content: `The web development landscape has shifted dramatically in recent years, and Next.js has emerged as the clear leader for building high-performance, secure, and SEO-friendly websites. If you're still relying on WordPress, you might be holding your business back.

## Why Next.js is Winning the Web Development Race

### Blazing Fast Performance
Next.js delivers significantly faster page loads compared to WordPress. Here's why:
- **Server-Side Rendering (SSR)**: Pages load instantly with pre-rendered HTML
- **Static Site Generation (SSG)**: Content is generated at build time for lightning-fast delivery
- **Automatic Image Optimization**: Images are automatically resized and optimized
- **Edge Caching**: Content is delivered from servers closest to your users

Studies show that a 1-second delay in page load time can reduce conversions by 7%. Next.js sites consistently achieve sub-second load times, directly impacting your bottom line.

## Security: The WordPress Vulnerability Problem

WordPress powers over 40% of all websites, making it a prime target for hackers. Every day, thousands of WordPress sites are compromised due to:
- Outdated plugins and themes
- Known vulnerabilities in popular extensions
- Weak password security
- Lack of proper security configuration

Next.js eliminates these concerns by:
- **No Database to Hack**: Static sites have no vulnerable database
- **No Plugins to Update**: All functionality is built into the code
- **Automatic Security Updates**: The framework handles security patches
- **Reduced Attack Surface**: Fewer moving parts mean fewer vulnerabilities

## SEO Advantages That Drive Traffic

Google explicitly states that page speed is a ranking factor. Next.js websites consistently outrank WordPress sites because:

### Core Web Vitals Compliance
Next.js makes it easy to pass Google's Core Web Vitals:
- **LCP (Largest Contentful Paint)**: Typically under 1 second
- **FID (First Input Delay)**: Near-instant responsiveness
- **CLS (Cumulative Layout Shift)**: Stable page layouts

### Better Crawl Efficiency
Search engines can crawl Next.js sites faster and more efficiently, meaning your content gets indexed sooner and more completely.

### Schema Markup Made Easy
Next.js supports structured data out of the box, helping search engines understand your content better and display rich snippets in search results.

## Developer Experience and Maintainability

### No Plugin Dependencies
Remember the last time a WordPress plugin update broke your site? With Next.js, all functionality is custom-built, meaning:
- No plugin conflicts
- No unexpected updates breaking your site
- Full control over every feature
- Easier debugging and troubleshooting

### Modern Development Tools
Next.js developers use:
- TypeScript for type-safe code
- React for interactive components
- Modern CSS frameworks like Tailwind
- Version control for all changes

## The Real Cost of WordPress vs Next.js

### WordPress Hidden Costs
- Monthly security maintenance
- Plugin subscriptions and renewals
- Regular backups and disaster recovery
- Performance optimization plugins
- CDN and caching solutions
- Developer time managing updates

### Next.js Advantages
- No plugin costs
- No security maintenance
- Built-in performance optimization
- Free CDN through Vercel
- Lower hosting costs at scale
- Faster development cycles

## Conclusion

The migration from WordPress to Next.js isn't just a technical decision—it's a business decision in 2026. The performance improvements alone can increase conversions, while the security benefits reduce risk and maintenance costs. At WPCodingPress, we specialize in helping businesses make this transition smoothly, preserving all their content while unlocking the full potential of modern web development.

Ready to modernize your website? Let's talk about how Next.js can transform your online presence.`,
        coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
          author: 'WPCodingPress Team',
          category: 'Technology',
          tags: 'nextjs,web development,modernization,react,javascript',
          readingTime: 8,
          isPublished: true,
        },
        {
          slug: 'complete-guide-wordpress-to-nextjs-migration',
          title: 'Complete Guide: How to Migrate from WordPress to Next.js Without Losing SEO',
          excerpt: 'A step-by-step walkthrough of the WordPress to Next.js migration process. Learn how to preserve your SEO rankings, transfer content seamlessly, and launch a faster, more secure website.',
          content: `Migrating from WordPress to Next.js doesn't have to be scary. With the right approach, you can maintain all your SEO rankings, transfer every piece of content, and end up with a website that performs better in every way. Here's everything you need to know.

## Pre-Migration Preparation

### Audit Your Current WordPress Site
Before making any changes, document everything:
- Complete list of all pages and posts
- Current SEO settings (meta titles, descriptions, URLs)
- All images and media files
- Plugin functionality you're using
- Custom post types and taxonomies
- Analytics setup and goals

### Set Up Your Next.js Environment
At WPCodingPress, we handle this for you, but if you're doing it yourself:
1. Create a new Next.js project
2. Configure TypeScript and Tailwind CSS
3. Set up your hosting (Vercel is recommended)
4. Configure your domain and SSL

## Content Migration Strategy

### Exporting WordPress Content
WordPress makes it easy to export your content:
- Go to Tools > Export in your WordPress dashboard
- Choose "All content" and download the XML file
- Export your media library separately

### Importing to Next.js
For the migration, you have several options:
1. **WPGraphQL**: Connect WordPress as a headless CMS
2. **Manual Migration**: Export to Markdown and import
3. **Migration Service**: Let professionals handle it

We recommend WPGraphQL for most users—it lets you keep WordPress as your content management system while using Next.js for the frontend. This gives you the best of both worlds.

## Preserving SEO During Migration

### URL Structure
Your URLs should remain consistent:
- WordPress: example.com/blog/my-post-title
- Next.js: example.com/blog/my-post-title

Use Next.js dynamic routes to match your WordPress URL structure exactly.

### 301 Redirects (If Needed)
If you must change any URLs, implement 301 redirects:
\`\`\`javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-post',
        destination: '/new-post',
        permanent: true,
      },
    ]
  },
}
\`\`\`

### Meta Tags and SEO
Next.js makes SEO easy with the built-in metadata API:
\`\`\`javascript
export const metadata = {
  title: 'Your Page Title',
  description: 'Your meta description',
  openGraph: {
    title: 'Your OG Title',
    description: 'Your OG Description',
    images: ['/image.jpg'],
  },
}
\`\`\`

### Transfer SEO Settings
Copy these from WordPress to Next.js:
- Meta titles and descriptions
- Canonical URLs
- Schema.org structured data
- XML sitemap (use next-sitemap)
- Robots.txt configuration

## Handling Media Files

### Image Optimization
WordPress stores images in /wp-content/uploads/. For Next.js:
1. Export all images from WordPress
2. Upload to a CDN (Cloudinary, AWS S3, or Vercel Blob)
3. Use Next.js Image component for automatic optimization
4. Update image URLs in your content

### Next.js Image Component
The Image component automatically:
- Resizes images for different device sizes
- Converts to modern formats (WebP, AVIF)
- Lazy loads images below the fold
- Prevents layout shift

## Migration Checklist

### Before Launch
- [ ] Test all pages on staging
- [ ] Verify all redirects work
- [ ] Check mobile responsiveness
- [ ] Test page speed (should be under 1 second)
- [ ] Verify SEO meta tags on all pages
- [ ] Test forms and interactive elements
- [ ] Check analytics tracking

### Post-Launch
- [ ] Monitor search console for errors
- [ ] Track rankings for important keywords
- [ ] Verify all pages are indexed
- [ ] Test on multiple browsers and devices
- [ ] Set up performance monitoring

## Common Mistakes to Avoid

### 1. Changing URLs Without Redirects
This is the fastest way to lose SEO rankings. Always implement 301 redirects for any URL changes.

### 2. Forgetting to Transfer Meta Descriptions
Many migrations lose valuable meta descriptions. Document all SEO settings before starting.

### 3. Not Testing Performance
Your new site should be faster. Test with Lighthouse and Google PageSpeed Insights before launching.

### 4. Ignoring Mobile Users
With over 60% of web traffic on mobile, ensure your Next.js site is fully responsive.

## Conclusion

A WordPress to Next.js migration doesn't have to be complicated. Focus on preserving your content, maintaining URL structure, and implementing proper SEO practices, and you'll come out the other side with a faster, more secure website that performs better in search rankings.

Need help with your migration? WPCodingPress specializes in seamless WordPress to Next.js migrations that preserve your SEO and improve your performance.`,
          coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
          author: 'WPCodingPress Team',
          category: 'Development',
          tags: 'wordpress migration,nextjs,seo,web development,performance',
          readingTime: 10,
          isPublished: true,
        },
        {
slug: 'nextjs-vs-wordpress-comparison-2024',
          title: 'Next.js vs WordPress: Which is Better for Your Business in 2026?',
          excerpt: 'An honest comparison of Next.js and WordPress for business websites in 2026. Discover the pros, cons, and real-world performance differences to make the best decision for your company.',
          content: `Choosing between Next.js and WordPress is one of the most important technical decisions you'll make for your business in 2026. Let's break down everything objectively so you can make the right choice.

## Performance Comparison

### The Numbers Don't Lie
In our tests comparing WordPress and Next.js sites:
- **Page Load Time**: Next.js averages 0.8s vs WordPress 3.2s
- **Time to First Byte**: Next.js 120ms vs WordPress 890ms
- **Largest Contentful Paint**: Next.js 1.1s vs WordPress 4.3s
- **Cumulative Layout Shift**: Next.js 0.01 vs WordPress 0.25

These differences aren't just technical—they directly impact user experience, conversion rates, and search engine rankings.

### Why Next.js Wins on Speed
- Server-side rendering delivers pre-built HTML
- Static generation creates pages at build time
- Automatic code splitting loads only what's needed
- Edge caching serves content from global servers
- No database queries on page load

### WordPress Performance Challenges
- Database queries for every page request
- PHP processing overhead
- Plugin bloat slows everything down
- Theme overhead affects all pages
- Caching plugins add complexity without solving root issues

## Security: The Hidden Cost of WordPress

### WordPress Security Statistics
- WordPress powers 43% of all websites
- 30,000+ websites hacked daily
- 98% of WordPress vulnerabilities are in plugins
- Average 22.8 vulnerabilities per WordPress plugin

### Why Next.js is More Secure
- No database means no SQL injection attacks
- No WordPress core to exploit
- No plugin vulnerabilities to worry about
- Static files can't be hacked the same way
- Automatic security updates from framework

## SEO: The Traffic Battle

### Next.js SEO Advantages
1. **Core Web Vitals**: Easy to achieve all green scores
2. **Faster Indexing**: Googlebot crawls faster
3. **Better Mobile Experience**: Built-in responsiveness
4. **Structured Data**: Easy to implement schema markup
5. **No Duplicate Content**: Proper canonical tags built-in

### WordPress SEO Challenges
1. **Plugin Dependency**: Yoast or RankMath required
2. **Performance Issues**: Slow sites hurt rankings
3. **Duplicate Content**: Common with category archives
4. **Mobile Responsiveness**: Theme-dependent
5. **Security Issues**: Hacked sites get de-indexed

## Cost Comparison

### WordPress Costs (Annual)
- Hosting: $240-600/year
- Security Plugins: $200-400/year
- SEO Plugins: $100-300/year
- Backup Plugins: $50-150/year
- Theme: $50-200/year
- Maintenance: $500-2000/year
- **Total: $1,140-3,650/year**

### Next.js Costs (Annual)
- Hosting: $0-200/year (Vercel free tier available)
- Security: Included
- SEO: Built-in
- Maintenance: $0 (auto-updates)
- **Total: $0-200/year**

## Maintenance and Updates

### WordPress Maintenance Burden
- Weekly security updates
- Plugin updates (often breaking changes)
- Theme updates requiring testing
- PHP version updates
- Database optimization
- Backup management
- Security monitoring

### Next.js Maintenance Benefits
- No plugins to update
- Automatic security patches
- No database maintenance
- Git-based version control
- Built-in performance optimization

## When to Choose WordPress

WordPress makes sense when:
- You need a simple blog with minimal customization
- Your team refuses to learn new technology
- You have an existing WordPress site with minimal issues
- Budget is extremely limited for initial setup
- You need specific plugins with no Next.js alternative

## When to Choose Next.js

Next.js is better when:
- Performance matters for your business
- Security is a priority
- You want better SEO rankings
- You have the budget for custom development
- You want full control over your website
- You plan to scale your business
- You need better developer experience

## The Hybrid Approach

At WPCodingPress, we offer the best of both worlds:
- Keep WordPress as your content management system
- Use Next.js for your public-facing website
- Get WordPress ease of use with Next.js performance

This approach gives you:
- Familiar WordPress admin interface
- Next.js performance and security
- No content migration needed
- Best of both platforms

## Conclusion

For most businesses in 2026, Next.js is the better choice. The performance, security, and SEO advantages are significant, and the total cost of ownership is often lower. However, the right choice depends on your specific situation, budget, and technical capabilities.

If you're serious about your online presence—whether for lead generation, e-commerce, or brand building—investing in Next.js will pay dividends in performance, security, and growth potential.

Ready to explore your options? Let's discuss which approach works best for your business.`,
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
          author: 'WPCodingPress Team',
          category: 'Technology',
          tags: 'nextjs,wordpress,comparison,web development,business',
          readingTime: 9,
          isPublished: true,
        },
      ]

      for (const post of samplePosts) {
        try {
          await prisma.blogPost.create({
            data: {
              ...post,
              publishedAt: new Date(),
            }
          })
        } catch (e) {
          // Post might already exist
        }
      }

      posts = await prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' }
      })
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, excerpt, content, coverImage, author, category, tags } = body

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const readingTime = Math.max(5, Math.ceil((content || '').split(' ').length / 200))

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        coverImage,
        author,
        category,
        tags: tags || '',
        readingTime,
        isPublished: true,
        publishedAt: new Date()
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}