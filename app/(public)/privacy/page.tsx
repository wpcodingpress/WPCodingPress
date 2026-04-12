"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Shield, Lock, Eye, Database, Mail, ChevronRight } from "lucide-react"

export default function PrivacyPage() {
  const [lastUpdated] = useState("April 12, 2026")

  return (
    <div className="relative">
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
            alt="Privacy Background"
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
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-lg text-slate-300">
              Your privacy matters to us. Learn how we protect your data.
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
                Information We Collect
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information (name, email, password)</li>
                  <li>Profile details and preferences</li>
                  <li>Payment information (processed securely through third parties)</li>
                  <li>Communication history and support tickets</li>
                  <li>Website data for migration services</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-violet-400" />
                How We Use Your Information
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Communicate with you about products, services, and events</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 text-violet-400" />
                Data Security
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>We implement appropriate technical and organizational security measures to protect your personal information, including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>SSL/TLS encryption for all data transmission</li>
                  <li>Secure storage with industry-standard encryption</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication requirements</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-violet-400" />
                Your Rights
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing</li>
                  <li>Request transfer of your personal data</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Mail className="w-6 h-6 text-violet-400" />
                Contact Us
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <p className="text-violet-400">Email: support@wpcodingpress.com</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}