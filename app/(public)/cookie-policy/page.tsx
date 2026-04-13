"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Cookie, Shield, Settings, Target, Mail, ChevronRight, Info } from "lucide-react"

export default function CookiePolicyPage() {
  const [lastUpdated] = useState("April 13, 2026")

  return (
    <div className="relative">
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80"
            alt="Cookie Policy Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cookie <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-lg text-slate-300">
              Understand how we use cookies to enhance your experience.
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
                <Cookie className="w-6 h-6 text-amber-400" />
                What Are Cookies
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
                <p>
                  At WPCodingPress, we use cookies to enhance your browsing experience, analyze website traffic, and 
                  personalize content. Cookies allow us to remember your preferences and provide you with a more tailored experience.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Settings className="w-6 h-6 text-amber-400" />
                Types of Cookies We Use
              </h2>
              <div className="text-slate-300 space-y-4 leading-relaxed">
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                  <h3 className="text-lg font-semibold text-white mb-3">Essential Cookies</h3>
                  <p className="text-slate-400">
                    These cookies are necessary for the website to function properly. They enable core functionality such as 
                    security, network management, and accessibility. You cannot opt out of these cookies as the website 
                    cannot function without them.
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                  <h3 className="text-lg font-semibold text-white mb-3">Performance & Analytics Cookies</h3>
                  <p className="text-slate-400">
                    These cookies help us understand how visitors interact with our website by collecting and reporting 
                    information anonymously. This helps us improve the site performance and user experience.
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                  <h3 className="text-lg font-semibold text-white mb-3">Functional Cookies</h3>
                  <p className="text-slate-400">
                    These cookies allow the website to remember choices you make (such as language preferences or 
                    region) and provide enhanced, more personal features. They may also be used to provide services 
                    you have asked for.
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                  <h3 className="text-lg font-semibold text-white mb-3">Marketing Cookies</h3>
                  <p className="text-slate-400">
                    These cookies are used to track visitors across websites. Their purpose is to display advertisements 
                    that are relevant and engaging for the individual user. We do not use marketing cookies.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Target className="w-6 h-6 text-amber-400" />
                How We Use Cookies
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>We use cookies for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To keep you logged in and maintain your session</li>
                  <li>To remember your preferences and settings</li>
                  <li>To analyze how our website is used and improve its performance</li>
                  <li>To understand how you found our website</li>
                  <li>To prevent fraud and ensure security</li>
                  <li>To provide customer support and improve our services</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Settings className="w-6 h-6 text-amber-400" />
                Managing Cookies
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>
                  You have the right to decide whether to accept or reject cookies. You can manage your cookie preferences 
                  through:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. 
                    You can configure your browser to reject all cookies or only accept certain cookies.</li>
                  <li><strong>Third-Party Tools:</strong> You can opt out of cookies through various third-party opt-out tools 
                    available online.</li>
                </ul>
                <p className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <Info className="w-5 h-5 inline-block mr-2 text-amber-400" />
                  <span className="text-amber-200">Please note that if you disable essential cookies, some parts of our website may not function properly.</span>
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-amber-400" />
                Third-Party Cookies
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>
                  Some cookies are placed by third-party services that appear on our pages. We do not control these 
                  third-party cookies. The third parties include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> For website analytics and performance measurement</li>
                  <li><strong>Payment Processors:</strong> For secure payment processing (Stripe, PayPal)</li>
                  <li><strong>Email Services:</strong> For transactional and marketing communications</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4">Updates to This Policy</h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, 
                  legal, or regulatory reasons. We will post any changes on this page and update the "Last Updated" date 
                  at the top.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl p-8 border border-violet-500/30">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-violet-400" />
                  Contact Us
                </h2>
                <p className="text-slate-300 mb-4">
                  If you have any questions about this Cookie Policy, please contact us:
                </p>
                <div className="text-slate-300">
                  <p><strong>Email:</strong> support@wpcodingpress.com</p>
                  <p><strong>Website:</strong> https://wpcodingpress.com/contact</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="bg-slate-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/privacy" className="text-slate-400 hover:text-violet-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-600">|</span>
            <Link href="/terms" className="text-slate-400 hover:text-violet-400 transition-colors">Terms of Service</Link>
            <span className="text-slate-600">|</span>
            <Link href="/refund" className="text-slate-400 hover:text-violet-400 transition-colors">Refund Policy</Link>
          </div>
          <p className="text-slate-500 text-sm mt-4">© 2026 WPCodingPress. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}