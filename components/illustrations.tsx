"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface IllustrationProps {
  className?: string
}

export function CodeIllustration({ className = "" }: IllustrationProps) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const lines = ref.current.querySelectorAll(".code-line")
    gsap.fromTo(
      lines,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      }
    )
  }, [])

  return (
    <svg ref={ref} viewBox="0 0 400 300" className={className} fill="none">
      <rect x="20" y="20" width="360" height="260" rx="16" fill="#1e1b4b" />
      <rect x="20" y="20" width="360" height="40" rx="16" fill="#312e81" />
      <circle cx="45" cy="40" r="6" fill="#f87171" />
      <circle cx="65" cy="40" r="6" fill="#fbbf24" />
      <circle cx="85" cy="40" r="6" fill="#4ade80" />
      <g className="code-line">
        <rect x="40" y="75" width="80" height="12" rx="4" fill="#c4b5fd" />
        <rect x="130" y="75" width="60" height="12" rx="4" fill="#a78bfa" />
      </g>
      <g className="code-line">
        <rect x="55" y="100" width="50" height="12" rx="4" fill="#f472b6" />
        <rect x="115" y="100" width="80" height="12" rx="4" fill="#e879f9" />
      </g>
      <g className="code-line">
        <rect x="55" y="125" width="70" height="12" rx="4" fill="#818cf8" />
        <rect x="135" y="125" width="100" height="12" rx="4" fill="#a5b4fc" />
      </g>
      <g className="code-line">
        <rect x="40" y="150" width="40" height="12" rx="4" fill="#34d399" />
      </g>
      <g className="code-line">
        <rect x="55" y="175" width="60" height="12" rx="4" fill="#fbbf24" />
        <rect x="125" y="175" width="90" height="12" rx="4" fill="#fcd34d" />
      </g>
      <g className="code-line">
        <rect x="40" y="200" width="30" height="12" rx="4" fill="#60a5fa" />
      </g>
      <motion.path
        d="M300 220 L320 240 L300 260"
        stroke="#a78bfa"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M340 220 L320 240 L340 260"
        stroke="#f472b6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
    </svg>
  )
}

export function ServerIllustration({ className = "" }: IllustrationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      }
    )
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="w-48 h-32 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl shadow-2xl shadow-purple-500/30 p-4">
        <div className="flex gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-white/20 rounded w-full" />
          <div className="h-3 bg-white/20 rounded w-3/4" />
          <div className="h-3 bg-white/20 rounded w-1/2" />
        </div>
      </div>
      <motion.div
        className="absolute -right-4 top-1/2 w-8 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded"
        animate={{ scaleX: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="absolute -left-4 top-1/2 w-8 h-1 bg-gradient-to-l from-blue-500 to-cyan-500 rounded"
        animate={{ scaleX: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      />
    </div>
  )
}

export function RocketIllustration({ className = "" }: IllustrationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 50, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      }
    )
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        className="w-32 h-32 relative"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <path
            d="M50 10 C50 10 70 30 70 60 C70 80 60 90 50 95 C40 90 30 80 30 60 C30 30 50 10 50 10Z"
            fill="url(#rocket-gradient)"
          />
          <circle cx="50" cy="45" r="10" fill="#1e1b4b" />
          <path d="M30 70 L20 85 L35 75Z" fill="#f472b6" />
          <path d="M70 70 L80 85 L65 75Z" fill="#f472b6" />
          <defs>
            <linearGradient id="rocket-gradient" x1="30" y1="10" x2="70" y2="95">
              <stop stopColor="#a78bfa" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-16 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-b-full blur-sm"
          animate={{ height: [16, 24, 16], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      </motion.div>
    </div>
  )
}

export function DeviceIllustration({ className = "" }: IllustrationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0, rotateY: -30 },
      {
        opacity: 1,
        rotateY: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      }
    )
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative">
        <div className="w-64 h-40 bg-slate-800 rounded-xl shadow-2xl overflow-hidden border-4 border-slate-700">
          <div className="h-6 bg-slate-700 flex items-center px-2 gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <div className="h-4 bg-gradient-to-r from-violet-500 to-pink-500 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-2 bg-white/20 rounded w-full" />
            <div className="h-2 bg-white/20 rounded w-3/4" />
            <div className="h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded mt-3" />
          </div>
        </div>
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-3 bg-slate-900/30 blur-xl rounded-full"
          animate={{ scaleX: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  )
}

export function SeoIllustration({ className = "" }: IllustrationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const bars = ref.current.querySelectorAll(".bar")
    gsap.fromTo(
      bars,
      { height: 0 },
      {
        height: (i) => [20, 40, 60, 80, 100, 70, 90, 50][i],
        duration: 0.8,
        stagger: 0.1,
        ease: "bounce.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      }
    )
  }, [])

  return (
    <div ref={ref} className={`flex items-end justify-center gap-2 h-32 ${className}`}>
      {[20, 40, 60, 80, 100, 70, 90, 50].map((h, i) => (
        <div
          key={i}
          className="bar w-6 bg-gradient-to-t from-violet-600 to-pink-500 rounded-t"
          style={{ height: 0 }}
        />
      ))}
    </div>
  )
}

export function EcommerceIllustration({ className = "" }: IllustrationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current.querySelectorAll(".item"),
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      }
    )
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="w-48 h-40 bg-white rounded-2xl shadow-xl p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="item aspect-square bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="item aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="item aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="item aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
        </div>
      </div>
      <motion.div
        className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        3
      </motion.div>
    </div>
  )
}

export function CloudIllustration({ className = "" }: IllustrationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          once: true,
        },
      }
    )
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.svg
        viewBox="0 0 200 120"
        className="w-full h-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <defs>
          <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <path
          d="M50 80 C30 80 20 65 25 50 C20 35 35 20 50 25 C55 10 75 5 85 15 C100 5 120 15 125 35 C140 25 165 40 160 60 C175 65 170 85 150 85 Z"
          fill="url(#cloud-gradient)"
        />
        <motion.path
          d="M60 90 L60 110 M100 90 L100 115 M140 90 L140 105"
          stroke="#7c3aed"
          strokeWidth="4"
          strokeLinecap="round"
          animate={{ y1: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.svg>
    </div>
  )
}
