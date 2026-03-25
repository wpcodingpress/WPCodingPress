import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Code2, Palette, ShoppingCart, Zap, Globe, Server, CheckCircle2, ArrowRight, Clock, Shield, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ServiceHeroClient from "./ServiceHeroClient"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Palette,
  ShoppingCart,
  Zap,
  Globe,
  Server,
}

const servicesData: Record<string, {
  title: string
  description: string
  shortDescription: string
  icon: string
  basicPrice: number
  standardPrice: number
  premiumPrice: number
  basicFeatures: string[]
  standardFeatures: string[]
  premiumFeatures: string[]
  image: string
  benefits: string[]
  process: { step: string; title: string; description: string }[]
}> = {
  "wordpress-development": {
    title: "WordPress Development",
    description: "Custom WordPress solutions built for performance, security, and scalability. From simple blogs to complex enterprise websites, we deliver solutions that drive results.",
    shortDescription: "From blogs to enterprise platforms, we build WordPress sites that scale.",
    icon: "Code2",
    basicPrice: 150,
    standardPrice: 300,
    premiumPrice: 500,
    basicFeatures: ["5 Pages", "Elementor Design", "Mobile Responsive", "Contact Form", "Basic SEO"],
    standardFeatures: ["10 Pages", "WooCommerce Setup", "Payment Integration", "Speed Optimization", "Priority Support"],
    premiumFeatures: ["Unlimited Pages", "Custom Development", "Booking System", "Stripe/PayPal", "24/7 Support"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    benefits: [
      "Lightning-fast loading times optimized for Core Web Vitals",
      "Mobile-first responsive design for all devices",
      "Advanced security measures to protect your data",
      "SEO-optimized structure for better rankings",
      "Scalable architecture for future growth",
    ],
    process: [
      { step: "01", title: "Discovery", description: "We analyze your requirements, target audience, and business goals." },
      { step: "02", title: "Design", description: "Create wireframes and visual designs that match your brand." },
      { step: "03", title: "Development", description: "Build your custom WordPress theme with clean code." },
      { step: "04", title: "Launch", description: "Deploy, test, and hand over a fully functional website." },
    ],
  },
  "elementor-pro": {
    title: "Elementor Pro Design",
    description: "Stunning, conversion-focused designs using Elementor page builder. Pixel-perfect templates tailored to your brand identity with advanced animations and interactions.",
    shortDescription: "Beautiful, conversion-focused designs that capture attention.",
    icon: "Palette",
    basicPrice: 100,
    standardPrice: 200,
    premiumPrice: 350,
    basicFeatures: ["5 Sections", "Custom Header/Footer", "Mobile Responsive", "Contact Form", "Basic Animations"],
    standardFeatures: ["10 Sections", "Popups & Forms", "WooCommerce Elements", "Custom Widgets", "Advanced Animations"],
    premiumFeatures: ["Full Website", "Custom CSS/JS", "Dynamic Content", "Template Library", "Priority Support"],
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
    benefits: [
      "No coding required - easy to edit and update",
      "Drag-and-drop interface for quick modifications",
      "Pre-built templates to speed up development",
      "Responsive editing for all screen sizes",
      "Built-in SEO features and schema markup",
    ],
    process: [
      { step: "01", title: "Consultation", description: "Understand your brand, style preferences, and goals." },
      { step: "02", title: "Wireframe", description: "Plan the layout and user journey." },
      { step: "03", title: "Design", description: "Create pixel-perfect Elementor designs." },
      { step: "04", title: "Deliver", description: "Hand over with training on managing your site." },
    ],
  },
  "woocommerce": {
    title: "WooCommerce Store",
    description: "Full-featured e-commerce solutions with seamless payment integration, inventory management, and order tracking. Build your online store with everything you need to sell.",
    shortDescription: "Complete e-commerce solutions that drive sales and growth.",
    icon: "ShoppingCart",
    basicPrice: 250,
    standardPrice: 450,
    premiumPrice: 700,
    basicFeatures: ["Up to 20 Products", "Payment Gateway", "Cart & Checkout", "Mobile Responsive", "Basic Reports"],
    standardFeatures: ["Up to 100 Products", "Inventory System", "Shipping Options", "Coupons & Discounts", "Email Marketing"],
    premiumFeatures: ["Unlimited Products", "Subscriptions", "Multi-vendor", "Advanced Analytics", "API Integration"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    benefits: [
      "Accept payments via Stripe, PayPal, and more",
      "Inventory management with automatic stock updates",
      "Shipping calculator integration with major carriers",
      "Abandoned cart recovery to boost conversions",
      "Detailed analytics and sales reports",
    ],
    process: [
      { step: "01", title: "Planning", description: "Define product catalog, categories, and requirements." },
      { step: "02", title: "Setup", description: "Install WooCommerce and configure essential plugins." },
      { step: "03", title: "Customization", description: "Design store, product pages, and checkout flow." },
      { step: "04", title: "Launch", description: "Go live with testing and training included." },
    ],
  },
  "website-redesign": {
    title: "Website Redesign",
    description: "Modernize your existing website with cutting-edge design, improved UX, and better performance. Transform outdated sites into powerful business tools.",
    shortDescription: "Transform outdated websites into modern, high-converting machines.",
    icon: "Zap",
    basicPrice: 200,
    standardPrice: 400,
    premiumPrice: 600,
    basicFeatures: ["UI Refresh", "Mobile Optimization", "Content Migration", "Speed Boost", "3-5 Pages"],
    standardFeatures: ["Full Redesign", "UX Improvements", "SEO Preservation", "New Features", "10-15 Pages"],
    premiumFeatures: ["Complete Overhaul", "Custom Design", "Advanced Features", "CMS Training", "Ongoing Support"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    benefits: [
      "Improved user experience and navigation",
      "Modern, professional visual design",
      "Better mobile responsiveness and loading speed",
      "Preserved SEO rankings during migration",
      "Enhanced conversion rate optimization",
    ],
    process: [
      { step: "01", title: "Audit", description: "Analyze current site performance, issues, and opportunities." },
      { step: "02", title: "Strategy", description: "Plan new structure, features, and design direction." },
      { step: "03", title: "Redesign", description: "Build new site with modern design and improved UX." },
      { step: "04", title: "Launch", description: "Migrate content, test thoroughly, and monitor results." },
    ],
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = servicesData[slug]
  
  if (!service) {
    return { title: "Service Not Found" }
  }
  
  return {
    title: `${service.title} | WPCodingPress`,
    description: service.shortDescription,
  }
}

export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({ slug }))
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = servicesData[slug]
  
  if (!service) {
    notFound()
  }
  
  return (
    <div className="relative">
      <div className="fixed inset-0 grid-pattern pointer-events-none -z-10" />
      
      <section className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <ServiceHeroClient
          slug={slug}
          title={service.title}
          description={service.description}
          image={service.image}
        />
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Choose Your <span className="gradient-text">Package</span>
            </h2>
            <p className="text-muted-foreground">
              Select the perfect package for your needs. All packages include our satisfaction guarantee.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {["basic", "standard", "premium"].map((tier) => {
              const price = tier === "basic" ? service.basicPrice : tier === "standard" ? service.standardPrice : service.premiumPrice
              const features = tier === "basic" ? service.basicFeatures : tier === "standard" ? service.standardFeatures : service.premiumFeatures
              const isPopular = tier === "standard"
              
              return (
                <Card 
                  key={tier} 
                  className={`relative overflow-hidden ${isPopular ? "border-primary/50 bg-gradient-to-b from-primary/10 to-transparent" : ""}`}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-purple-600 text-white text-center text-sm font-semibold py-2">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className={`pt-12 pb-4 ${isPopular ? "pt-16" : ""}`}>
                    <CardTitle className="text-xl text-white capitalize">{tier}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold gradient-text">${price}</span>
                      <span className="text-muted-foreground ml-2">starting</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/order?service=${slug}&package=${tier}`} className="block">
                      <Button 
                        className={`w-full ${isPopular ? "glow" : ""}`} 
                        variant={isPopular ? "default" : "outline"}
                      >
                        Order Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose <span className="gradient-text">{service.title}</span>?
            </h2>
            <p className="text-muted-foreground">
              We deliver exceptional results with our proven approach and dedicated support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Clock, title: "Fast Delivery", desc: "Quick turnaround without compromising quality" },
              { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security for your peace of mind" },
              { icon: Users, title: "Expert Team", desc: "Skilled professionals with years of experience" },
              { icon: Star, title: "Premium Quality", desc: "Attention to detail in every element" },
              { icon: CheckCircle2, title: "Satisfaction Guarantee", desc: "100% money-back if you're not happy" },
              { icon: Globe, title: "Global Support", desc: "24/7 assistance whenever you need us" },
            ].map((item, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our <span className="gradient-text">Process</span>
            </h2>
            <p className="text-muted-foreground">
              A streamlined workflow designed to deliver exceptional results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {service.process.map((item, index) => (
              <Card key={index} className="bg-white/5 border-white/10 relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold gradient-text mb-4 opacity-20">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
                {index < service.process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/50" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create something amazing together. Get a free consultation today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/order?service=${slug}`}>
              <Button size="lg" className="glow">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Talk to Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Explore Other Services
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {Object.entries(servicesData)
                .filter(([key]) => key !== slug)
                .map(([key, svc]) => {
                  const OtherIcon = iconMap[svc.icon] || Code2
                  return (
                    <Link key={key} href={`/services/${key}`}>
                      <Card className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors cursor-pointer h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <OtherIcon className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-semibold text-white mb-2">{svc.title}</h3>
                          <p className="text-sm text-muted-foreground">From ${svc.basicPrice}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
