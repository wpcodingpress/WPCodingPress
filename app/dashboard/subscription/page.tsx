"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Check, 
  Zap, 
  Crown,
  Rocket,
  Loader2,
  CheckCircle,
  XCircle,
  Mail,
  AlertTriangle,
  ArrowUpCircle,
  ArrowDownCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const plans = [
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
    description: "Convert up to 5 WordPress sites to headless Next.js",
    icon: Crown,
    color: "primary",
    popular: true,
    planId: "pro",
    features: [
      "5 WordPress to Headless conversions",
      "Live deployed sites (Vercel/Render)",
      "Advanced Next.js templates",
      "Priority email support",
      "Custom domain support",
      "Analytics dashboard",
      "Auto content sync",
    ]
  },
  {
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "Unlimited conversions for agencies and businesses",
    icon: Rocket,
    color: "purple",
    planId: "enterprise",
    features: [
      "Unlimited conversions",
      "White-label deployment",
      "24/7 Dedicated support",
      "Custom domain included",
      "API access",
      "Advanced analytics",
      "Team collaboration",
      "Custom integrations",
    ]
  }
];

export default function SubscriptionPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [showVerify, setShowVerify] = useState(false);
  const [gumroadEmail, setGumroadEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  
  const success = searchParams.get('success');
  const cancelled = searchParams.get('cancelled');

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      const data = await response.json();
      if (data.subscription) {
        setCurrentPlan(data.subscription.plan);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
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

      console.log('Subscription response:', data);

      if (data.url) {
        window.location.href = data.url;
      } else if (data.subscription || data.message) {
        if (data.subscription) {
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

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.")) {
      return;
    }

    setIsCancelling(true);

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setCancelSuccess(true);
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

  if (isLoadingPlan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <p className="font-medium text-amber-800">Subscription cancelled!</p>
            <p className="text-sm text-amber-600">You will have access until the end of your billing period.</p>
          </div>
        </div>
      )}

      {(currentPlan === 'pro' || currentPlan === 'enterprise') && !showVerify && !verifySuccess && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                currentPlan === 'enterprise' ? 'bg-purple-100' : 'bg-pink-100'
              }`}>
                {currentPlan === 'enterprise' ? (
                  <Rocket className="w-6 h-6 text-purple-600" />
                ) : (
                  <Crown className="w-6 h-6 text-pink-600" />
                )}
              </div>
              <div>
                <p className="font-bold text-lg text-slate-900">
                  Current Plan: {currentPlan === 'enterprise' ? 'Enterprise' : 'Pro'}
                </p>
                <p className="text-sm text-slate-500">
                  {currentPlan === 'enterprise' ? '$99/month - Unlimited conversions' : '$19/month - 5 WordPress sites'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setShowCancelModal(true)}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Subscription
            </Button>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
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
                <h3 className="text-xl font-bold text-slate-900">Cancel Subscription?</h3>
                <p className="text-slate-500 mt-2">
                  Are you sure you want to cancel your {currentPlan === 'enterprise' ? 'Enterprise' : 'Pro'} subscription? 
                  You will lose access to premium features at the end of your billing period.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Subscription
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Subscription'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showVerify && !verifySuccess && (
        <>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900">Choose Your Plan</h1>
            <p className="text-slate-500 mt-2">Select the plan that best fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => {
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
          {currentPlan && (
            <div className="text-center mt-4">
              <Button
                variant="link"
                onClick={() => setShowVerify(true)}
              >
                Already paid? Verify your subscription
              </Button>
            </div>
          )}
        </>
      )}

      {/* Verification Modal */}
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