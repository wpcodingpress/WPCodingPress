import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.adminUser.findFirst()
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("S0pnahenayf", 12)
    
    const admin = await prisma.adminUser.create({
      data: {
        email: "rahman.ceo@wpcodingpress.com",
        password: hashedPassword,
        name: "Rahman",
        role: "admin"
      }
    })

    // Create default services
    const services = [
      {
        name: "WordPress Development",
        slug: "wordpress-development",
        description: "Custom WordPress solutions built for performance, security, and scalability. From simple blogs to complex enterprise websites.",
        icon: "code",
        basicPrice: 150,
        standardPrice: 300,
        premiumPrice: 500,
        basicFeatures: ["5 Pages", "Elementor Design", "Mobile Responsive", "Contact Form", "Basic SEO"],
        standardFeatures: ["10 Pages", "WooCommerce Setup", "Payment Integration", "Speed Optimization", "Priority Support"],
        premiumFeatures: ["Unlimited Pages", "Custom Development", "Booking System", "Stripe/PayPal", "24/7 Support"],
        order: 1
      },
      {
        name: "Elementor Pro Design",
        slug: "elementor-pro",
        description: "Stunning, conversion-focused designs using Elementor page builder. Pixel-perfect templates tailored to your brand.",
        icon: "palette",
        basicPrice: 100,
        standardPrice: 200,
        premiumPrice: 350,
        basicFeatures: ["5 Sections", "Custom Header/Footer", "Mobile Responsive", "Contact Form", "Basic Animations"],
        standardFeatures: ["10 Sections", "Popups & Forms", "WooCommerce Elements", "Custom Widgets", "Advanced Animations"],
        premiumFeatures: ["Full Website", "Custom CSS/JS", "Dynamic Content", "Template Library", "Priority Support"],
        order: 2
      },
      {
        name: "WooCommerce Store",
        slug: "woocommerce",
        description: "Full-featured e-commerce solutions with seamless payment integration, inventory management, and order tracking.",
        icon: "shopping-cart",
        basicPrice: 250,
        standardPrice: 450,
        premiumPrice: 700,
        basicFeatures: ["Up to 20 Products", "Payment Gateway", "Cart & Checkout", "Mobile Responsive", "Basic Reports"],
        standardFeatures: ["Up to 100 Products", "Inventory System", "Shipping Options", "Coupons & Discounts", "Email Marketing"],
        premiumFeatures: ["Unlimited Products", "Subscriptions", "Multi-vendor", "Advanced Analytics", "API Integration"],
        order: 3
      },
      {
        name: "Website Redesign",
        slug: "website-redesign",
        description: "Modernize your existing website with cutting-edge design, improved UX, and better performance.",
        icon: "zap",
        basicPrice: 200,
        standardPrice: 400,
        premiumPrice: 600,
        basicFeatures: ["UI Refresh", "Mobile Optimization", "Content Migration", "Speed Boost", "3-5 Pages"],
        standardFeatures: ["Full Redesign", "UX Improvements", "SEO Preservation", "New Features", "10-15 Pages"],
        premiumFeatures: ["Complete Overhaul", "Custom Design", "Advanced Features", "CMS Training", "Ongoing Support"],
        order: 4
      }
    ]

    for (const service of services) {
      await prisma.service.create({ data: service })
    }

    // Create sample portfolio items
    const portfolioItems = [
      {
        title: "Medical Spa Website",
        category: "Healthcare",
        imageUrl: "/portfolio/placeholder-1.jpg",
        description: "Complete medical spa website with booking system",
        order: 1
      },
      {
        title: "E-commerce Fashion Store",
        category: "E-commerce",
        imageUrl: "/portfolio/placeholder-2.jpg",
        description: "WooCommerce store with modern design",
        order: 2
      },
      {
        title: "Law Firm Portal",
        category: "Professional Services",
        imageUrl: "/portfolio/placeholder-3.jpg",
        description: "Corporate website with case management",
        order: 3
      }
    ]

    for (const item of portfolioItems) {
      await prisma.portfolio.create({ data: item })
    }

    return NextResponse.json({ 
      message: "Database seeded successfully",
      admin: { email: admin.email }
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
