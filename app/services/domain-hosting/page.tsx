import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Domain & Hosting Setup | WPCodingPress',
  description: 'Professional domain registration, hosting configuration, SSL certificates, DNS management, and 24/7 support for your website.',
  keywords: 'domain registration, web hosting, SSL certificate, DNS setup, website hosting, domain transfer',
};

const services = [
  {
    title: 'Domain Registration',
    description: 'Register and manage your perfect domain name with easy renewal and transfer options.',
    features: ['.com, .net, .org & more', 'WHOIS privacy protection', 'Free DNS management', 'Domain transfer service'],
    icon: '🌐',
  },
  {
    title: 'Hosting Setup',
    description: 'Expert configuration of shared, VPS, or dedicated hosting for optimal performance.',
    features: ['Server optimization', 'PHP version setup', 'Database configuration', 'Email setup'],
    icon: '🖥️',
  },
  {
    title: 'SSL Certificates',
    description: 'Secure your website with proper SSL installation and configuration.',
    features: ['Free Let\'s Encrypt', 'Paid SSL options', 'Auto-renewal setup', 'Mixed content fix'],
    icon: '🔒',
  },
  {
    title: 'DNS Management',
    description: 'Professional DNS configuration for speed, reliability, and email deliverability.',
    features: ['A, CNAME, MX records', 'SPF/DKIM setup', 'Subdomain configuration', 'DNS propagation'],
    icon: '⚙️',
  },
  {
    title: 'Migration Services',
    description: 'Zero-downtime migration from any hosting provider to your new server.',
    features: ['Complete file transfer', 'Database migration', 'Email migration', 'Post-migration support'],
    icon: '📦',
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock technical support for all your hosting and domain needs.',
    features: ['Live chat support', 'Phone assistance', 'Ticket system', 'Emergency response'],
    icon: '🎧',
  },
];

const hostingTypes = [
  {
    name: 'Shared Hosting',
    price: '$5/mo',
    bestFor: 'Small websites, blogs',
    features: ['1 Website', '10GB Storage', 'Unlimited Bandwidth', 'Email Support'],
  },
  {
    name: 'VPS Hosting',
    price: '$20/mo',
    bestFor: 'Growing businesses',
    features: ['Unlimited Websites', '50GB SSD', '2GB RAM', 'Priority Support'],
    popular: true,
  },
  {
    name: 'Dedicated Server',
    price: '$100/mo',
    bestFor: 'High-traffic sites',
    features: ['Full Server Access', '1TB SSD', '8GB RAM', '24/7 Monitoring'],
  },
];

export default function DomainHostingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-300 text-sm font-medium mb-6">
            Domain & Hosting
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your Domain,
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Our Expertise
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Everything you need to get your website online and keep it running smoothly. 
            From domain registration to complete hosting management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all"
            >
              Get Started Today
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

      {/* Domain Search */}
      <section className="py-16 px-6 -mt-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              Find Your Perfect Domain
            </h3>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter your dream domain..."
                className="flex-1 px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                Search
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
              <span className="text-slate-400">.com <span className="text-green-400">$12.99</span></span>
              <span className="text-slate-400">.net <span className="text-green-400">$11.99</span></span>
              <span className="text-slate-400">.io <span className="text-green-400">$29.99</span></span>
              <span className="text-slate-400">.dev <span className="text-green-400">$24.99</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete Domain & Hosting Services
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From registration to ongoing management, we've got every aspect of your web presence covered.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-pink-500/50 transition-all"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-pink-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-400 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting Plans */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Hosting Plans for Every Need
            </h2>
            <p className="text-slate-400">
              From personal blogs to enterprise applications, we have the perfect hosting solution.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {hostingTypes.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-slate-800 border rounded-2xl p-8 ${
                  plan.popular
                    ? 'border-pink-500 shadow-lg shadow-pink-500/20'
                    : 'border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.bestFor}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">/month</span>
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
                  href="/contact"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Choose Our Hosting Services?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">99.9% Uptime Guarantee</h4>
                    <p className="text-slate-400">Your website stays online when it matters most.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">24/7 Expert Support</h4>
                    <p className="text-slate-400">Real humans ready to help anytime you need them.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Free SSL Certificates</h4>
                    <p className="text-slate-400">Secure your site with automatic HTTPS encryption.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Free Daily Backups</h4>
                    <p className="text-slate-400">Sleep easy knowing your data is always protected.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-slate-900 rounded-xl">
                    <div className="text-3xl font-bold text-pink-400">99.9%</div>
                    <div className="text-slate-400 text-sm">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900 rounded-xl">
                    <div className="text-3xl font-bold text-purple-400">&lt;200ms</div>
                    <div className="text-slate-400 text-sm">Response</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900 rounded-xl">
                    <div className="text-3xl font-bold text-indigo-400">10K+</div>
                    <div className="text-slate-400 text-sm">Domains</div>
                  </div>
                  <div className="text-center p-4 bg-slate-900 rounded-xl">
                    <div className="text-3xl font-bold text-green-400">24/7</div>
                    <div className="text-slate-400 text-sm">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Launch Your Website?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Get your domain, hosting, and expert setup all in one place.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all"
          >
            Start Your Project
          </Link>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/services/cloud-devops"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Cloud & DevOps
          </Link>
          <Link
            href="/services"
            className="text-slate-400 hover:text-white transition-colors"
          >
            All Services
          </Link>
        </div>
      </section>
    </div>
  );
}
