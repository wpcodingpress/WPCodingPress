import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MCP Servers | WPCodingPress',
  description: 'Model Context Protocol servers for seamless AI integration. Connect AI models to your tools, data, and workflows.',
};

export default function MCPServersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-6">
            Coming Soon
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            MCP Servers
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Model Context Protocol servers that connect AI to your world. Build smarter AI applications.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-16">
            <div className="text-8xl mb-8">🤖</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              MCP Server Collection In Development
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Connect AI models to databases, APIs, filesystems, and more. The standard for AI tool integration.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full">Database Connectors</span>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full">API Integrations</span>
              <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full">File Operations</span>
              <span className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full">Web Scraping</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/products/templates" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Next.js Templates
          </Link>
          <Link href="/products/ai-agents" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            AI Agents
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
