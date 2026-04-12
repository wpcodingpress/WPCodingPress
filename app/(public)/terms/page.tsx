"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { FileText, Shield, Copyright, AlertTriangle, CheckCircle, XCircle, Mail } from "lucide-react"

export default function TermsPage() {
  const [lastUpdated] = useState("April 12, 2026")

  return (
    <div className="relative">
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
            alt="Terms Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Service</span>
            </h1>
            <p className="text-lg text-slate-300">
              Please read our terms carefully before using our services.
            </p>
            <p className="text-sm text-slate-500 mt-4">Last Updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-violet-400" />
                Acceptance of Terms
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>By accessing and using WPCodingPress services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-violet-400" />
                Our Services
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>WPCodingPress provides the following services:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>WordPress to Next.js website migration</li>
                  <li>Custom web development and design</li>
                  <li>E-commerce solutions (WooCommerce)</li>
                  <li>SEO and digital marketing services</li>
                  <li>Web application development</li>
                  <li>Cloud infrastructure and DevOps</li>
                  <li>Premium plugins, themes, and templates</li>
                  <li>MCP servers and AI agents</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Copyright className="w-6 h-6 text-violet-400" />
                Intellectual Property
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>All content, designs, code, and materials on our website are the intellectual property of WPCodingPress. You may not:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Copy, reproduce, or distribute our content without permission</li>
                  <li>Use our trademarks without written consent</li>
                  <li>Reverse engineer or decompile our products</li>
                  <li>Claim ownership of work created by WPCodingPress</li>
                </ul>
                <p className="mt-4">Clients retain ownership of their original content and receive proper licensing for any work delivered to them.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-violet-400" />
                Limitation of Liability
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>WPCodingPress shall not be liable for any:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Service interruptions or technical issues beyond our control</li>
                  <li>Third-party services or external links</li>
                </ul>
                <p className="mt-4">Our services are provided "as is" without warranties of any kind.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-violet-400" />
                Prohibited Uses
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>You may not use our services for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Illegal or unauthorized purposes</li>
                  <li>Violating any applicable laws or regulations</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Transmitting malicious code or viruses</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4">
                Contact Information
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>For questions about these Terms of Service, contact us:</p>
                <p className="text-violet-400">Email: support@wpcodingpress.com</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}