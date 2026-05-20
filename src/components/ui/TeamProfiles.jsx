import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import team from '@/data/team'

const MEMBER_COLORS = ['#00E5FF', '#D946EF', '#FF3B00']

export default function TeamProfiles({ currentZone = 0, activeMember = 0 }) {
  const isVisible = currentZone === 3
  const member = team[activeMember]

  if (!isVisible || !member) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-60 flex items-end justify-center pb-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto"
        >
          <div className="hud-panel max-w-sm w-full mx-4 relative overflow-hidden">
            <div className="corner-bracket corner-bracket-tl" />
            <div className="corner-bracket corner-bracket-tr" />
            <div className="corner-bracket corner-bracket-bl" />
            <div className="corner-bracket corner-bracket-br" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: MEMBER_COLORS[activeMember] }}
                />
                <span
                  className="font-orbitron text-[0.6rem] uppercase tracking-[0.2em]"
                  style={{ color: MEMBER_COLORS[activeMember] }}
                >
                  {member.name}
                </span>
              </div>
              <span className="font-outfit text-[0.5rem] text-cyber-white/25 uppercase tracking-wider">
                Operative {activeMember + 1}/{team.length}
              </span>
            </div>

            <div className="glow-line mb-3" />

            <p className="font-outfit text-[0.65rem] text-cyber-white/35 uppercase tracking-[0.15em] mb-1.5"
              style={{ color: `${MEMBER_COLORS[activeMember]}80` }}
            >
              {member.role}
            </p>

            <p className="font-outfit text-[0.7rem] text-cyber-white/40 leading-relaxed mb-3">
              {member.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-[0.55rem] font-outfit uppercase tracking-wider rounded-sm"
                  style={{
                    color: `${MEMBER_COLORS[activeMember]}B3`,
                    borderColor: `${MEMBER_COLORS[activeMember]}25`,
                    backgroundColor: `${MEMBER_COLORS[activeMember]}0D`,
                    border: `1px solid ${MEMBER_COLORS[activeMember]}25`
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
