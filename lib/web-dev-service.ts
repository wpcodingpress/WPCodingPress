export const WEB_DEV_PLANS = {
  STARTER: {
    name: "Starter",
    monthlyPrice: 29,
    annualPrice: 290,
    monthlyEquivalent: 24.17,
    annualSavings: 58,
    features: [
      "Dedicated Project Manager",
      "Professional Design Team",
      "Content Writing Team",
      "Development Team",
      "Full Testing & QA",
      "SEO-Optimized Website",
      "100% Responsive Design",
      "Your Choice of Platform (WordPress/Elementor/Next.js/React)",
      "Delivery Within 3 Business Days*",
      "Monthly Maintenance & Updates",
      "Priority Email Support",
      "Ongoing Support While Active",
    ],
    tier1Features: [
      "Dedicated Project Manager",
      "Professional Design Team",
      "Content Writing Team",
      "Development Team",
      "Full Testing & QA",
      "SEO-Optimized Website",
      "100% Responsive Design",
      "Your Choice of Platform",
      "Delivery Within 3 Business Days*",
      "Monthly Maintenance & Updates",
      "Priority Email Support",
    ],
  },
  COMPLETE: {
    name: "Complete",
    monthlyPrice: 59,
    annualPrice: 590,
    monthlyEquivalent: 49.17,
    annualSavings: 118,
    features: [
      "Everything in Starter, PLUS:",
      "Domain Registration Included",
      "Premium Hosting Included",
      "SSL Certificate Included",
      "Professional Email Setup",
      "No Technical Setup Required",
      "We Handle Absolutely Everything",
      "Dedicated Project Manager",
      "Professional Design Team",
      "Content Writing Team",
      "Development Team",
      "Full Testing & QA",
      "SEO-Optimized Website",
      "100% Responsive Design",
      "Your Choice of Platform",
      "Delivery Within 3 Business Days*",
      "Monthly Maintenance & Updates",
    ],
    tier2Features: [
      "Everything in Starter, PLUS:",
      "Domain Registration Included",
      "Premium Hosting Included",
      "SSL Certificate Included",
      "Professional Email Setup",
      "No Technical Setup Required",
      "We Handle Absolutely Everything",
    ],
  },
} as const;

export type WebDevPlan = keyof typeof WEB_DEV_PLANS;
export type BillingCycle = "monthly" | "annual";
export type ProjectStatus = "RECEIVED" | "DISCUSSION" | "DESIGN" | "DEVELOPMENT" | "TESTING" | "LIVE";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  RECEIVED: "Onboarding Received",
  DISCUSSION: "Project Discussion",
  DESIGN: "Design Phase",
  DEVELOPMENT: "Development",
  TESTING: "Testing & QA",
  LIVE: "Live 🎉",
};

export const PROJECT_STATUS_ORDER: ProjectStatus[] = [
  "RECEIVED",
  "DISCUSSION",
  "DESIGN",
  "DEVELOPMENT",
  "TESTING",
  "LIVE",
];

export function getGumroadProductLink(plan: WebDevPlan, billingCycle: BillingCycle): string {
  const key = `GUMROAD_${plan}_${billingCycle === "monthly" ? "MONTHLY" : "ANNUAL"}_LINK` as const;
  return process.env[key] || "";
}

export function getPlanPrice(plan: WebDevPlan, billingCycle: BillingCycle): number {
  const planConfig = WEB_DEV_PLANS[plan];
  return billingCycle === "monthly" ? planConfig.monthlyPrice : planConfig.annualPrice;
}

export function getDeliverySla(complexity: string): string {
  return complexity === "COMPLEX" ? "5-7 Business Days" : "Within 3 Business Days";
}

export function createCheckoutUrl(plan: WebDevPlan, billingCycle: BillingCycle, origin?: string): string {
  const link = getGumroadProductLink(plan, billingCycle);
  const baseUrl = origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const successUrl = `${baseUrl}/onboarding?plan=${plan}&billing=${billingCycle}`;
  const cancelUrl = `${baseUrl}/web-dev-plans?cancelled=true`;
  return `${link}?success=${encodeURIComponent(successUrl)}&cancel=${encodeURIComponent(cancelUrl)}`;
}

export function isWebDevPlan(plan: string): boolean {
  return plan === 'STARTER' || plan === 'COMPLETE';
}

export function getCurrencySymbol(currency: string): string {
  return currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
}
