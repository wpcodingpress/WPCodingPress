import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Domain & Hosting Setup | WPCodingPress',
  description: 'Professional domain registration, hosting configuration, SSL certificates, DNS management, and 24/7 support for your website.',
  keywords: 'domain registration, web hosting, SSL certificate, DNS setup, website hosting, domain transfer',
};

const features = [
  { title: 'Domain Registration', description: 'Register and manage your perfect domain.', icon: '🌐' },
  { title: 'Hosting Setup', description: 'Expert configuration for optimal performance.', icon: '🖥️' },
  { title: 'SSL Certificates', description: 'Secure your website with proper SSL.', icon: '🔒' },
  { title: 'DNS Management', description: 'Professional DNS configuration.', icon: '⚙️' },
  { title: 'Migration Services', description: 'Zero-downtime migration from any host.', icon: '📦' },
  { title: '24/7 Support', description: 'Round-the-clock technical support.', icon: '🎧' },
];

export default function DomainHostingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to get your website online and keep it running smoothly.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Launch?</h2>
          <p className="text-xl text-slate-400 mb-10">Start your project today.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors">
            Get Started
          </Link>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/services/cloud-devops" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Cloud & DevOps
          </Link>
          <Link href="/services" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            All Services
          </Link>
        </div>
      </section>
    </div>
  );
}
