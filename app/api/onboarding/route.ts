import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { createNotification } from '@/lib/notifications';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-dev-key-32-chars-long!!';
const ALGORITHM = 'aes-256-cbc';

function encrypt(text: string): string {
  const key = Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
        plan: { in: ['STARTER', 'COMPLETE'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'Active web development subscription required' }, { status: 403 });
    }

    const existingForm = await prisma.onboardingForm.findUnique({
      where: { subscriptionId: subscription.id },
    });

    if (existingForm) {
      return NextResponse.json({ error: 'Onboarding form already submitted' }, { status: 409 });
    }

    const body = await request.json();

    const requiredFields = ['fullName', 'email', 'phone', 'businessName', 'websiteGoal'];
    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === 'string' && !body[field].trim())) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    let hostingLoginEncrypted = null;
    if (body.hostingLoginUsername || body.hostingLoginPassword) {
      hostingLoginEncrypted = encrypt(
        JSON.stringify({
          username: body.hostingLoginUsername || '',
          password: body.hostingLoginPassword || '',
        })
      );
    }

    const onboardingForm = await prisma.onboardingForm.create({
      data: {
        subscriptionId: subscription.id,
        userId: session.user.id,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        businessName: body.businessName,
        currentWebsiteUrl: body.currentWebsiteUrl || null,
        websiteTypes: JSON.stringify(body.websiteTypes || []),
        domainName: body.domainName || null,
        hostingProvider: body.hostingProvider || null,
        hostingLoginEncrypted,
        preferredDomain: body.preferredDomain || null,
        domainExtension: body.domainExtension || null,
        hostingPreferences: body.hostingPreferences || null,
        websiteGoal: body.websiteGoal,
        designPreferences: body.designPreferences || null,
        designFiles: body.designFiles || null,
        requiredPages: JSON.stringify(body.requiredPages || []),
        targetAudience: body.targetAudience || null,
        referenceWebsites: body.referenceWebsites || null,
        complexity: body.complexity || 'NORMAL',
        additionalNotes: body.additionalNotes || null,
        projectStatus: 'RECEIVED',
      },
    });

    await sendEmail({
      to: body.email,
      subject: 'We received your project details! 🎉 — WPCodingPress',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { padding: 30px; background: #f9f9f9; }
              .timeline { display: flex; flex-direction: column; gap: 12px; margin: 20px 0; }
              .step { display: flex; align-items: center; gap: 12px; padding: 12px; background: #fff; border-radius: 8px; border-left: 3px solid #7c3aed; }
              .step-number { width: 28px; height: 28px; background: #7c3aed; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; flex-shrink: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>We Got Your Project! 🎉</h1>
              </div>
              <div class="content">
                <p>Hi ${body.fullName},</p>
                <p>Thank you for submitting your project details! Your dedicated project manager will review everything and reach out within <strong>24 hours</strong>.</p>
                <h3 style="margin-top: 24px;">Here's What Happens Next:</h3>
                <div class="timeline">
                  <div class="step"><div class="step-number">1</div><div><strong>Project Review</strong><br/><span style="font-size: 13px; color: #666;">We review your requirements and prepare a plan</span></div></div>
                  <div class="step"><div class="step-number">2</div><div><strong>Discussion Call</strong><br/><span style="font-size: 13px; color: #666;">Your PM contacts you to finalize details</span></div></div>
                  <div class="step"><div class="step-number">3</div><div><strong>Design Phase</strong><br/><span style="font-size: 13px; color: #666;">We create mockups for your approval</span></div></div>
                  <div class="step"><div class="step-number">4</div><div><strong>Development</strong><br/><span style="font-size: 13px; color: #666;">Our team builds your website</span></div></div>
                  <div class="step"><div class="step-number">5</div><div><strong>Testing & Launch</strong><br/><span style="font-size: 13px; color: #666;">Quality check and go live!</span></div></div>
                </div>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">You can track your project status anytime from your dashboard.</p>
                <p style="text-align: center; margin-top: 24px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/web-dev" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Track Progress</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@wpcodingpress.com';
    await sendEmail({
      to: adminEmail,
      subject: `New Onboarding Form: ${body.fullName} — ${subscription.plan} Plan`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Onboarding Submission</h2>
          <p><strong>Client:</strong> ${body.fullName} (${body.email})</p>
          <p><strong>Plan:</strong> ${subscription.plan === 'STARTER' ? 'Starter' : 'Complete'} (${subscription.billingCycle})</p>
          <p><strong>Business:</strong> ${body.businessName}</p>
          <p><strong>Phone:</strong> ${body.phone}</p>
          <p><strong>Website Goal:</strong> ${body.websiteGoal}</p>
          ${body.domainName ? `<p><strong>Domain:</strong> ${body.domainName}</p>` : ''}
          ${body.preferredDomain ? `<p><strong>Preferred Domain:</strong> ${body.preferredDomain}</p>` : ''}
          <p><strong>Complexity:</strong> ${body.complexity}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/web-dev-subscribers" style="display: inline-block; padding: 10px 20px; background: #7c3aed; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 16px;">View in Admin</a>
        </div>
      `,
    });

    await createNotification({
      userId: session.user.id,
      type: 'subscription',
      title: 'Project Details Received! 🎉',
      message: 'Your project details have been received. Your project manager will contact you within 24 hours.',
      link: '/dashboard/web-dev',
      priority: 'high',
    });

    return NextResponse.json({
      success: true,
      message: 'Onboarding form submitted successfully',
      form: onboardingForm,
    });
  } catch (error) {
    console.error('Onboarding form error:', error);
    return NextResponse.json({ error: 'Failed to submit onboarding form' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        plan: { in: ['STARTER', 'COMPLETE'] },
      },
      orderBy: { createdAt: 'desc' },
      include: { onboardingForm: true },
    });

    if (!subscription) {
      return NextResponse.json({ form: null });
    }

    const form = subscription.onboardingForm
      ? {
          ...subscription.onboardingForm,
          websiteTypes: JSON.parse(subscription.onboardingForm.websiteTypes),
          requiredPages: JSON.parse(subscription.onboardingForm.requiredPages),
          hostingLoginEncrypted: undefined,
        }
      : null;

    return NextResponse.json({ form, subscription });
  } catch (error) {
    console.error('Get onboarding form error:', error);
    return NextResponse.json({ error: 'Failed to get onboarding form' }, { status: 500 });
  }
}
