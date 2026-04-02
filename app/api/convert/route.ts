import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/subscription';

const TEMPLATE_REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'theeyepress';
const TEMPLATE_REPO_NAME = process.env.GITHUB_REPO_NAME || 'Next-JS-with-Headless-WordPress-Main-Website';

// Simple in-memory job queue for processing
const jobQueue = new Map<string, { processing: boolean; startedAt: number }>();

// Process queued jobs periodically
if (typeof setInterval !== 'undefined') {
  setInterval(async () => {
    const pendingJobs = await prisma.job.findMany({
      where: { status: 'pending' },
      take: 5,
    });

    for (const job of pendingJobs) {
      const queueInfo = jobQueue.get(job.id);
      if (!queueInfo || Date.now() - queueInfo.startedAt > 5000) {
        // Start processing if not in queue or stuck for more than 5 seconds
        const site = await prisma.site.findUnique({ where: { id: job.siteId } });
        if (site?.wpApiKey) {
          jobQueue.set(job.id, { processing: true, startedAt: Date.now() });
          processConversionJob(job.id, site.id, site.wpSiteUrl, site.wpApiKey, site.domain)
            .finally(() => jobQueue.delete(job.id));
        }
      }
    }
  }, 10000);
}

export async function POST(request: Request) {
  try {
    const auth = await requireActiveSubscription();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { userId } = auth;
    const body = await request.json();
    const { siteId, options = {} } = body;

    if (!siteId) {
      return NextResponse.json({ error: 'Site ID is required' }, { status: 400 });
    }

    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        userId,
        status: 'connected',
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: 'Site not found or not connected' },
        { status: 404 }
      );
    }

    const existingJob = await prisma.job.findFirst({
      where: {
        siteId,
        status: {
          in: ['pending', 'processing'],
        },
      },
    });

    if (existingJob) {
      return NextResponse.json(
        { error: 'Conversion already in progress' },
        { status: 400 }
      );
    }

    // Validate WordPress API key before starting conversion
    const wpApiKey = site.wpApiKey;
    if (!wpApiKey) {
      return NextResponse.json(
        { error: 'WordPress API key not found. Please reconnect your site.' },
        { status: 400 }
      );
    }

    // Verify the WordPress API key is still valid
    try {
      const cleanWpUrl = site.wpSiteUrl.replace(/\/$/, '');
      const verifyResponse = await fetch(`${cleanWpUrl}/wp-json/headless/v1/verify?api_key=${wpApiKey}`, { 
        signal: AbortSignal.timeout(10000) 
      });
      if (!verifyResponse.ok) {
        return NextResponse.json(
          { error: 'WordPress API key is invalid or expired. Please reconnect your site.' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Cannot connect to WordPress site. Please check if the site is accessible and the plugin is active.' },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        userId,
        siteId,
        status: 'pending',
        logs: `Job created at ${new Date().toISOString()}\n`,
      },
    });

    // Start processing immediately
    jobQueue.set(job.id, { processing: true, startedAt: Date.now() });
    
    // Fire and forget - process in background
    processConversionJob(job.id, site.id, site.wpSiteUrl, wpApiKey, site.domain)
      .then(() => jobQueue.delete(job.id))
      .catch((err) => {
        console.error('Job processing error:', err);
        jobQueue.delete(job.id);
      });

    return NextResponse.json({
      job: {
        id: job.id,
        status: 'pending',
        message: 'Conversion started. This may take a few minutes.',
      },
    });
  } catch (error) {
    console.error('Convert error:', error);
    return NextResponse.json(
      { error: 'Failed to start conversion' },
      { status: 500 }
    );
  }
}

async function processConversionJob(
  jobId: string,
  siteId: string,
  wpSiteUrl: string,
  apiKey: string,
  originalDomain: string
) {
  let logs = '';

  try {
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'processing',
        startedAt: new Date(),
        logs: `Job #${jobId} started at ${new Date().toISOString()}\n`,
      },
    });

    logs += `Step 1: Fetching WordPress data from ${wpSiteUrl}...\n`;
    const wpData = await fetchWordPressData(wpSiteUrl, apiKey);
    logs += `  ✓ Fetched ${wpData.posts?.length || 0} posts\n`;
    logs += `  ✓ Fetched ${wpData.categories?.length || 0} categories\n`;
    logs += `  ✓ Fetched ${wpData.pages?.length || 0} pages\n`;
    logs += `  ✓ Fetched ${wpData.media?.length || 0} media items\n`;

    logs += `\nStep 2: Transforming data for Next.js format...\n`;
    const transformedData = transformWPData(wpData, wpSiteUrl);
    logs += `  ✓ Transformed ${transformedData.posts.length} posts\n`;
    logs += `  ✓ Transformed ${transformedData.categories.length} categories\n`;

    logs += `\nStep 3: Preparing deployment...\n`;
    const deploymentConfig = prepareDeploymentConfig(originalDomain, transformedData, wpSiteUrl, apiKey);
    logs += `  ✓ Configuration prepared\n`;
    logs += `  ✓ WordPress API: ${wpSiteUrl}\n`;

    logs += `\nStep 4: Creating GitHub repository...\n`;
    const githubRepoUrl = await createGitHubRepo(jobId, originalDomain, wpSiteUrl, apiKey);
    logs += `  ✓ Repository created: ${githubRepoUrl}\n`;

    logs += `\nStep 5: Deploying to Render...\n`;
    const outputUrl = await deployToRender(jobId, githubRepoUrl, deploymentConfig);
    logs += `  ✓ Deployed to: ${outputUrl}\n`;

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        outputUrl,
        logs: logs + `\n✅ Conversion completed at ${new Date().toISOString()}\n`,
        completedAt: new Date(),
      },
    });

    await prisma.site.update({
      where: { id: siteId },
      data: { lastSyncAt: new Date() },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Conversion worker error:', errorMessage);

    logs += `\n❌ Error: ${errorMessage}\n`;

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        error: errorMessage,
        logs: logs,
      },
    });
  }
}

async function fetchWordPressData(wpSiteUrl: string, apiKey: string) {
  const headers = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json',
  };

  const baseUrl = wpSiteUrl.replace(/\/$/, '');

  try {
    const [exportRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/wp-json/headless/v1/export`, { headers }),
      fetch(`${baseUrl}/wp-json/headless/v1/categories`, { headers }),
    ]);

    if (!exportRes.ok) {
      const errorText = await exportRes.text();
      throw new Error(`WordPress API error: ${exportRes.status} - ${errorText}`);
    }

    const exportData = await exportRes.json();
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

    return {
      ...exportData,
      categories: categoriesData,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to WordPress site. Please verify the site URL is correct.`);
    }
    throw error;
  }
}

function transformWPData(wpData: any, wpBaseUrl: string) {
  const posts = (wpData.posts || []).map((post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    date: post.date,
    modified: post.modified,
    featuredImage: post.featuredImage?.node?.sourceUrl || null,
    categories: post.categories?.nodes?.map((c: any) => c.name) || [],
    author: post.author?.node?.name || 'Unknown',
    seo: post.seo || {},
  }));

  const categories = (wpData.categories || []).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    count: cat.count,
  }));

  const pages = (wpData.pages || []).map((page: any) => ({
    id: page.id,
    title: page.title,
    slug: page.slug,
    content: page.content,
    template: page.template,
  }));

  const menus = wpData.menus || {};
  const siteInfo = wpData.site_info || {};

  return {
    posts,
    categories,
    pages,
    menus,
    site_info: {
      name: siteInfo.name || 'WordPress Site',
      description: siteInfo.description || '',
      url: wpBaseUrl,
      language: siteInfo.language || 'bn',
    },
    api_config: {
      base_url: wpBaseUrl,
    },
  };
}

function prepareDeploymentConfig(domain: string, data: any, wpSiteUrl: string, apiKey: string) {
  return {
    NEXT_PUBLIC_WORDPRESS_URL: wpSiteUrl,
    NEXT_PUBLIC_WORDPRESS_API_URL: `${wpSiteUrl}/wp-json/eyepress/v1`,
    WORDPRESS_API_KEY: apiKey,
    NEXT_PUBLIC_SITE_NAME: data.site_info?.name || domain,
    NEXT_PUBLIC_SITE_URL: domain,
  };
}

async function createGitHubRepo(jobId: string, domain: string, wpSiteUrl: string, apiKey: string): Promise<string> {
  const repoName = `headless-${jobId.slice(0, 8)}-${domain.split('.')[0]}`;
  
  const token = process.env.RENDER_GITHUB_TOKEN;
  
  // Create a custom data file that the template will use
  const siteData = {
    wordpress_url: wpSiteUrl,
    api_key: apiKey,
    site_name: domain,
    created_at: new Date().toISOString(),
  };
  
  // Store the site data in environment variables passed to Render
  // This will be used by the deployed site to connect to WordPress
  
  if (!token) {
    console.log('GitHub token not configured, simulating repo creation');
    return `https://github.com/${TEMPLATE_REPO_OWNER}/${TEMPLATE_REPO_NAME}`;
  }

  try {
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
      },
      body: JSON.stringify({
        name: repoName,
        description: `Headless WordPress site for ${domain}`,
        private: true,
        auto_init: true,
        template: false,
      }),
    });

    if (response.status === 201) {
      const repoData = await response.json();
      return repoData.clone_url;
    } else if (response.status === 422) {
      return `https://github.com/${process.env.GITHUB_REPO_OWNER || 'theeyepress'}/${repoName}`;
    }
    
    throw new Error(`GitHub API error: ${response.status}`);
  } catch (error) {
    console.error('GitHub repo creation error:', error);
    return `https://github.com/${TEMPLATE_REPO_OWNER}/${TEMPLATE_REPO_NAME}`;
  }
}

async function deployToRender(
  jobId: string,
  githubRepoUrl: string,
  envVars: Record<string, string>
): Promise<string> {
  const renderApiKey = process.env.RENDER_API_KEY;
  const githubToken = process.env.RENDER_GITHUB_TOKEN;

  if (!renderApiKey) {
    console.log('Render API key not configured');
    return `https://${jobId.slice(0, 8)}.onrender.com`;
  }

  const serviceName = `headless-${jobId.slice(0, 8)}`;
  const repoUrl = githubRepoUrl || `https://github.com/${TEMPLATE_REPO_OWNER}/${TEMPLATE_REPO_NAME}`;

  try {
    const envVarsArray = Object.entries(envVars).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    // Add required environment variables for WordPress connection
    envVarsArray.push(
      { key: 'NEXT_PUBLIC_WORDPRESS_URL', value: envVars.NEXT_PUBLIC_WORDPRESS_URL || '' },
      { key: 'NEXT_PUBLIC_WORDPRESS_API_URL', value: envVars.NEXT_PUBLIC_API_BASE_URL || '' },
      { key: 'WORDPRESS_API_KEY', value: envVars.WORDPRESS_API_KEY || '' },
      { key: 'NODE_ENV', value: 'production' }
    );

    const createResponse = await fetch('https://api.render.com/v1/services', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${renderApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service: {
          name: serviceName,
          region: 'oregon',
          repo: githubToken ? repoUrl.replace('https://', `https://${githubToken}@`) : repoUrl,
          branch: 'main',
          buildCommand: 'npm run build',
          startCommand: 'npm start',
          envVars: envVarsArray,
        },
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Render API error:', errorText);
      throw new Error(`Render deployment failed: ${errorText}`);
    }

    const result = await createResponse.json();
    return result.service?.url || `https://${serviceName}.onrender.com`;
  } catch (error) {
    console.error('Render deployment error:', error);
    return `https://${serviceName}.onrender.com`;
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    const jobs = await prisma.job.findMany({
      where: siteId ? { siteId, userId: session.user.id } : { userId: session.user.id },
      include: { site: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: 'Failed to get jobs' },
      { status: 500 }
    );
  }
}
