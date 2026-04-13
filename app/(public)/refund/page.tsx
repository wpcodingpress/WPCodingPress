"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { CreditCard, Shield, AlertCircle, RefreshCw, Mail, Clock, CheckCircle, XCircle } from "lucide-react"

export default function RefundPolicyPage() {
  const [lastUpdated] = useState("April 13, 2026")

  return (
    <div className="relative">
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&q=80"
            alt="Refund Policy Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-slate-950/95" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Refund <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-lg text-slate-300">
              Our refund policy and commitment to customer satisfaction.
            </p>
            <p className="text-sm text-slate-500 mt-4">Last Updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Refund Policy</h3>
                    <p className="text-slate-300">
                      At WPCodingPress, we do <strong>not</strong> offer refunds for any of our services, products, 
                      or subscriptions. All sales are final. This policy applies to all customers regardless of 
                      the subscription plan or service type.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-violet-400" />
                Why We Do Not Offer Refunds
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>
                  We have a strict no-refund policy for the following reasons:
                </p>
                <div className="grid gap-4 mt-4">
                  <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Instant Service Delivery
                    </h3>
                    <p className="text-slate-400">
                      Our services are delivered immediately upon purchase. Once you receive access to our 
                      platform, the service has been fully provided.
                    </p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Custom Work & Development
                    </h3>
                    <p className="text-slate-400">
                      All development work, code, and custom solutions created for you are unique and 
                      cannot be resold or reused. This represents significant time and resources invested.
                    </p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Operational Costs
                    </h3>
                    <p className="text-slate-400">
                      Our infrastructure, team, and ongoing development costs are incurred immediately 
                      upon your subscription. We do not recover these costs from refunds.
                    </p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Fair Business Practice
                    </h3>
                    <p className="text-slate-400">
                      Our pricing is competitive and transparent. We encourage all customers to fully 
                      evaluate our services before making a purchase decision.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-violet-400" />
                What If Something Goes Wrong
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>
                  While we do not offer refunds, we are committed to resolving any issues you encounter:
                </p>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Service Not Working</h4>
                      <p className="text-slate-400 text-sm mt-1">
                        If our service is not functioning as described, contact our support team. 
                        We will work to resolve the issue promptly.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Technical Issues</h4>
                      <p className="text-slate-400 text-sm mt-1">
                        For any technical problems, our team will provide troubleshooting assistance 
                        and workarounds where possible.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-white">Billing Errors</h4>
                      <p className="text-slate-400 text-sm mt-1">
                        If you notice any incorrect charges, contact us immediately. We will review 
                        and correct any verifiable billing errors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Clock className="w-6 h-6 text-violet-400" />
                Before You Purchase
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>
                  We encourage you to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Review all service descriptions and features on our website</li>
                  <li>Contact our sales team with any questions before purchasing</li>
                  <li>Take advantage of any free trials or demos if available</li>
                  <li>Read our documentation and FAQ sections</li>
                  <li>Understand the full scope of services included in your plan</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-violet-400" />
                Subscription Cancellation
              </h2>
              <div className="text-slate-300 space-y-3 leading-relaxed">
                <p>
                  While we do not offer refunds, you may cancel your subscription at any time:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cancel through your account dashboard settings</li>
                  <li>Contact our support team to request cancellation</li>
                  <li>Your subscription will remain active until the end of your current billing period</li>
                  <li>You will not be charged for subsequent billing cycles after cancellation</li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl p-8 border border-violet-500/30">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-violet-400" />
                  Questions About This Policy
                </h2>
                <p className="text-slate-300 mb-4">
                  If you have any questions about this Refund Policy, please contact us:
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
            <Link href="/cookie-policy" className="text-slate-400 hover:text-violet-400 transition-colors">Cookie Policy</Link>
          </div>
          <p className="text-slate-500 text-sm mt-4">© 2026 WPCodingPress. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}