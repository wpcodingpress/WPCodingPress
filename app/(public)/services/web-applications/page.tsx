import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Web Applications | WPCodingPress',
  description: 'Custom web applications built with modern frameworks. React, Next.js, Node.js, and more for your business needs.',
  keywords: 'web application development, custom software, react, next.js, node.js, frontend development',
};

const features = [
  { title: 'Custom Development', description: 'Tailored solutions built for your specific needs.', icon: '🛠️' },
  { title: 'Modern Frameworks', description: 'React, Next.js, Vue, or Angular - we use the best.', icon: '⚛️' },
  { title: 'API Integration', description: 'Connect to any third-party service or build custom APIs.', icon: '🔌' },
  { title: 'Real-time Features', description: 'WebSockets, live updates, and collaborative features.', icon: '⚡' },
  { title: 'Scalable Architecture', description: 'Built to grow with your business.', icon: '📈' },
  { title: 'Performance Optimized', description: 'Lightning-fast apps that users love.', icon: '🚀' },
];

const services = [
  { name: 'Frontend Development', price: 'From $500' },
  { name: 'Full-Stack Application', price: 'From $2,000' },
  { name: 'API Development', price: 'From $800' },
  { name: 'SaaS Application', price: 'From $5,000' },
];

export default function WebApplicationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
            Web Applications
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Custom Web
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Applications
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Powerful, scalable web applications built with modern technologies. 
            From simple tools to complex enterprise solutions.
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="flex justify-between items-center p-6 bg-slate-800 border border-slate-700 rounded-2xl">
                <div>
                  <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                </div>
                <div className="text-blue-400 font-bold">{service.price}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/contact" className="inline-block px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/services/seo-marketing" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            SEO & Marketing
          </Link>
          <Link href="/services/cloud-devops" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            Cloud & DevOps
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
