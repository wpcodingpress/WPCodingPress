"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ServiceHeroClientProps {
  slug: string
  title: string
  description: string
  image: string
}

export default function ServiceHeroClient({ slug, title, description, image }: ServiceHeroClientProps) {
  return (
    <div className="container mx-auto px-4 py-24 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            Our Services
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {description}
          </p>
          <div className="flex flex-wrap gap-4 relative z-20">
            <Link href={`/order?service=${slug}&package=standard`} className="relative z-20">
              <Button size="lg" className="glow">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact" className="relative z-20">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/30 rounded-full blur-2xl" />
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl" />
        </motion.div>
      </div>
    </div>
  )
}
