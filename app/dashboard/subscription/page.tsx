"use client";

import { motion } from "framer-motion";
import { 
  CreditCard, 
  Check, 
  Zap, 
  Crown,
  Rocket,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started",
    icon: Zap,
    color: "slate",
    features: [
      "Access to free products",
      "Basic support",
      "Community access",
      "Email notifications"
    ]
  },
  {
    name: "Pro",
    price: 49,
    period: "month",
    description: "Best for professionals",
    icon: Crown,
    color: "primary",
    popular: true,
    features: [
      "All free features",
      "Priority support",
      "Access to Pro products",
      "Early access to new features",
      "Downloadable resources",
      "Priority updates"
    ]
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    description: "For large teams",
    icon: Rocket,
    color: "purple",
    features: [
      "All Pro features",
      "Dedicated support",
      "Custom development",
      "White-label options",
      "API access",
      "SLA guarantee"
    ]
  }
];

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900">Choose Your Plan</h1>
        <p className="text-slate-500 mt-2">Select the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl border-2 p-6 relative ${
              plan.popular 
                ? "border-primary shadow-lg" 
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className={`inline-flex p-3 rounded-full mb-4 ${
                plan.color === 'primary' ? 'bg-primary/10' :
                plan.color === 'purple' ? 'bg-purple-100' :
                'bg-slate-100'
              }`}>
                <plan.icon className={`h-6 w-6 ${
                  plan.color === 'primary' ? 'text-primary' :
                  plan.color === 'purple' ? 'text-purple-600' :
                  'text-slate-600'
                }`} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
            </div>

            <div className="text-center mb-6">
              <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
              <span className="text-slate-500">/{plan.period}</span>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <div className={`p-1 rounded-full ${
                    plan.color === 'primary' ? 'bg-primary/10' :
                    plan.color === 'purple' ? 'bg-purple-100' :
                    'bg-slate-100'
                  }`}>
                    <Check className={`h-3 w-3 ${
                      plan.color === 'primary' ? 'text-primary' :
                      plan.color === 'purple' ? 'text-purple-600' :
                      'text-slate-600'
                    }`} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              className="w-full" 
              variant={plan.popular ? "default" : "outline"}
            >
              {plan.price === 0 ? "Current Plan" : "Subscribe Now"}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-slate-500 text-sm">
          Need a custom plan?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
