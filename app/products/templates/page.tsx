import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Next.js Templates | WPCodingPress',
  description: 'Production-ready Next.js templates for SaaS, portfolios, e-commerce, and more. Ship faster with our carefully crafted starting points.',
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-gray-500/20 border border-gray-500/30 rounded-full text-gray-300 text-sm font-medium mb-6">
            Coming Soon
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Next.js Templates
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Beautiful, production-ready templates to launch your next project in hours, not weeks.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-16">
            <div className="text-8xl mb-8">⚛️</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Template Collection Launching Soon
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Beautiful, responsive templates for every use case. Built with the latest Next.js features.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-full">SaaS Dashboards</span>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full">Portfolios</span>
              <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full">E-commerce</span>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full">Blogs</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/products/plugins" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            WordPress Plugins
          </Link>
          <Link href="/products/mcp-servers" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            MCP Servers
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
