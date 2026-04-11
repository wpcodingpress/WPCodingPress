import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Code2, Palette, ShoppingCart, Zap, Globe, Server, CheckCircle2, ArrowRight, Clock, Shield, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ServiceHeroClient from "./ServiceHeroClient"
import prisma from "@/lib/prisma"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code2,
  palette: Palette,
  "shopping-cart": ShoppingCart,
  zap: Zap,
  globe: Globe,
  settings: Server,
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await prisma.service.findUnique({
    where: { slug }
  })
  
  if (!service) {
    return { title: "Service Not Found" }
  }
  
  return {
    title: `${service.name} | WPCodingPress`,
    description: service.description,
  }
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { slug: true }
  })
  
  return services.map((service) => ({ slug: service.slug }))
}

async function getService(slug: string) {
  const service = await prisma.service.findUnique({
    where: { slug }
  })
  return service
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)
  
  if (!service) {
    notFound()
  }

  const IconComponent = iconMap[service.icon] || Code2
  const basicFeatures = Array.isArray(service.basicFeatures) ? service.basicFeatures : []
  const standardFeatures = Array.isArray(service.standardFeatures) ? service.standardFeatures : []
  const premiumFeatures = Array.isArray(service.premiumFeatures) ? service.premiumFeatures : []
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100 via-white to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-2 bg-indigo-100 border border-indigo-200 rounded-full text-indigo-600 text-sm font-medium mb-6">
            Our Services
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            {service.name}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {service.description}
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Choose Your <span className="text-indigo-600">Package</span>
            </h2>
            <p className="text-slate-600">
              Select the perfect package for your needs. All packages include our satisfaction guarantee.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { tier: "basic", label: "Basic", price: service.basicPrice, features: basicFeatures, popular: false },
              { tier: "standard", label: "Standard", price: service.standardPrice, features: standardFeatures, popular: true },
              { tier: "premium", label: "Premium", price: service.premiumPrice, features: premiumFeatures, popular: false },
            ].map((pkg) => (
              <Card 
                key={pkg.tier}
                className={`relative overflow-hidden ${pkg.popular ? "border-indigo-500 border-2 shadow-xl shadow-indigo-100" : "border-slate-200 shadow-lg"}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center text-sm font-semibold py-2">
                    Most Popular
                  </div>
                )}
                <CardHeader className={`pt-12 pb-4 ${pkg.popular ? "pt-16" : ""}`}>
                  <CardTitle className="text-xl text-slate-900 capitalize">{pkg.label}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900">${pkg.price}</span>
                    <span className="text-slate-500 ml-2">starting</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/order?service=${slug}&package=${pkg.tier}`} className="block">
                    <Button 
                      className={`w-full ${pkg.popular ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600" : "bg-slate-900 hover:bg-slate-800"}`}
                    >
                      Order Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose <span className="text-indigo-600">{service.name}</span>?
            </h2>
            <p className="text-slate-600">
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
              <Card key={index} className="bg-slate-50 border-slate-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Our <span className="text-indigo-600">Process</span>
            </h2>
            <p className="text-slate-600">
              A streamlined workflow designed to deliver exceptional results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Discovery", description: "We analyze your requirements, target audience, and business goals." },
              { step: "02", title: "Design", description: "Create wireframes and visual designs that match your brand." },
              { step: "03", title: "Development", description: "Build your custom solution with clean code and best practices." },
              { step: "04", title: "Launch", description: "Deploy, test, and hand over a fully functional product." },
            ].map((item, index) => (
              <Card key={index} className="bg-white border-slate-200 relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-indigo-200 mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </CardContent>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-indigo-300" />
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create something amazing together. Get a free consultation today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/order?service=${slug}`}>
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Talk to Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Explore Other Services
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {(
                await prisma.service.findMany({
                  where: { isActive: true, NOT: { slug } },
                  take: 3
                })
              ).map((svc) => {
                const OtherIcon = iconMap[svc.icon] || Code2
                return (
                  <Link key={svc.id} href={`/services/${svc.slug}`}>
                    <Card className="bg-slate-50 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-colors cursor-pointer h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                          <OtherIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">{svc.name}</h3>
                        <p className="text-sm text-slate-600">From ${svc.basicPrice}</p>
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