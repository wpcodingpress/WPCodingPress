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
import { TEMPLATES } from "@/components/templates";

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

  const [showDomainDialog, setShowDomainDialog] = useState(false);
  const [domainSiteId, setDomainSiteId] = useState<string | null>(null);
  const [domainInput, setDomainInput] = useState("");
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [domainResult, setDomainResult] = useState<{
    dnsRecords: Array<{ type: string; name: string; value: string }>;
  } | null>(null);

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
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add site");
      }
    } catch (error) {
      console.error("Error adding site:", error);
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
      } else {
        const error = await response.json();
        alert(error.error || "Failed to start deployment");
      }
    } catch (error) {
      console.error("Error converting site:", error);
      alert("Failed to start deployment. Please try again.");
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
      } else {
        const error = await response.json();
        alert(error.error || "Failed to redeploy");
      }
    } catch (error) {
      console.error("Error redeploying:", error);
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
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add domain");
      }
    } catch (error) {
      console.error("Error adding domain:", error);
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
        alert(data.message);
        await fetchData();
      } else {
        const error = await response.json();
        alert(error.error || "Verification failed");
      }
    } catch (error) {
      console.error("Error verifying domain:", error);
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Site
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Your WordPress Site</DialogTitle>
                <DialogDescription className="text-left">
                  Follow these simple steps to connect your WordPress site.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <p className="font-semibold text-blue-900 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                    Install the WordPress Plugin
                  </p>
                  <p className="text-sm text-blue-800 ml-8">
                    Download the plugin from your{" "}
                    <a href="/dashboard/downloads" className="underline font-medium">
                      Downloads page
                    </a>
                    , then upload and activate it on your WordPress site.
                  </p>
                  <p className="font-semibold text-blue-900 flex items-center gap-2 mt-4">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                    Generate API Key
                  </p>
                  <p className="text-sm text-blue-800 ml-8">
                    Go to <strong>Settings → Headless Connector</strong> in WordPress admin, click <strong>"Generate New API Key"</strong>.
                  </p>
                  <p className="font-semibold text-blue-900 flex items-center gap-2 mt-4">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                    Paste API Key Below
                  </p>
                  <p className="text-sm text-blue-800 ml-8">
                    Copy the API key and paste it below.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wpSiteUrl">Your WordPress Site URL</Label>
                    <Input
                      id="wpSiteUrl"
                      placeholder="https://mywordpress.com"
                      value={formData.wpSiteUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, wpSiteUrl: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="apiKey">Plugin API Key</Label>
                    <Input
                      id="apiKey"
                      placeholder="hwpc_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={formData.apiKey}
                      onChange={(e) =>
                        setFormData({ ...formData, apiKey: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain">Site Name</Label>
                    <Input
                      id="domain"
                      placeholder="my-site (used for identification)"
                      value={formData.domain}
                      onChange={(e) =>
                        setFormData({ ...formData, domain: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddSite}
                  disabled={isAddingSite || !formData.wpSiteUrl || !formData.apiKey}
                  className="w-full"
                >
                  {isAddingSite ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</>
                  ) : (
                    <><Zap className="mr-2 h-4 w-4" /> Connect Site</>
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
                        href={site.customDomain ? `https://${site.customDomain}` : site.vercelProjectUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:underline font-medium flex items-center gap-1"
                      >
                        {site.customDomain || site.vercelProjectUrl?.replace("https://", "")}
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

                      {/* Error */}
                      {latestDep.status === "failed" && latestDep.error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                          {latestDep.error}
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
                        href={dep.deploymentUrl}
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
            <DialogTitle>Choose Your Template</DialogTitle>
            <DialogDescription>
              Select a design template for your headless site.
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
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConvert}>
              <Zap className="mr-2 h-4 w-4" />
              Deploy Now
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
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                  ) : (
                    <><LinkIcon className="mr-2 h-4 w-4" /> Add Domain</>
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
