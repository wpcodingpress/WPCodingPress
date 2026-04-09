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
  lg: { icon: 48, text: "2xl", padding: "p-2.5" },
  xl: { icon: 56, text: "3xl", padding: "p-3" },
}

export function AnimatedLogo({ className = "", size = "md", showText = true }: LogoProps) {
  const s = sizes[size]
  
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <motion.div
        className={`${s.padding} rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 relative overflow-hidden`}
        whileHover={{ scale: 1.05 }}
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
            d="M28 4L12 26H22L20 44L36 22H26L28 4Z"
            fill="white"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        <motion.div
          className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-0 blur-lg"
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
            <span className="text-slate-800">WPCoding</span>
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              Press
            </span>
          </motion.span>
        </div>
      )}
    </Link>
  )
}

export function LogoIcon({ className = "", size = 40 }: { className?: string, size?: number }) {
  return (
    <motion.div
      className={`rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.1, rotate: 5 }}
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
          d="M28 4L12 26H22L20 44L36 22H26L28 4Z"
          fill="white"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  )
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ${className}`}
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
          d="M28 4L12 26H22L20 44L36 22H26L28 4Z"
          fill="white"
        />
      </svg>
    </motion.div>
  )
}

export function LogoWithText({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <LogoIcon size={36} />
      <span className="text-xl font-bold">
        <span className="text-slate-800">WPCoding</span>
        <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
          Press
        </span>
      </span>
    </Link>
  )
}
