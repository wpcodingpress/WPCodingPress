"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Zap,
  Crown,
  Rocket,
  Loader2,
  CheckCircle,
  XCircle,
  Mail,
  AlertTriangle,
  X,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const automationPlans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with WordPress to Next.js conversion",
    icon: Zap,
    color: "slate",
    planId: "free",
    features: [
      "1 WordPress site conversion",
      "Basic Next.js template",
      "Community support",
      "Basic SEO setup",
    ]
  },
  {
    name: "Pro",
    price: 19,
    period: "month",
    description: "Convert 1 WordPress site to Next.js",
    icon: Crown,
    color: "primary",
    popular: true,
    planId: "pro",
    features: [
      "1 WordPress site conversion",
      "Live deployment",
      "Advanced Next.js template",
      "Priority email support",
      "Custom domain",
      "Analytics dashboard",
      "Auto content sync",
    ]
  },
  {
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "Convert 3 WordPress sites to Next.js",
    icon: Rocket,
    color: "purple",
    planId: "enterprise",
    features: [
      "3 WordPress site conversions",
      "Live deployments",
      "Advanced Next.js templates",
      "Priority email support",
      "Custom domains",
      "Analytics dashboard",
      "Auto content sync",
      "White-label option",
    ]
  }
];

export default function SubscriptionPage() {
  const searchParams = useSearchParams();
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  // Automation
  const [automationSub, setAutomationSub] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // Web Dev
  const [webDevSub, setWebDevSub] = useState<any>(null);
  const [showWebDevCancelModal, setShowWebDevCancelModal] = useState(false);
  const [isWebDevCancelling, setIsWebDevCancelling] = useState(false);
  const [webDevCancelSuccess, setWebDevCancelSuccess] = useState(false);

  // Verification
  const [showVerify, setShowVerify] = useState(false);
  const [gumroadEmail, setGumroadEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);

  const success = searchParams.get('success');
  const cancelled = searchParams.get('cancelled');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      const data = await response.json();
      if (data.automation) {
        setAutomationSub(data.automation);
        setCurrentPlan(data.automation.plan);
      }
      if (data.webDev) {
        setWebDevSub(data.webDev);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return;

    setIsLoading(planId);

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.subscription || data.message) {
        if (data.subscription) {
          setAutomationSub(data.subscription);
          setCurrentPlan(data.subscription.plan);
          setVerifySuccess(true);
        }
        alert(data.message || 'Subscription activated!');
      } else {
        alert(data.error || 'Failed to create subscription. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const handleVerifySubscription = async () => {
    if (!gumroadEmail) {
      setVerifyError("Please enter your Gumroad email");
      return;
    }

    setIsVerifying(true);
    setVerifyError("");

    try {
      const response = await fetch('/api/verify-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gumroadEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setVerifySuccess(true);
        setCurrentPlan(data.plan);
        setShowVerify(false);
      } else {
        setVerifyError(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerifyError('Something went wrong. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancelAutomation = async () => {
    setIsCancelling(true);

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setCancelSuccess(true);
        setAutomationSub(null);
        setCurrentPlan('free');
        setShowCancelModal(false);
      } else {
        alert(data.error || 'Failed to cancel subscription. Please try again.');
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelWebDev = async () => {
    setIsWebDevCancelling(true);

    try {
      const response = await fetch('/api/web-dev-subscriptions', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setWebDevCancelSuccess(true);
        setWebDevSub(null);
        setShowWebDevCancelModal(false);
      } else {
        alert(data.error || 'Failed to cancel subscription. Please try again.');
      }
    } catch (error) {
      console.error('Cancel web dev subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsWebDevCancelling(false);
    }
  };

  if (isLoadingPlan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const automationPlanName = currentPlan === 'enterprise' ? 'Enterprise' : currentPlan === 'pro' ? 'Pro' : 'Free';
  const webDevPlanName = webDevSub?.plan === 'STARTER' ? 'Starter' : webDevSub?.plan === 'COMPLETE' ? 'Complete' : null;

  return (
    <div className="space-y-8">
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Payment received!</p>
            <p className="text-sm text-green-600">Now verify your subscription below.</p>
          </div>
        </div>
      )}

      {cancelled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <XCircle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-800">Payment cancelled</p>
            <p className="text-sm text-yellow-600">You can subscribe anytime from this page.</p>
          </div>
        </div>
      )}

      {verifySuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Subscription activated!</p>
            <p className="text-sm text-green-600">You now have access to all features.</p>
          </div>
        </div>
      )}

      {cancelSuccess && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">Automation plan cancelled</p>
            <p className="text-sm text-amber-600">You will have access until the end of your billing period.</p>
          </div>
        </div>
      )}

      {webDevCancelSuccess && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">Web Development plan cancelled</p>
            <p className="text-sm text-amber-600">Your website will remain live until the end of your billing period.</p>
          </div>
        </div>
      )}

      {/* ─── Section 1: Web Development Plan ─── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Web Development Plan</h2>
        </div>

        {webDevSub ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden ${
              webDevSub.plan === 'COMPLETE'
                ? 'bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600'
                : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600'
            }`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/20">
                    {webDevSub.plan === 'COMPLETE' ? (
                      <Crown className="w-6 h-6" />
                    ) : (
                      <Zap className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl sm:text-2xl font-bold">{webDevPlanName} Plan</h3>
                      <Badge className="bg-green-400 text-green-900 border-0 text-xs font-semibold">
                        {webDevSub.cancelAtPeriodEnd ? 'Cancelling' : 'Active'}
                      </Badge>
                    </div>
                    <p className="text-white/70 text-sm">
                      {webDevSub.billingCycle === 'annual' ? 'Annual Billing' : 'Monthly Billing'}
                      {webDevSub.currentPeriodEnd && (
                        <> — Next billing: {new Date(webDevSub.currentPeriodEnd).toLocaleDateString()}</>
                      )}
                    </p>
                    {webDevSub.cancelAtPeriodEnd && (
                      <p className="text-amber-300 text-sm mt-1 font-medium">
                        Cancels at end of billing period ({new Date(webDevSub.currentPeriodEnd).toLocaleDateString()})
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-medium"
                    asChild
                  >
                    <Link href="/dashboard/web-dev">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Manage Project
                    </Link>
                  </Button>
                  {!webDevSub.cancelAtPeriodEnd && (
                    <Button
                      variant="outline"
                      className="border-red-300/50 text-red-200 hover:bg-red-500/20 hover:text-red-100"
                      onClick={() => setShowWebDevCancelModal(true)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center"
          >
            <div className="p-4 rounded-full bg-purple-100 w-fit mx-auto mb-4">
              <Layers className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Web Development Plan Active</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Get a professional website built by our team. Choose from Starter or Complete plans with dedicated project management.
            </p>
            <Button
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-200"
              asChild
            >
              <Link href="/web-dev-plans">
                <Rocket className="w-4 h-4 mr-2" />
                View Web Development Plans
              </Link>
            </Button>
          </motion.div>
        )}
      </section>

      {/* ─── Section 2: WordPress Automation Plans ─── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-pink-500">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">WordPress Automation</h2>
        </div>

        {automationSub && !showVerify && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  automationSub.plan === 'enterprise' ? 'bg-purple-100' : 'bg-pink-100'
                }`}>
                  {automationSub.plan === 'enterprise' ? (
                    <Rocket className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Crown className="w-5 h-5 text-pink-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Current Plan: {automationPlanName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {automationSub.plan === 'enterprise' ? '$99/month - 3 sites' : '$19/month - 1 site'}
                    {automationSub.currentPeriodEnd && (
                      <> — Renews {new Date(automationSub.currentPeriodEnd).toLocaleDateString()}</>
                    )}
                  </p>
                  {automationSub.cancelAtPeriodEnd && (
                    <p className="text-amber-600 text-sm mt-0.5 font-medium">
                      Cancels at end of billing period
                    </p>
                  )}
                </div>
              </div>
              {!automationSub.cancelAtPeriodEnd && (
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 shrink-0"
                  onClick={() => setShowCancelModal(true)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Automation Plan
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {automationPlans.map((plan, index) => {
            const isCurrentPlan = currentPlan === plan.planId || (plan.planId === 'free' && !currentPlan);

            return (
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
                  disabled={isLoading === plan.planId || isCurrentPlan}
                  onClick={() => handleSubscribe(plan.planId)}
                >
                  {isLoading === plan.planId ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Current Plan
                    </>
                  ) : plan.price === 0 ? (
                    'Get Started'
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Manual Verification Button */}
        <div className="text-center mt-4">
          <Button
            variant="link"
            onClick={() => setShowVerify(true)}
          >
            Already paid? Verify your subscription
          </Button>
        </div>
      </section>

      {/* ─── Cancel Automation Modal ─── */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="p-3 rounded-full bg-red-100 w-fit mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Cancel Automation Plan?</h3>
                <p className="text-slate-500 mt-2">
                  Are you sure you want to cancel your {automationPlanName} plan?
                  You will lose access to premium features at the end of your billing period.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Plan
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleCancelAutomation}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Plan'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Cancel Web Dev Modal ─── */}
      <AnimatePresence>
        {showWebDevCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="p-3 rounded-full bg-red-100 w-fit mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Cancel Web Development Plan?</h3>
                <p className="text-slate-500 mt-2">
                  Are you sure you want to cancel your {webDevPlanName} Plan?
                </p>
                <p className="text-sm text-purple-600 font-medium mt-2 bg-purple-50 p-2 rounded-lg">
                  Your website will remain live until the end of your billing period.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200"
                  onClick={() => setShowWebDevCancelModal(false)}
                >
                  Keep Plan
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleCancelWebDev}
                  disabled={isWebDevCancelling}
                >
                  {isWebDevCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Plan'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Verification Modal ─── */}
      <AnimatePresence>
        {showVerify && !verifySuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVerify(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Verify Your Subscription</h3>
                <p className="text-slate-500 mt-2">
                  Enter the email you used on Gumroad to activate your subscription.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="gumroadEmail" className="text-slate-700 font-medium">Gumroad Email</Label>
                  <Input
                    id="gumroadEmail"
                    type="email"
                    placeholder="your-email@gmail.com"
                    value={gumroadEmail}
                    onChange={(e) => setGumroadEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {verifyError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{verifyError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowVerify(false);
                      setGumroadEmail("");
                      setVerifyError("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleVerifySubscription}
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Activate'
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center mt-4">
                Having trouble? Contact support for assistance.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
