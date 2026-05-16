'use client'

import { useMemo } from 'react'
import type { NormalizedSiteData } from '@/types/content-schema'
import { classifyIndustry, detectFeatures, generateLayout } from '@/lib/engine'
import { generateIndustryLayout } from '@/lib/layouts'
import { getIndustryColors, getTypographyForIndustry, getAnimationsForIndustry } from '@/lib/design-tokens'
import AdaptiveLayout from '@/components/layouts/AdaptiveLayout'
import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import CTA from '@/components/sections/CTA'
import Testimonials from '@/components/sections/Testimonials'
import Pricing from '@/components/sections/Pricing'
import BlogGrid from '@/components/sections/BlogGrid'
import FAQ from '@/components/sections/FAQ'
import Gallery from '@/components/sections/Gallery'
import Contact from '@/components/sections/Contact'
import Team from '@/components/sections/Team'
import Stats from '@/components/sections/Stats'
import Newsletter from '@/components/sections/Newsletter'
import Footer from '@/components/sections/Footer'

interface AdaptiveTemplateProps {
  site: NormalizedSiteData
  wpRaw?: Record<string, unknown>
  siteName?: string
}

export default function AdaptiveTemplate({ site, wpRaw, siteName }: AdaptiveTemplateProps) {
  const analysis = useMemo(() => {
    if (wpRaw) {
      const features = detectFeatures(wpRaw)
      const industry = classifyIndustry(wpRaw, features)
      const layout = generateLayout(site, industry)
      const industryLayout = generateIndustryLayout(site, industry.category)
      const colors = getIndustryColors(industry.category)
      const typography = getTypographyForIndustry(industry.category)
      const animations = getAnimationsForIndustry(industry.category)
      return { features, industry, layout, industryLayout, colors, typography, animations }
    }

    const features = detectFeatures({} as Record<string, unknown>)
    const industry = classifyIndustry({} as Record<string, unknown>, features)
    const layout = generateLayout(site, industry)
    const industryLayout = generateIndustryLayout(site, industry.category)
    const colors = getIndustryColors(industry.category)
    const typography = getTypographyForIndustry(industry.category)
    const animations = getAnimationsForIndustry(industry.category)
    return { features, industry, layout, industryLayout, colors, typography, animations }
  }, [wpRaw, site])

  if (!analysis) return null

  const { features, industry, layout, industryLayout, colors, typography, animations } = analysis
  const sections = industryLayout.sections

  return (
    <AdaptiveLayout
      site={site}
      features={features}
      industry={industry}
      layout={layout}
      industryLayout={industryLayout}
      colors={colors}
      typography={typography}
      animations={animations}
    >
      {sections.map((section) => {
        switch (section.component) {
          case 'Navbar':
            return (
              <Navbar
                key={section.id}
                navigation={site.navigation}
                siteName={site.settings.name || siteName || ''}
                logo={site.settings.logo}
                variant={section.layoutVariant as 'default' | 'glass' | 'minimal' | 'news'}
              />
            )
          case 'Hero':
            return site.hero ? (
              <Hero
                key={section.id}
                content={site.hero}
                siteName={site.settings.name || siteName || ''}
                variant={section.layoutVariant as 'centered' | 'split' | 'fullscreen' | 'overlay'}
              />
            ) : null
          case 'Features':
            return site.services.length > 0 ? (
              <Features
                key={section.id}
                services={site.services}
                title="Our Services"
                variant={section.layoutVariant as 'grid' | 'cards'}
                maxItems={section.maxItems}
              />
            ) : null
          case 'Stats':
            return site.stats.length > 0 ? (
              <Stats
                key={section.id}
                stats={site.stats}
                variant={section.layoutVariant as 'default' | 'counters' | 'pills' | 'ticker'}
              />
            ) : null
          case 'Testimonials':
            return site.testimonials.length > 0 ? (
              <Testimonials
                key={section.id}
                testimonials={site.testimonials}
                title="What People Say"
                variant={section.layoutVariant as 'carousel' | 'grid'}
              />
            ) : null
          case 'Pricing':
            return site.products.length > 0 ? (
              <Pricing
                key={section.id}
                products={site.products}
                title="Pricing Plans"
              />
            ) : null
          case 'BlogGrid':
            return site.posts.length > 0 ? (
              <BlogGrid
                key={section.id}
                posts={site.posts}
                title="Latest Posts"
                variant={section.layoutVariant as 'grid' | 'featured'}
                maxItems={section.maxItems}
              />
            ) : null
          case 'FAQ':
            return site.faqs.length > 0 ? (
              <FAQ
                key={section.id}
                faqs={site.faqs}
                title="Frequently Asked Questions"
              />
            ) : null
          case 'Gallery':
            return site.gallery.length > 0 || site.portfolio.length > 0 ? (
              <Gallery
                key={section.id}
                items={site.portfolio.length > 0 ? site.portfolio.map(p => ({ id: p.id, title: p.title, description: p.description, image: p.image, category: p.category })) : site.gallery}
                title="Our Work"
                variant={section.layoutVariant as 'grid' | 'masonry'}
              />
            ) : null
          case 'Contact':
            return site.contact ? (
              <Contact
                key={section.id}
                contact={site.contact}
                title="Get In Touch"
                variant={section.layoutVariant as 'split'}
              />
            ) : null
          case 'Team':
            return site.team.length > 0 ? (
              <Team
                key={section.id}
                members={site.team}
                title="Our Team"
              />
            ) : null
          case 'CTA':
            return site.cta ? (
              <CTA
                key={section.id}
                content={site.cta}
                variant={section.layoutVariant as 'default' | 'gradient'}
              />
            ) : null
          case 'Newsletter':
            return site.newsletter ? (
              <Newsletter
                key={section.id}
                config={site.newsletter}
                variant={section.layoutVariant as 'inline'}
              />
            ) : null
          case 'Footer':
            return site.footer ? (
              <Footer
                key={section.id}
                footer={site.footer}
                variant={section.layoutVariant as 'default' | 'minimal'}
              />
            ) : null
          default:
            return null
        }
      })}
    </AdaptiveLayout>
  )
}
