'use client'

import { motion } from 'framer-motion'
import type { TeamMember } from '@/types/content-schema'

interface TeamProps {
  members: TeamMember[]
  title?: string
  subtitle?: string
  className?: string
}

export default function Team({ members, title, subtitle, className = '' }: TeamProps) {
  if (members.length === 0) return null

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </div>
        )}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {members.map((member) => (
            <motion.div
              key={member.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -5 }}
              className="text-center group"
            >
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-2xl overflow-hidden">
                {member.avatar?.url ? (
                  <img src={member.avatar.url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-400">{member.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{member.title}</p>
              {member.socialLinks.length > 0 && (
                <div className="flex items-center justify-center gap-2">
                  {member.socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors text-xs"
                    >
                      {link.platform.charAt(0).toUpperCase()}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
