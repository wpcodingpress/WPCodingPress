import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'WordPress to Next.js Conversion | WPCodingPress',
  description: 'Transform your WordPress site into a lightning-fast Next.js application. Automated migration, SEO preservation, and modern architecture.',
  keywords: 'wordpress to nextjs, wordpress migration, headless wordpress, nextjs conversion, jamstack',
};

const features = [
  {
    title: 'Lightning Fast Performance',
    description: 'Next.js generates static HTML for blazing fast load times. Your visitors will experience instant page loads.',
    icon: '⚡',
  },
  {
    title: 'SEO Preservation',
    description: 'All your SEO rankings, meta tags, and URLs are automatically preserved during migration.',
    icon: '🔍',
  },
  {
    title: 'Auto Content Sync',
    description: 'New WordPress content automatically syncs to your Next.js site. No manual updates needed.',
    icon: '🔄',
  },
  {
    title: 'Modern Architecture',
    description: 'Get the benefits of ISR, edge caching, and modern web best practices out of the box.',
    icon: '🏗️',
  },
  {
    title: 'Lower Hosting Costs',
    description: 'Host on Vercel or Netlify with generous free tiers. Scale automatically without server management.',
    icon: '💰',
  },
  {
    title: 'Enhanced Security',
    description: 'No database vulnerabilities or plugin security issues. Static sites are inherently more secure.',
    icon: '🛡️',
  },
];

const plans = [
  {
    name: 'Free',
    planId: 'free',
    price: '$0/mo',
    period: 'forever',
    description: 'Perfect for getting started with WordPress to Next.js conversion',
    features: [
      '1 WordPress site conversion',
      'Basic Next.js template',
      'Community support',
      'Basic SEO setup',
    ],
    cta: 'Get Started',
    href: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    planId: 'pro',
    price: '$19/mo',
    period: 'month',
    description: 'Convert up to 5 WordPress sites to headless Next.js',
    features: [
      '5 WordPress to Headless conversions',
      'Live deployed sites (Vercel/Render)',
      'Advanced Next.js templates',
      'Priority email support',
      'Custom domain support',
      'Analytics dashboard',
      'Auto content sync',
    ],
    cta: 'Start Pro',
    href: '/register?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    planId: 'enterprise',
    price: '$99/mo',
    period: 'month',
    description: 'Unlimited conversions for agencies and businesses',
    features: [
      'Unlimited conversions',
      'White-label deployment',
      '24/7 Dedicated support',
      'Custom domain included',
      'API access',
      'Advanced analytics',
      'Team collaboration',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
];

const processSteps = [
  { step: 1, title: 'Connect Your WordPress', description: 'Enter your WordPress site URL and API credentials' },
  { step: 2, title: 'Configure Options', description: 'Choose your template, features, and customization options' },
  { step: 3, title: 'Automated Migration', description: 'Our system converts your content automatically' },
  { step: 4, title: 'Review & Deploy', description: 'Preview your new site and deploy with one click' },
];

export default function WordPressToNextjsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-6">
            Most Popular Service
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            WordPress to
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Next.js
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Transform your WordPress site into a lightning-fast, modern Next.js application. 
            Automated migration with SEO preservation and auto-sync.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-400 mb-2">10x</div>
              <div className="text-slate-400">Faster Loading</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-slate-400">SEO Preserved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400 mb-2">50%</div>
              <div className="text-slate-400">Cost Savings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">0</div>
              <div className="text-slate-400">Downtime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Migrate to Next.js?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Next.js is the industry standard for modern web development. 
              Here's why thousands of developers are making the switch.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:border-indigo-500/50 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400">
              Four simple steps to your new lightning-fast site.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-7xl font-bold text-indigo-500/10 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-8">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-400">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-slate-800 border rounded-2xl p-8 ${
                  plan.popular
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : 'border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Speed Up Your Site?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Join thousands of websites that have already made the switch.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all"
          >
            Start Your Free Migration
          </Link>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/services" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Services
          </Link>
          <Link href="/services/elementor-pro-design" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            Elementor Pro Design
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
