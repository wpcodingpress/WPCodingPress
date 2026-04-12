import { NextRequest, NextResponse } from "next/server"

const responses: Record<string, string> = {
  services: `We offer comprehensive web development services:

🟣 **WordPress to Next.js**
Lightning-fast migration, auto-sync, WPGraphQL integration

🎨 **Elementor Pro Design**
Custom stunning designs that convert visitors to customers

🛒 **WooCommerce Stores**
Full e-commerce solutions with payment integration

📈 **SEO & Marketing**
Dominate search rankings, grow your online presence

💻 **Web Applications**
Custom React/Next.js apps tailored to your needs

☁️ **Cloud & DevOps**
Modern infrastructure setup and deployment

🌐 **Domain & Hosting**
Complete setup and ongoing support

**View all services:** https://wpcodingpress.onrender.com/services`,

  pricing: `Our subscription plans:

🆓 **Free - $0 forever**
• 1 WordPress site conversion
• Basic Next.js template
• Community support
• 5GB bandwidth

💎 **Pro - $19/month**
• 5 WordPress to Next.js conversions
• Live deployment (Vercel/Render)
• Priority email support
• Custom domain support
• Analytics dashboard
• Auto content sync
• 100GB bandwidth

🚀 **Enterprise - $99/month**
• Unlimited conversions
• White-label deployment
• 24/7 dedicated support
• Custom domain included
• API access
• Advanced analytics
• Team collaboration
• Custom integrations

One-time services also available!
Basic: $100-600 | Standard: $200-900 | Premium: $350-1200

**View pricing:** https://wpcodingpress.onrender.com/pricing`,

  products: `Our premium products:

🔌 **WordPress Plugins**
Extend your site with powerful tools

🎨 **WordPress Themes**
Beautiful, responsive designs

⚛️ **Next.js Templates**
Production-ready code templates

🤖 **MCP Servers**
AI integration made easy

🧠 **AI Agents**
Smart automation agents

**View products:** https://wpcodingpress.onrender.com/products`,

  portfolio: `Our featured projects:

• HomePicks Daily - WooCommerce Dropshipping
• Trip Monarch - Travel Booking Portal  
• RankUpper - SEO Agency Website
• Pro Consultant - Business Consulting
• Masjid Press - Non-profit Organization
• E-Commerce Giant - Full Store

**View full portfolio:** https://wpcodingpress.onrender.com/portfolio

We have 150+ happy clients and 300+ completed projects!`,

  "get started": `How to get started:

1️⃣ **Sign Up** - Create free account at /register
2️⃣ **Choose Plan** - Start free or upgrade anytime
3️⃣ **Connect Site** - Link your WordPress website
4️⃣ **Launch** - Go live in minutes!

**Register now:** https://wpcodingpress.onrender.com/register

**Order a project:** https://wpcodingpress.onrender.com/order`,

  about: `About WPCodingPress:

Founded 2016 in Dhaka, Bangladesh
8+ years of experience
150+ happy clients
300+ projects completed
5.0 average rating

Founder: Rahman - Lead Developer
Expert in WordPress, Elementor, WooCommerce, React/Next.js, PHP/MySQL, SEO

**Read more:** https://wpcodingpress.onrender.com/about`,

  contact: `Contact us:

📧 Email: support@wpcodingpress.com
💬 Use our AI chat (bottom right)

**Send query or start project:**
https://wpcodingpress.onrender.com/contact

We typically respond within 2 hours!`,

  support: `We're here to help!

📧 Email: support@wpcodingpress.com
💬 Live Chat: Available 24/7 via AI chat widget

For urgent issues, email us directly!
We typically respond within 2 hours.`,

  process: `Our conversion process:

1️⃣ Connect your WordPress site
2️⃣ Install WPCodingPress plugin
3️⃣ Select conversion options
4️⃣ AI converts your content
5️⃣ Deploy to Vercel/Netlify
6️⃣ Go live!

Average conversion time: 1 minute
Your SEO is fully preserved!`,

  features: `Why choose WPCodingPress?

✓ Lightning-fast Next.js websites
✓ SEO preserved after migration
✓ 99 SEO score guaranteed
✓ 100+ sites migrated
✓ Free SSL and CDN
✓ 24/7 support (Enterprise)
✓ White-label options
✓ Auto content sync
✓ Custom domain support
✓ Analytics dashboard

**Compare plans:** https://wpcodingpress.onrender.com/pricing`,

  default: `Welcome to WPCodingPress! 🎉

I'm here to help you with:

• Our services (WordPress to Next.js, Elementor, WooCommerce, SEO, etc.)
• Pricing and subscription plans
• Products (plugins, themes, templates, AI tools)
• Getting started guide
• Portfolio examples
• About our company
• Contact and support

What would you like to know? Feel free to ask!`
}

function findRelevantResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes("service") || lowerMessage.includes("offer")) {
    return responses.services
  }
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("plan") || lowerMessage.includes("subscription")) {
    return responses.pricing
  }
  if (lowerMessage.includes("product") || lowerMessage.includes("plugin") || lowerMessage.includes("theme") || lowerMessage.includes("template") || lowerMessage.includes("mcp") || lowerMessage.includes("ai agent")) {
    return responses.products
  }
  if (lowerMessage.includes("portfolio") || lowerMessage.includes("project") || lowerMessage.includes("work") || lowerMessage.includes("example")) {
    return responses.portfolio
  }
  if (lowerMessage.includes("start") || lowerMessage.includes("begin") || lowerMessage.includes("sign up") || lowerMessage.includes("register") || lowerMessage.includes("how do i") || lowerMessage.includes("get start")) {
    return responses["get started"]
  }
  if (lowerMessage.includes("about") || lowerMessage.includes("who are you") || lowerMessage.includes("company")) {
    return responses.about
  }
  if (lowerMessage.includes("contact") || lowerMessage.includes("email") || lowerMessage.includes("reach")) {
    return responses.contact
  }
  if (lowerMessage.includes("support") || lowerMessage.includes("help")) {
    return responses.support
  }
  if (lowerMessage.includes("process") || lowerMessage.includes("convert") || lowerMessage.includes("how does it work") || lowerMessage.includes("migration")) {
    return responses.process
  }
  if (lowerMessage.includes("feature") || lowerMessage.includes("why") || lowerMessage.includes("benefit") || lowerMessage.includes("advantage")) {
    return responses.features
  }
  
  return responses.default
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800))

    const response = findRelevantResponse(message)

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      response: "I'm having trouble processing your request. Please try again or contact us at support@wpcodingpress.com"
    }, { status: 500 })
  }
}