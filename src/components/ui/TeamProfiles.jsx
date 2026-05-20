import { motion, AnimatePresence } from 'framer-motion'
import team from '@/data/team'

export default function TeamProfiles({ activeMember = 0, onNavigate, currentZone = 0 }) {
  const isVisible = currentZone === 3
  const member = team[activeMember]

  if (!isVisible || !member) return null

  // Setup unique cyber ID for each member card
  const cyberId = `syndicate-node-0${activeMember + 1}`

  return (
    <div className="fixed inset-0 pointer-events-none z-60 flex items-end justify-center pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto"
        >
          <div className="hud-panel max-w-md w-full mx-4 relative overflow-hidden" id={cyberId}>
            {/* HUD Bracket accents */}
            <div className="corner-bracket corner-bracket-tl" />
            <div className="corner-bracket corner-bracket-tr" />
            <div className="corner-bracket corner-bracket-bl" />
            <div className="corner-bracket corner-bracket-br" />

            {/* Header info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse" />
                <span className="font-orbitron text-[0.55rem] text-cyber-purple/70 uppercase tracking-[0.2em]">
                  Syndicate Node 0{activeMember + 1}/{team.length}
                </span>
              </div>
              <span className="font-outfit text-[0.5rem] text-cyber-cyan/40 uppercase tracking-wider">
                CORE ACCESS AUTHORIZED
              </span>
            </div>

            <div className="glow-line mb-3 bg-gradient-to-r from-cyber-purple/60 via-cyber-cyan/30 to-transparent" />

            {/* Member Identity */}
            <h3 className="font-orbitron text-sm text-cyber-purple tracking-[0.15em] mb-1.5 text-glow-purple">
              {member.name}
            </h3>

            <span className="inline-block px-1.5 py-0.5 mb-2.5 text-[0.55rem] font-orbitron text-cyber-cyan border border-cyber-cyan/20 bg-cyber-cyan/5 rounded-xs tracking-widest uppercase">
              {member.role}
            </span>

            {/* Bio description */}
            <p className="font-outfit text-[0.7rem] text-cyber-white/40 leading-relaxed mb-3.5">
              {member.description}
            </p>

            {/* Skills grid */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-[0.55rem] font-outfit text-cyber-cyan/70 border border-cyber-cyan/15 bg-cyber-cyan/5 rounded-sm uppercase tracking-wider"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Navigation and Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-cyber-white/5">
              <span className="font-orbitron text-[0.5rem] text-cyber-white/20 tracking-widest uppercase">
                ID: {member.id.toUpperCase()}_REV_0.6
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate?.(Math.max(0, activeMember - 1))}
                  disabled={activeMember === 0}
                  className="w-6 h-6 flex items-center justify-center border border-cyber-purple/20 bg-cyber-purple/5 text-cyber-purple/50 hover:bg-cyber-purple/10 hover:border-cyber-purple/40 transition-all duration-300 text-[0.6rem] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer rounded-sm"
                >
                  ◂
                </button>
                <button
                  onClick={() => onNavigate?.(Math.min(team.length - 1, activeMember + 1))}
                  disabled={activeMember === team.length - 1}
                  className="w-6 h-6 flex items-center justify-center border border-cyber-purple/20 bg-cyber-purple/5 text-cyber-purple/50 hover:bg-cyber-purple/10 hover:border-cyber-purple/40 transition-all duration-300 text-[0.6rem] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer rounded-sm"
                >
                  ▸
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
