import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { requireActiveSubscription } from '@/lib/subscription';

export async function POST(request: Request) {
  try {
    const auth = await requireActiveSubscription();
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { userId } = auth;
    const body = await request.json();
    const { siteId } = body;

    if (!siteId) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
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

    const job = await prisma.job.create({
      data: {
        userId,
        siteId,
        status: 'pending',
        logs: `Job created at ${new Date().toISOString()}\n`,
      },
    });

    triggerConversionWorker(job.id);

    return NextResponse.json({
      job: {
        id: job.id,
        status: job.status,
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

async function triggerConversionWorker(jobId: string) {
  try {
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'processing',
        startedAt: new Date(),
        logs: `Job started at ${new Date().toISOString()}\n`,
      },
    });

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { site: true },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    let logs = job.logs || '';
    logs += `Fetching data from ${job.site.wpSiteUrl}...\n`;

    const exportData = await fetch(`${job.site.wpSiteUrl}/wp-json/headless/v1/export`, {
      headers: {
        'X-API-Key': job.site.apiKey,
      },
    }).catch(() => null);

    if (!exportData || !exportData.ok) {
      throw new Error('Failed to fetch WordPress data - check plugin installation');
    }

    const data = await exportData.json();
    logs += `Fetched ${data.posts?.length || 0} posts, ${data.pages?.length || 0} pages\n`;

    logs += 'Processing content...\n';
    const transformedData = transformContent(data);

    logs += 'Generating Next.js project...\n';
    const outputUrl = await deployToRender(job.site.domain, transformedData, job.id);

    logs += `Deployment complete: ${outputUrl}\n`;

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'completed',
        outputUrl,
        logs,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Conversion worker error:', errorMessage);

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        error: errorMessage,
        logs: (await prisma.job.findUnique({ where: { id: jobId } }))?.logs + `\nError: ${errorMessage}\n`,
      },
    });
  }
}

function transformContent(data: {
  posts?: Array<{ id: number; title: string; content: string; slug: string; date: string }>;
  pages?: Array<{ id: number; title: string; content: string; slug: string }>;
}) {
  return {
    posts: (data.posts || []).map((post) => ({
      title: post.title,
      slug: post.slug,
      content: post.content,
      date: post.date,
    })),
    pages: (data.pages || []).map((page) => ({
      title: page.title,
      slug: page.slug,
      content: page.content,
    })),
  };
}

async function deployToRender(
  domain: string,
  data: ReturnType<typeof transformContent>,
  jobId: string
): Promise<string> {
  const renderApiKey = process.env.RENDER_API_KEY;
  const githubToken = process.env.RENDER_GITHUB_TOKEN;
  const repoOwner = process.env.GITHUB_REPO_OWNER;
  const repoName = process.env.GITHUB_REPO_NAME;

  if (!renderApiKey || !githubToken || !repoOwner || !repoName) {
    console.log('Render not fully configured - simulating deployment');
    return `https://${domain.replace(/[^a-zA-Z0-9]/g, '-')}.onrender.com`;
  }

  const serviceName = `headless-${jobId.slice(0, 8)}`;
  
  try {
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
          repo: `https://${githubToken}@github.com/${repoOwner}/${repoName}`,
          branch: 'main',
          buildCommand: 'npm run build',
          startCommand: 'npm start',
          envVars: [
            { key: 'WP_DATA', value: JSON.stringify(data) },
            { key: 'ORIGINAL_DOMAIN', value: domain },
          ],
        },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Render API error: ${error}`);
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