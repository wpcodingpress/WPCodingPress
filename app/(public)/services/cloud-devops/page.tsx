import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cloud & DevOps Services | WPCodingPress',
  description: 'Expert cloud infrastructure setup, deployment automation, CI/CD pipelines, and DevOps consulting for modern web applications.',
  keywords: 'cloud services, DevOps, AWS, GCP, Azure, CI/CD, Docker, Kubernetes, deployment automation',
};

const features = [
  { title: 'Cloud Infrastructure Setup', description: 'Complete AWS, Google Cloud, or Azure infrastructure.', icon: '☁️' },
  { title: 'CI/CD Pipeline Setup', description: 'Automated deployment pipelines for seamless delivery.', icon: '🔄' },
  { title: 'Docker & Containerization', description: 'Application containerization for consistent environments.', icon: '🐳' },
  { title: 'Kubernetes Orchestration', description: 'Container orchestration for auto-scaling and HA.', icon: '☸️' },
  { title: 'Infrastructure as Code', description: 'Terraform and CloudFormation templates.', icon: '📝' },
  { title: 'Monitoring & Logging', description: 'Comprehensive monitoring for performance visibility.', icon: '📊' },
];

export default function CloudDevOpsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-6">
            Cloud & DevOps
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Scale Without
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Limits
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Enterprise-grade cloud infrastructure and DevOps practices 
            that make your applications unstoppable.
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
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Modernize?</h2>
          <p className="text-xl text-slate-400 mb-10">Get a free infrastructure assessment.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors">
            Schedule Consultation
          </Link>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/services/web-applications" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Web Applications
          </Link>
          <Link href="/services/domain-hosting" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            Domain & Hosting
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
