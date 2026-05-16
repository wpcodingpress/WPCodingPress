"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Zap,
  Copy,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Rocket,
  Link as LinkIcon,
  Check,
  Clock,
  Ban,
} from "lucide-react";
import { useToast } from "@/components/toast-notifications";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEMPLATES, isAdaptiveTemplate } from "@/components/templates";
import type { AIAnalysisResult } from "@/lib/ai/types";

interface Site {
  id: string;
  domain: string;
  wpSiteUrl: string;
  apiKey: string;
  status: string;
  template: string;
  vercelProjectId: string | null;
  vercelProjectUrl: string | null;
  customDomain: string | null;
  deploymentStatus: string | null;
  lastSyncAt: string | null;
  createdAt: string;
  deployments?: Deployment[];
  domains?: Domain[];
}

interface Deployment {
  id: string;
  siteId: string;
  status: string;
  deploymentUrl: string | null;
  error: string | null;
  trigger: string;
  template: string | null;
  buildLogs: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  vercelDeploymentId: string | null;
}

interface Domain {
  id: string;
  domain: string;
  verificationStatus: string;
  sslStatus: string;
  dnsRecords: Array<{ type: string; name: string; value: string }> | null;
  createdAt: string;
}

interface SubscriptionData {
  hasSubscription: boolean;
  subscription: {
    status: string;
    plan: string;
  } | null;
}

const deploymentStatusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  queued: { label: "Queued", color: "bg-blue-100 text-blue-700" },
  building: { label: "Building", color: "bg-indigo-100 text-indigo-700" },
  deployed: { label: "Live", color: "bg-green-100 text-green-700" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-600" },
};

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [deployingSiteId, setDeployingSiteId] = useState<string | null>(null);
  const [pollingDeploymentIds, setPollingDeploymentIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ domain: "", wpSiteUrl: "", apiKey: "" });
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("news");
  const [convertSiteId, setConvertSiteId] = useState<string | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const [addSiteError, setAddSiteError] = useState<string | null>(null);
  const [showAddSite, setShowAddSite] = useState(false);

  const [showDomainDialog, setShowDomainDialog] = useState(false);
  const [domainSiteId, setDomainSiteId] = useState<string | null>(null);
  const [domainInput, setDomainInput] = useState("");
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [domainResult, setDomainResult] = useState<{
    dnsRecords: Array<{ type: string; name: string; value: string }>;
  } | null>(null);

  const [analyzingSiteId, setAnalyzingSiteId] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<Record<string, AIAnalysisResult>>({});
  const [expandedAnalysis, setExpandedAnalysis] = useState<Set<string>>(new Set());

  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [sitesRes, deploymentsRes, subRes] = await Promise.all([
        fetch("/api/sites"),
        fetch("/api/convert"),
        fetch("/api/subscriptions"),
      ]);

      const sitesData = await sitesRes.json();
      const deploymentsData = await deploymentsRes.json();
      const subData = await subRes.json();

      setSites(sitesData.sites || []);
      setDeployments(deploymentsData.jobs || []);
      setSubscriptionData(
        subData.automation
          ? { hasSubscription: true, subscription: subData.automation }
          : { hasSubscription: false, subscription: null }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (pollingDeploymentIds.size === 0) return;

    const pollInterval = setInterval(async () => {
      for (const depId of pollingDeploymentIds) {
        try {
          const response = await fetch(`/api/vercel/status/${depId}`);
          if (response.ok) {
            const data = await response.json();
            const dep = data.deployment;
            setDeployments((prev) =>
              prev.map((d) => (d.id === depId ? { ...d, ...dep } : d))
            );

            if (["deployed", "failed", "cancelled"].includes(dep.status)) {
              setPollingDeploymentIds((prev) => {
                const next = new Set(prev);
                next.delete(depId);
                return next;
              });
              await fetchData();
            }
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [pollingDeploymentIds, fetchData]);

  const getSubscriptionStatus = () => subscriptionData?.subscription?.status;
  const hasActiveSubscription = getSubscriptionStatus() === "active";

  const handleAddSite = async () => {
    if (!formData.domain || !formData.wpSiteUrl) return;
    setIsAddingSite(true);
    setAddSiteError(null);
    try {
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        setSites([data.site, ...sites]);
        setFormData({ domain: "", wpSiteUrl: "", apiKey: "" });
        setShowAddSite(false);
        showToast("success", "Site connected", `${data.site.domain} has been connected successfully.`);
      } else {
        const error = await response.json();
        setAddSiteError(error.error || "Failed to add site");
        showToast("error", "Failed to add site", error.error || "An error occurred while connecting your site.");
      }
    } catch (error) {
      console.error("Error adding site:", error);
      setAddSiteError("An unexpected error occurred. Please try again.");
      showToast("error", "Connection error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsAddingSite(false);
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;
    try {
      const response = await fetch(`/api/sites?id=${siteId}`, { method: "DELETE" });
      if (response.ok) {
        setSites(sites.filter((s) => s.id !== siteId));
      }
    } catch (error) {
      console.error("Error deleting site:", error);
    }
  };

  const openTemplateDialog = (siteId: string) => {
    setConvertSiteId(siteId);
    const site = sites.find((s) => s.id === siteId);
    setSelectedTemplate(site?.template || "news");
    setShowTemplateDialog(true);
  };

  const handleConvert = async () => {
    if (!convertSiteId) return;
    setShowTemplateDialog(false);
    setDeployingSiteId(convertSiteId);

    try {
      const response = await fetch("/api/vercel/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: convertSiteId,
          options: { template: selectedTemplate },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDeployments((prev) => [
          {
            id: data.deploymentId,
            siteId: convertSiteId,
            status: "pending",
            deploymentUrl: null,
            error: null,
            trigger: "manual",
            template: selectedTemplate,
            buildLogs: null,
            startedAt: new Date().toISOString(),
            completedAt: null,
            createdAt: new Date().toISOString(),
            vercelDeploymentId: null,
          } as Deployment,
          ...prev,
        ]);
        setPollingDeploymentIds((prev) => new Set(prev).add(data.deploymentId));
        showToast("success", "Deployment started", "Your site is being deployed. This may take a few minutes.");
      } else {
        const error = await response.json();
        showToast("error", "Deployment failed", error.error || "Failed to start deployment.");
      }
    } catch (error) {
      console.error("Error converting site:", error);
      showToast("error", "Deployment error", "Failed to start deployment. Please try again.");
    } finally {
      setDeployingSiteId(null);
      setConvertSiteId(null);
    }
  };

  const handleRedeploy = async (siteId: string) => {
    setDeployingSiteId(siteId);
    try {
      const response = await fetch("/api/vercel/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "redeploy", siteId }),
      });

      if (response.ok) {
        const data = await response.json();
        setDeployments((prev) => [
          {
            id: data.deploymentId,
            siteId,
            status: "pending",
            deploymentUrl: null,
            error: null,
            trigger: "manual",
            template: null,
            buildLogs: null,
            startedAt: new Date().toISOString(),
            completedAt: null,
            createdAt: new Date().toISOString(),
            vercelDeploymentId: null,
          } as Deployment,
          ...prev,
        ]);
        setPollingDeploymentIds((prev) => new Set(prev).add(data.deploymentId));
        showToast("success", "Redeploy started", "Your site is being redeployed.");
      } else {
        const error = await response.json();
        showToast("error", "Redeploy failed", error.error || "Failed to redeploy.");
      }
    } catch (error) {
      console.error("Error redeploying:", error);
      showToast("error", "Redeploy error", "An unexpected error occurred. Please try again.");
    } finally {
      setDeployingSiteId(null);
    }
  };

  const openDomainDialog = (siteId: string) => {
    setDomainSiteId(siteId);
    setDomainInput("");
    setDomainResult(null);
    setShowDomainDialog(true);
  };

  const handleAddDomain = async () => {
    if (!domainSiteId || !domainInput) return;
    setIsAddingDomain(true);
    setDomainResult(null);
    try {
      const response = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: domainSiteId, domain: domainInput }),
      });
      if (response.ok) {
        const data = await response.json();
        setDomainResult({ dnsRecords: data.dnsRecords });
        showToast("success", "Domain added", `${domainInput} has been added. Configure the DNS records below.`);
      } else {
        const error = await response.json();
        showToast("error", "Failed to add domain", error.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error adding domain:", error);
      showToast("error", "Domain error", "An unexpected error occurred.");
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      const response = await fetch(`/api/domains/${domainId}/verify`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        showToast("success", "Domain verified", data.message || "Domain verification was successful.");
        await fetchData();
      } else {
        const error = await response.json();
        showToast("error", "Verification failed", error.error || "Could not verify domain.");
      }
    } catch (error) {
      console.error("Error verifying domain:", error);
      showToast("error", "Verification error", "An unexpected error occurred.");
    }
  };

  const handleRemoveDomain = async (domainId: string) => {
    if (!confirm("Remove this custom domain?")) return;
    try {
      const response = await fetch(`/api/domains?domainId=${domainId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error removing domain:", error);
    }
  };

  const handleAnalyzeSite = async (siteId: string) => {
    setAnalyzingSiteId(siteId);
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });
      if (response.ok) {
        const data = await response.json();
        const aiResult: AIAnalysisResult = {
          template: data.ai.template,
          layout: data.ai.layout,
          sections: data.ai.sections,
          brand: data.ai.brand,
          contentScores: data.ai.contentScores || [],
          homepage: data.ai.homepage,
          recommendations: data.ai.recommendations,
          processingTime: data.ai.processingTime,
          modelVersion: data.ai.modelVersion || 'wpai-rule-based-1.0',
        };
        setAnalysisResults((prev) => ({ ...prev, [siteId]: aiResult }));
        setExpandedAnalysis((prev) => new Set(prev).add(siteId));
        showToast("success", "Analysis complete", `Industry: ${data.industry.category} (${data.industry.confidence}% confidence)`);
      } else {
        const error = await response.json();
        showToast("error", "Analysis failed", error.error || "Failed to analyze site.");
      }
    } catch (error) {
      console.error("Error analyzing site:", error);
      showToast("error", "Analysis error", "An unexpected error occurred.");
    } finally {
      setAnalyzingSiteId(null);
    }
  };

  const toggleLogs = (deploymentId: string) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(deploymentId)) next.delete(deploymentId);
      else next.add(deploymentId);
      return next;
    });
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const getSiteStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <span className="flex items-center gap-1 text-green-600 text-sm">
            <CheckCircle className="h-3 w-3" /> Connected
          </span>
        );
      case "disconnected":
        return (
          <span className="flex items-center gap-1 text-red-600 text-sm">
            <XCircle className="h-3 w-3" /> Disconnected
          </span>
        );
      default:
        return <span className="text-slate-500 text-sm">{status}</span>;
    }
  };

  const getDeploymentStatusBadge = (status: string) => {
    const config = deploymentStatusLabels[status] || {
      label: status,
      color: "bg-slate-100 text-slate-700",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {status === "building" && <Loader2 className="h-3 w-3 inline animate-spin mr-1" />}
        {config.label}
      </span>
    );
  };

  const latestDeployment = (siteId: string): Deployment | undefined => {
    return deployments.find((d) => d.siteId === siteId);
  };

  const siteDomains = (siteId: string): Domain[] => {
    const site = sites.find((s) => s.id === siteId);
    return site?.domains || [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Sites</h1>
          <p className="text-slate-500 mt-1">
            Manage your WordPress sites and headless deployments
          </p>
        </div>

        {hasActiveSubscription && (
          <Dialog open={showAddSite} onOpenChange={(open: boolean) => { setShowAddSite(open); if (!open) setAddSiteError(null); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Site
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white text-xl">Connect Your WordPress Site</DialogTitle>
                <DialogDescription className="text-slate-300 text-left">
                  Follow these simple steps to connect your WordPress site.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-6">
                <div className="bg-slate-800 rounded-lg p-4 space-y-3 border border-slate-700">
                  <p className="font-semibold text-white flex items-center gap-2">
                    <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Install the WordPress Plugin
                  </p>
                  <p className="text-sm text-slate-300 ml-8">
                    Download the plugin from your{" "}
                    <a href="/dashboard/downloads" className="text-purple-300 underline font-medium hover:text-purple-200">
                      Downloads page
                    </a>
                    , then upload and activate it on your WordPress site.
                  </p>
                  <p className="font-semibold text-white flex items-center gap-2 mt-4">
                    <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Generate API Key
                  </p>
                  <p className="text-sm text-slate-300 ml-8">
                    Go to <strong className="text-white">Settings → Headless Connector</strong> in WordPress admin, click <strong className="text-white">"Generate New API Key"</strong>.
                  </p>
                  <p className="font-semibold text-white flex items-center gap-2 mt-4">
                    <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    Paste API Key Below
                  </p>
                  <p className="text-sm text-slate-300 ml-8">
                    Copy the API key and paste it below.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wpSiteUrl" className="text-white font-semibold">Your WordPress Site URL</Label>
                    <Input
                      id="wpSiteUrl"
                      placeholder="https://mywordpress.com"
                      value={formData.wpSiteUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, wpSiteUrl: e.target.value })
                      }
                      className="mt-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apiKey" className="text-white font-semibold">Plugin API Key</Label>
                    <Input
                      id="apiKey"
                      placeholder="hwpc_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={formData.apiKey}
                      onChange={(e) =>
                        setFormData({ ...formData, apiKey: e.target.value })
                      }
                      className="mt-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain" className="text-white font-semibold">Site Name</Label>
                    <Input
                      id="domain"
                      placeholder="my-site (used for identification)"
                      value={formData.domain}
                      onChange={(e) =>
                        setFormData({ ...formData, domain: e.target.value })
                      }
                      className="mt-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
                {addSiteError && (
                  <div className="flex items-start gap-2 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-200">{addSiteError}</p>
                  </div>
                )}
                <Button
                  onClick={handleAddSite}
                  disabled={isAddingSite || !formData.wpSiteUrl || !formData.apiKey}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5"
                >
                  {isAddingSite ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying Connection...</>
                  ) : (
                    <><Zap className="mr-2 h-4 w-4" /> Connect & Verify Site</>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Subscription Warning */}
      {!hasActiveSubscription && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Active subscription required</p>
            <p className="text-sm text-yellow-600">
              You need an active subscription to add sites and deploy them.{" "}
              <a href="/dashboard/subscription" className="underline">
                Upgrade now
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Sites Grid */}
      {sites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Globe className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No sites connected</h3>
          <p className="text-slate-500 mt-1">
            Connect your WordPress site to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {sites.map((site) => {
            const latestDep = latestDeployment(site.id);
            const domains = siteDomains(site.id);
            const isDeploying = deployingSiteId === site.id;
            const hasLiveDeployment = site.deploymentStatus === "deployed";

            return (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                {/* Site Header */}
                <div className="p-5 flex items-start justify-between border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-purple-100">
                      <Globe className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {site.domain}
                        </h3>
                        {getSiteStatusBadge(site.status)}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{site.wpSiteUrl}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasLiveDeployment && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDomainDialog(site.id)}
                      >
                        <LinkIcon className="h-4 w-4 mr-1" />
                        Domain
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteSite(site.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Live Site URL */}
                {(site.vercelProjectUrl || site.customDomain) && (
                  <div className="px-5 py-3 bg-green-50 border-b border-green-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-slate-600">Live at:</span>
                      <a
                        href={site.customDomain ? `https://${site.customDomain}` : site.vercelProjectUrl!.startsWith("http") ? site.vercelProjectUrl! : `https://${site.vercelProjectUrl!}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:underline font-medium flex items-center gap-1"
                      >
                        {site.customDomain || site.vercelProjectUrl?.replace(/^https?:\/\//, "")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Domains */}
                {domains.length > 0 && (
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                      Custom Domains
                    </p>
                    <div className="space-y-2">
                      {domains.map((dom) => (
                        <div
                          key={dom.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-3 w-3 text-slate-400" />
                            <span className="font-medium text-slate-700">
                              {dom.domain}
                            </span>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded ${
                                dom.verificationStatus === "verified"
                                  ? "bg-green-100 text-green-700"
                                  : dom.verificationStatus === "failed"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {dom.verificationStatus}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerifyDomain(dom.id)}
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleRemoveDomain(dom.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Intelligence Section */}
                {analysisResults[site.id] && (
                  <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
                    <button
                      onClick={() => {
                        setExpandedAnalysis((prev) => {
                          const next = new Set(prev);
                          if (next.has(site.id)) next.delete(site.id);
                          else next.add(site.id);
                          return next;
                        });
                      }}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-purple-100">
                          <Zap className="h-3.5 w-3.5 text-purple-600" />
                        </div>
                        <span className="text-sm font-semibold text-purple-900">
                          AI Intelligence
                        </span>
                        <span className="text-xs text-purple-500">
                          ({analysisResults[site.id].processingTime}ms)
                        </span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-purple-400 transition-transform ${expandedAnalysis.has(site.id) ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedAnalysis.has(site.id) && (
                      <div className="mt-3 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {analysisResults[site.id].template.templateName}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            Hero: {analysisResults[site.id].layout.heroLayout}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {analysisResults[site.id].sections.length} sections
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                            {analysisResults[site.id].brand.visualTone} tone
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="bg-white rounded-lg p-2.5 border border-purple-100">
                            <p className="text-[10px] text-purple-500 font-medium uppercase tracking-wide">Brand Color</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: analysisResults[site.id].brand.primaryColor }} />
                              <span className="text-xs font-mono text-slate-600">{analysisResults[site.id].brand.primaryColor}</span>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-2.5 border border-purple-100">
                            <p className="text-[10px] text-purple-500 font-medium uppercase tracking-wide">Modernity</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{analysisResults[site.id].brand.modernity}/100</p>
                          </div>
                          <div className="bg-white rounded-lg p-2.5 border border-purple-100">
                            <p className="text-[10px] text-purple-500 font-medium uppercase tracking-wide">Content</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">
                              {analysisResults[site.id].contentScores.length} scored items
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-2.5 border border-purple-100">
                            <p className="text-[10px] text-purple-500 font-medium uppercase tracking-wide">Card Style</p>
                            <p className="text-sm font-bold text-slate-800 mt-1 capitalize">{analysisResults[site.id].layout.cardStyle}</p>
                          </div>
                        </div>
                        {analysisResults[site.id].recommendations.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-purple-700 mb-1.5">Recommendations</p>
                            <div className="space-y-1">
                              {analysisResults[site.id].recommendations.slice(0, 3).map((rec) => (
                                <div key={rec.id} className="flex items-start gap-2 text-xs text-slate-600">
                                  <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                    rec.priority === 'critical' ? 'bg-red-500' :
                                    rec.priority === 'high' ? 'bg-orange-500' :
                                    rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                  }`} />
                                  <span>{rec.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Deployment Section */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">
                        Deployments
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {site.status === "connected" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAnalyzeSite(site.id)}
                            disabled={analyzingSiteId === site.id}
                            className={analysisResults[site.id] ? 'text-purple-600 border-purple-300' : ''}
                          >
                            {analyzingSiteId === site.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Zap className="h-4 w-4 mr-1" />
                            )}
                            {analyzingSiteId === site.id ? 'Analyzing...' : 'Analyze'}
                          </Button>
                          {hasLiveDeployment ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRedeploy(site.id)}
                              disabled={isDeploying}
                            >
                              {isDeploying ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <RefreshCw className="h-4 w-4 mr-1" />
                              )}
                              Redeploy
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => openTemplateDialog(site.id)}
                              disabled={isDeploying}
                            >
                              {isDeploying ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <Zap className="h-4 w-4 mr-1" />
                              )}
                              Deploy
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Latest Deployment */}
                  {latestDep && (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDeploymentStatusBadge(latestDep.status)}
                          <span className="text-xs text-slate-400">
                            {new Date(latestDep.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {latestDep.deploymentUrl && (
                            <a
                              href={latestDep.deploymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-purple-600 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Open
                            </a>
                          )}
                          <button
                            onClick={() => toggleLogs(latestDep.id)}
                            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                          >
                            <FileText className="h-3 w-3" />
                            Logs
                            {expandedLogs.has(latestDep.id) ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Build Logs */}
                      {expandedLogs.has(latestDep.id) && latestDep.buildLogs && (
                        <pre className="mt-3 p-3 bg-slate-900 text-green-400 text-xs rounded-lg overflow-x-auto max-h-48 overflow-y-auto font-mono leading-relaxed">
                          {latestDep.buildLogs}
                        </pre>
                      )}

                      {/* Error — visible banner */}
                      {latestDep.status === "failed" && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-300 rounded-lg">
                          <div className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="font-medium text-red-800 text-sm">Deployment Failed</p>
                              <p className="text-red-700 text-xs mt-1">
                                {latestDep.error || 'An unknown error occurred during deployment.'}
                              </p>
                              <p className="text-red-600 text-xs mt-1">
                                Try redeploying or check the build logs for details.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Template Info */}
                  <div className="mt-2 text-xs text-slate-400">
                    Template: {site.template}
                    {site.lastSyncAt && (
                      <> — Last synced: {new Date(site.lastSyncAt).toLocaleString()}</>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Deployment History */}
      {deployments.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Deployment History
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {deployments.slice(0, 10).map((dep) => {
              const site = sites.find((s) => s.id === dep.siteId);
              return (
                <div key={dep.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getDeploymentStatusBadge(dep.status)}
                    <div>
                      <p className="font-medium text-slate-900">
                        {site?.domain || "Unknown Site"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(dep.createdAt).toLocaleString()}
                        {dep.template && <> — Template: {dep.template}</>}
                        {dep.trigger === "webhook" && (
                          <span className="ml-2 text-blue-500">(auto-rebuild)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {dep.deploymentUrl && (
                      <a
                        href={dep.deploymentUrl.startsWith("http") ? dep.deploymentUrl : `https://${dep.deploymentUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Visit
                      </a>
                    )}
                    <button
                      onClick={() => toggleLogs(dep.id)}
                      className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" />
                      Logs
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a Template for Deployment</DialogTitle>
            <DialogDescription>
              Select a design template for your headless WordPress site.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`cursor-pointer rounded-lg border-2 p-4 transition ${
                  selectedTemplate === template.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-4xl mb-2 text-center">{template.preview}</div>
                <h3 className="font-semibold text-center text-slate-900">
                  {template.name}
                </h3>
                <p className="text-xs text-slate-500 text-center mt-2 line-clamp-3">
                  {template.description}
                </p>
                {selectedTemplate === template.id && (
                  <div className="mt-3 flex justify-center">
                    <Check className="h-5 w-5 text-purple-500" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {convertSiteId && analysisResults[convertSiteId] && isAdaptiveTemplate(selectedTemplate) && (
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">AI Analysis Results</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-purple-500 font-medium mb-1">Template</p>
                  <p className="text-sm font-semibold text-slate-800">{analysisResults[convertSiteId].template.templateName}</p>
                  <p className="text-xs text-slate-500">{analysisResults[convertSiteId].template.reason}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-500 font-medium mb-1">Hero Layout</p>
                  <p className="text-sm font-semibold text-slate-800 capitalize">{analysisResults[convertSiteId].layout.heroLayout}</p>
                  <p className="text-xs text-slate-500">Width: {analysisResults[convertSiteId].layout.contentWidth}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-500 font-medium mb-1">Sections</p>
                  <div className="flex flex-wrap gap-1">
                    {analysisResults[convertSiteId].sections.slice(0, 5).map((s) => (
                      <span key={s.section} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                        {s.section}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-purple-500 font-medium mb-1">Brand</p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: analysisResults[convertSiteId].brand.primaryColor }} />
                    <span className="text-sm text-slate-700">{analysisResults[convertSiteId].brand.visualTone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConvert}>
              <Zap className="mr-2 h-4 w-4" />
              Start Deployment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Domain Dialog */}
      <Dialog open={showDomainDialog} onOpenChange={setShowDomainDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Custom Domain</DialogTitle>
            <DialogDescription>
              Add your own domain to your deployed headless site.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!domainResult ? (
              <>
                <div>
                  <Label htmlFor="customDomain">Your Domain</Label>
                  <Input
                    id="customDomain"
                    placeholder="blog.example.com"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Enter a subdomain (e.g., blog.example.com) or root domain
                  </p>
                </div>
                <Button
                  onClick={handleAddDomain}
                  disabled={isAddingDomain || !domainInput}
                  className="w-full"
                >
                  {isAddingDomain ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Domain...</>
                  ) : (
                    <><LinkIcon className="mr-2 h-4 w-4" /> Add Custom Domain</>
                  )}
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-medium text-green-800 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Domain Added Successfully
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Configure the following DNS records at your domain registrar:
                  </p>
                </div>
                <div className="space-y-2">
                  {domainResult.dnsRecords.map((record, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 rounded-lg p-3 text-sm font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-600">
                          {record.type}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `${record.type} ${record.name} ${record.value}`
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-slate-600 mt-1">
                        <span className="text-slate-400">Name:</span> {record.name}
                      </p>
                      <p className="text-slate-600">
                        <span className="text-slate-400">Value:</span> {record.value}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  DNS changes may take up to 48 hours to propagate. SSL certificates
                  are provisioned automatically by Vercel.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowDomainDialog(false)}
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
