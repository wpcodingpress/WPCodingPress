"use client";

import { useEffect, useState } from "react";
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
  AlertCircle
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

interface Site {
  id: string;
  domain: string;
  wpSiteUrl: string;
  apiKey: string;
  status: string;
  lastSyncAt: string | null;
  createdAt: string;
  jobs: Array<{
    id: string;
    status: string;
    outputUrl: string | null;
    createdAt: string;
  }>;
}

interface Job {
  id: string;
  siteId: string;
  status: string;
  outputUrl: string | null;
  logs: string | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
  site: {
    domain: string;
  };
}

interface SubscriptionData {
  hasSubscription: boolean;
  subscription: {
    status: string;
    plan: string;
  } | null;
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingSite, setIsAddingSite] = useState(false);
  const [convertingSiteId, setConvertingSiteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ domain: "", wpSiteUrl: "" });
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sitesRes, jobsRes, subRes] = await Promise.all([
        fetch("/api/sites"),
        fetch("/api/convert"),
        fetch("/api/subscriptions"),
      ]);
      
      const sitesData = await sitesRes.json();
      const jobsData = await jobsRes.json();
      const subData = await subRes.json();
      
      setSites(sitesData.sites || []);
      setJobs(jobsData.jobs || []);
      setSubscriptionData(subData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionStatus = () => subscriptionData?.subscription?.status;
  const getSubscriptionPlan = () => subscriptionData?.subscription?.plan;
  const isEnterprise = getSubscriptionPlan() === 'enterprise';
  const hasActiveSubscription = getSubscriptionStatus() === 'active';

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
        setFormData({ domain: "", wpSiteUrl: "" });
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
        setSites(sites.filter(s => s.id !== siteId));
      }
    } catch (error) {
      console.error("Error deleting site:", error);
    }
  };

  const handleConvert = async (siteId: string) => {
    setConvertingSiteId(siteId);
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId }),
      });
      
      if (response.ok) {
        await fetchData();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to start conversion");
      }
    } catch (error) {
      console.error("Error converting site:", error);
    } finally {
      setConvertingSiteId(null);
    }
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    alert("API key copied!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <span className="flex items-center gap-1 text-green-600"><CheckCircle className="h-3 w-3" /> Connected</span>;
      case "disconnected":
        return <span className="flex items-center gap-1 text-red-600"><XCircle className="h-3 w-3" /> Disconnected</span>;
      default:
        return <span className="text-slate-500">{status}</span>;
    }
  };

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Completed</span>;
      case "processing":
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" /> Processing
        </span>;
      case "failed":
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Failed</span>;
      case "pending":
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">Pending</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Sites</h1>
          <p className="text-slate-500 mt-1">Manage your WordPress sites and convert them to headless</p>
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
                <DialogTitle>Add WordPress Site</DialogTitle>
                <DialogDescription>
                  Enter your WordPress site details to connect it to WPCodingPress.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="domain">
                    {isEnterprise ? "Custom Domain" : "Site Name"} 
                    {isEnterprise && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="domain"
                    placeholder={isEnterprise ? "mycustomdomain.com" : "my-site-name"}
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  />
                  {!isEnterprise && (
                    <p className="text-xs text-slate-500 mt-1">
                      Custom domain available on Enterprise plan. Enter any name for your default URL.
                    </p>
                  )}
                  {isEnterprise && (
                    <p className="text-xs text-green-600 mt-1">
                      Custom domain included with your Enterprise plan.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="wpSiteUrl">WordPress Site URL</Label>
                  <Input
                    id="wpSiteUrl"
                    placeholder="https://example.com"
                    value={formData.wpSiteUrl}
                    onChange={(e) => setFormData({ ...formData, wpSiteUrl: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddSite} disabled={isAddingSite} className="w-full">
                  {isAddingSite ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Add Site
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Subscription Warning */}
      {(!hasActiveSubscription) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Active subscription required</p>
            <p className="text-sm text-yellow-600">
              You need an active subscription to add sites and convert them to headless.{" "}
              <a href="/dashboard/subscription" className="underline">Upgrade now</a>
            </p>
          </div>
        </div>
      )}

      {/* Sites Grid */}
      {sites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Globe className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No sites connected</h3>
          <p className="text-slate-500 mt-1">Add your WordPress site to get started with headless conversion</p>
          {hasActiveSubscription && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Site
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add WordPress Site</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="domain">
                      {isEnterprise ? "Custom Domain" : "Site Name"} 
                      {isEnterprise && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="domain"
                      placeholder={isEnterprise ? "mycustomdomain.com" : "my-site-name"}
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    />
                    {!isEnterprise && (
                      <p className="text-xs text-slate-500 mt-1">
                        Custom domain available on Enterprise plan. Enter any name for your default URL.
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="wpSiteUrl">WordPress Site URL</Label>
                    <Input
                      id="wpSiteUrl"
                      placeholder="https://example.com"
                      value={formData.wpSiteUrl}
                      onChange={(e) => setFormData({ ...formData, wpSiteUrl: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddSite} disabled={isAddingSite} className="w-full">
                    {isAddingSite ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Add Site
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {sites.map((site) => {
            const latestJob = site.jobs?.[0];
            
            return (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{site.domain}</h3>
                      <p className="text-sm text-slate-500">{site.wpSiteUrl}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(site.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyApiKey(site.apiKey)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      API Key
                    </Button>
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

                {/* API Key Display */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">API Key</p>
                  <code className="text-sm font-mono text-slate-700">{site.apiKey}</code>
                  <p className="text-xs text-slate-500 mt-2">
                    Install the Headless WP Connector plugin on your WordPress site and enter this API key in the plugin settings.
                  </p>
                </div>

                {/* Conversion Status */}
                {latestJob && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Latest Conversion</p>
                        <p className="text-xs text-slate-500">
                          {new Date(latestJob.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {getJobStatusBadge(latestJob.status)}
                    </div>
                    {latestJob.outputUrl && (
                      <div className="mt-2">
                        <a 
                          href={latestJob.outputUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Live Site
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Convert Button */}
                {hasActiveSubscription && site.status === "connected" && (
                  <div className="mt-4">
                    <Button
                      onClick={() => handleConvert(site.id)}
                      disabled={convertingSiteId === site.id || latestJob?.status === "processing"}
                      className="w-full"
                    >
                      {convertingSiteId === site.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Convert to Headless
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recent Jobs */}
      {jobs.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Recent Conversion Jobs</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{job.site.domain}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(job.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getJobStatusBadge(job.status)}
                  {job.outputUrl && (
                    <a 
                      href={job.outputUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visit
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}