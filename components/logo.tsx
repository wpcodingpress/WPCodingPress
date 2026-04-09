"use client"

import { motion } from "framer-motion"
import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
}

const sizes = {
  sm: { icon: 32, text: "text-lg", padding: "p-1.5" },
  md: { icon: 40, text: "text-xl", padding: "p-2" },
  lg: { icon: 48, text: "text-2xl", padding: "p-2.5" },
  xl: { icon: 56, text: "text-3xl", padding: "p-3" },
}

export function AnimatedLogo({ className = "", size = "md", showText = true }: LogoProps) {
  const s = sizes[size]
  
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <motion.div
        className={`${s.padding} rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 relative overflow-hidden`}
        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
        
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 48 48"
          fill="none"
          className="relative z-10"
        >
          <motion.path
            d="M24 4L4 14v20l20 10 20-10V14L24 4z"
            fill="white"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.path
            d="M24 14L14 19v10l10 5 10-5V19L24 14z"
            fill="url(#logo-gradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
          <motion.circle
            cx="24"
            cy="24"
            r="4"
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          />
          <defs>
            <linearGradient id="logo-gradient" x1="14" y1="14" x2="34" y2="34">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        
        <motion.div
          className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 opacity-0 blur-lg"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <motion.span
            className={`${s.text} font-bold leading-tight tracking-tight`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-slate-800">WP</span>
            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Coding
            </span>
            <span className="text-slate-800">Press</span>
          </motion.span>
          <motion.span
            className="text-[10px] text-slate-500 tracking-widest uppercase font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Web Development Agency
          </motion.span>
        </div>
      )}
    </Link>
  )
}

export function LogoIcon({ className = "", size = 40 }: { className?: string, size?: number }) {
  return (
    <motion.div
      className={`rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      transition={{ duration: 0.3 }}
      style={{ width: size, height: size }}
    >
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />
      
      <svg
        width={size * 0.7}
        height={size * 0.7}
        viewBox="0 0 48 48"
        fill="none"
        className="relative z-10"
      >
        <motion.path
          d="M24 4L4 14v20l20 10 20-10V14L24 4z"
          fill="white"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.path
          d="M24 14L14 19v10l10 5 10-5V19L24 14z"
          fill="url(#logo-gradient-2)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        <motion.circle
          cx="24"
          cy="24"
          r="4"
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        />
        <defs>
          <linearGradient id="logo-gradient-2" x1="14" y1="14" x2="34" y2="34">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 ${className}`}
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill="none"
      >
        <path
          d="M24 4L4 14v20l20 10 20-10V14L24 4z"
          fill="white"
        />
        <path
          d="M24 14L14 19v10l10 5 10-5V19L24 14z"
          fill="url(#logo-gradient-3)"
        />
        <circle cx="24" cy="24" r="4" fill="white" />
        <defs>
          <linearGradient id="logo-gradient-3" x1="14" y1="14" x2="34" y2="34">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}
