import { NextRequest, NextResponse } from "next/server"

const responses: Record<string, string> = {
  services: `We offer a comprehensive suite of web development services:\n\n• **WordPress to Next.js Conversion** - Migrate your WordPress site to lightning-fast Next.js\n• **Elementor Pro Design** - Stunning custom designs that convert\n• **WooCommerce Stores** - Full-featured e-commerce solutions\n• **SEO & Digital Marketing** - Grow your online presence\n• **Web Applications** - Custom React/Next.js apps\n• **Cloud & DevOps** - Modern infrastructure setup\n\nAll powered by our subscription plans starting at **Free**!`,

  pricing: `Our subscription plans:\n\n🆓 **Starter (Free)**\n- 1 Site\n- Basic Template\n- Community Support\n- 5GB Bandwidth\n\n💎 **Pro ($19/mo)**\n- 5 Sites\n- Advanced Templates\n- Priority Support\n- 100GB Bandwidth\n- Analytics Dashboard\n\n🚀 **Enterprise ($99/mo)**\n- Unlimited Sites\n- White-label Option\n- 24/7 Support\n- Custom Development\n\nNeed a custom quote? Contact us!`,

  portfolio: `Check out our featured projects:\n\n• **HomePicks Daily** - WooCommerce Dropshipping Store\n• **Trip Monarch** - Travel Booking Portal\n• **RankUpper** - SEO Agency Website\n• **Pro Consultant** - Business Consulting Site\n• **Masjid Press** - Non-profit Organization\n• **E-Commerce Giant** - Full-featured Store\n\nVisit our portfolio page for more!`,

  "get started": `Getting started is easy!\n\n1️⃣ **Sign Up** - Create your free account\n2️⃣ **Choose a Plan** - Start free or upgrade anytime\n3️⃣ **Connect Your Site** - Link your existing website\n4️⃣ **Launch** - Go live in minutes!\n\nReady to begin? Visit our pricing page!`,

  support: `We're here to help!\n\n📧 Email: contact@wpcodingpress.com\n📱 Phone: +880 1943 429727\n💬 Live Chat: Available 24/7\n\nOur typical response time is under 2 hours!`,

  default: `Thanks for reaching out! I'm here to help with:\n\n• Questions about our services\n• Pricing and plans\n• Technical support\n• Getting started guide\n\nWhat would you like to know more about?`,
}

function findRelevantResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes("service") || lowerMessage.includes("offer") || lowerMessage.includes("what do you do")) {
    return responses.services
  }
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("plan") || lowerMessage.includes("pricing") || lowerMessage.includes("subscription")) {
    return responses.pricing
  }
  if (lowerMessage.includes("portfolio") || lowerMessage.includes("project") || lowerMessage.includes("work") || lowerMessage.includes("example")) {
    return responses.portfolio
  }
  if (lowerMessage.includes("start") || lowerMessage.includes("begin") || lowerMessage.includes("sign up") || lowerMessage.includes("how do i")) {
    return responses["get started"]
  }
  if (lowerMessage.includes("support") || lowerMessage.includes("help") || lowerMessage.includes("contact") || lowerMessage.includes("email")) {
    return responses.support
  }
  
  return responses.default
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const response = findRelevantResponse(message)

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      response: "I'm having trouble processing your request. Please try again or contact us directly."
    }, { status: 500 })
  }
}
