"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function useGSAP() {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])
}

type GsapTarget = string | Element | NodeListOf<Element> | Element[]

export function gsapFadeIn(element: GsapTarget, options?: {
  y?: number
  x?: number
  scale?: number
  duration?: number
  delay?: number
  start?: string
  end?: string
  scrub?: boolean | number
  markers?: boolean
}) {
  const defaults = {
    y: 80,
    x: 0,
    scale: 1,
    duration: 1,
    delay: 0,
    start: "top 85%",
    end: "bottom 15%",
    scrub: false,
    markers: false,
  }
  const config = { ...defaults, ...options }

  gsap.set(element, { opacity: 0, y: config.y, x: config.x, scale: config.scale })

  const animation: gsap.TweenVars = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    duration: config.duration,
    delay: config.delay,
    ease: "power3.out",
  }

  if (config.scrub) {
    return gsap.to(element, {
      ...animation,
      scrollTrigger: {
        trigger: element,
        start: config.start,
        end: config.end,
        scrub: config.scrub,
        markers: config.markers,
      },
    })
  }

  ScrollTrigger.create({
    trigger: element,
    start: config.start,
    onEnter: () => gsap.to(element, animation),
    once: true,
  })

  return animation
}

export function gsapStaggerIn(elements: GsapTarget, options?: {
  y?: number
  duration?: number
  stagger?: number
  start?: string
}) {
  const defaults = {
    y: 80,
    duration: 0.8,
    stagger: 0.1,
    start: "top 85%",
  }
  const config = { ...defaults, ...options }

  gsap.set(elements, { opacity: 0, y: config.y })

  ScrollTrigger.create({
    trigger: elements,
    start: config.start,
    onEnter: () => {
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: config.duration,
        stagger: config.stagger,
        ease: "power3.out",
      })
    },
    once: true,
  })
}

export function gsapParallax(element: GsapTarget, speed: number = 0.5) {
  gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  })
}

export function gsapHorizontalScroll(container: HTMLElement, triggers: GsapTarget) {
  const sections = gsap.utils.toArray(triggers) as Element[]
  const containerEl = container

  gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: containerEl,
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => "+=" + containerEl.offsetWidth,
    },
  })
}

export function gsapTextReveal(element: GsapTarget, options?: {
  duration?: number
  delay?: number
  y?: number
}) {
  const defaults = { duration: 1, delay: 0, y: 100 }
  const config = { ...defaults, ...options }

  gsap.set(element, { opacity: 0, y: config.y })
  gsap.set(element, {
    scrollTrigger: {
      trigger: element,
      start: "top 85%",
      onEnter: () => {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: config.duration,
          delay: config.delay,
          ease: "power3.out",
        })
      },
      once: true,
    },
  })
}

export function gsapRotateIn(element: GsapTarget, options?: {
  duration?: number
  delay?: number
  start?: string
}) {
  const defaults = { duration: 1, delay: 0, start: "top 85%" }
  const config = { ...defaults, ...options }

  gsap.set(element, { opacity: 0, rotation: -15, scale: 0.9 })

  ScrollTrigger.create({
    trigger: element,
    start: config.start,
    onEnter: () => {
      gsap.to(element, {
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: config.duration,
        delay: config.delay,
        ease: "back.out(1.7)",
      })
    },
    once: true,
  })
}
