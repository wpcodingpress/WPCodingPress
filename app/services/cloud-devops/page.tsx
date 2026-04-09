import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cloud & DevOps Services | WPCodingPress',
  description: 'Expert cloud infrastructure setup, deployment automation, CI/CD pipelines, and DevOps consulting for modern web applications.',
  keywords: 'cloud services, DevOps, AWS, GCP, Azure, CI/CD, Docker, Kubernetes, deployment automation',
};

const cloudFeatures = [
  {
    title: 'Cloud Infrastructure Setup',
    description: 'Complete AWS, Google Cloud, or Azure infrastructure with best practices for security, scalability, and cost optimization.',
    icon: '☁️',
  },
  {
    title: 'CI/CD Pipeline Setup',
    description: 'Automated deployment pipelines with GitHub Actions, GitLab CI, or Jenkins for seamless code delivery.',
    icon: '🔄',
  },
  {
    title: 'Docker & Containerization',
    description: 'Application containerization for consistent environments across development, staging, and production.',
    icon: '🐳',
  },
  {
    title: 'Kubernetes Orchestration',
    description: 'Container orchestration for auto-scaling, load balancing, and high availability applications.',
    icon: '☸️',
  },
  {
    title: 'Infrastructure as Code',
    description: 'Terraform and CloudFormation templates for reproducible, version-controlled infrastructure.',
    icon: '📝',
  },
  {
    title: 'Monitoring & Logging',
    description: 'Comprehensive monitoring with Datadog, New Relic, or cloud-native tools for performance visibility.',
    icon: '📊',
  },
];

const techStack = [
  { name: 'AWS', category: 'Cloud' },
  { name: 'Google Cloud', category: 'Cloud' },
  { name: 'Azure', category: 'Cloud' },
  { name: 'Docker', category: 'Containers' },
  { name: 'Kubernetes', category: 'Orchestration' },
  { name: 'Terraform', category: 'IaC' },
  { name: 'GitHub Actions', category: 'CI/CD' },
  { name: 'Jenkins', category: 'CI/CD' },
  { name: 'Vercel', category: 'Deployment' },
  { name: 'Netlify', category: 'Deployment' },
];

const processSteps = [
  {
    step: 1,
    title: 'Infrastructure Assessment',
    description: 'Analyze your current setup and requirements for optimal cloud architecture.',
  },
  {
    step: 2,
    title: 'Architecture Design',
    description: 'Design scalable, secure, and cost-effective infrastructure blueprints.',
  },
  {
    step: 3,
    title: 'Implementation',
    description: 'Deploy infrastructure with automation and comprehensive documentation.',
  },
  {
    step: 4,
    title: 'Monitoring Setup',
    description: 'Configure alerts, dashboards, and logging for operational excellence.',
  },
];

export default function CloudDevOpsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
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
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Enterprise-grade cloud infrastructure, automated deployments, and DevOps practices 
            that make your applications unstoppable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              Get Cloud Assessment
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

      {/* Features Grid */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need for Modern Infrastructure
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From initial setup to ongoing operations, we handle your entire cloud journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cloudFeatures.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:border-indigo-500/50 transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Technologies We Master
            </h2>
            <p className="text-slate-400">
              Industry-leading tools for your infrastructure needs.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-slate-800 border border-slate-700 rounded-full text-white hover:border-indigo-500 hover:bg-indigo-500/10 transition-all"
              >
                <span className="font-medium">{tech.name}</span>
                <span className="text-slate-500 text-sm ml-2">({tech.category})</span>
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
              Our DevOps Process
            </h2>
            <p className="text-slate-400">
              A systematic approach to delivering reliable infrastructure.
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

      {/* Benefits */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Invest in DevOps?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Faster Deployments</h4>
                    <p className="text-slate-400">Reduce deployment time from days to minutes with automated pipelines.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">99.9% Uptime</h4>
                    <p className="text-slate-400">Rock-solid infrastructure with automatic failover and monitoring.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Cost Optimization</h4>
                    <p className="text-slate-400">Right-sized infrastructure that scales with your actual needs.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Security First</h4>
                    <p className="text-slate-400">Built-in security scanning, secrets management, and compliance.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-8">
                <div className="space-y-4 font-mono text-sm">
                  <div className="text-slate-500"># Your CI/CD Pipeline</div>
                  <div className="text-green-400">✓ Checkout code</div>
                  <div className="text-green-400">✓ Run tests</div>
                  <div className="text-green-400">✓ Build application</div>
                  <div className="text-green-400">✓ Deploy to staging</div>
                  <div className="text-yellow-400">⏳ Deploy to production...</div>
                  <div className="text-green-400">✓ Live in 3 minutes!</div>
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
            Ready to Modernize Your Infrastructure?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Get a free infrastructure audit and discover opportunities for improvement.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all"
          >
            Schedule Free Consultation
          </Link>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/services/web-applications"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Web Applications
          </Link>
          <Link
            href="/services/domain-hosting"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            Domain & Hosting
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
