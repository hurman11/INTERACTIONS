import { motion, useTransform } from 'framer-motion'
import { ZONE_NAMES } from '@/utils/constants'

export default function HUD({ currentZone = 0, scrollMotion }) {
  const width = useTransform(scrollMotion, [0, 1], ['0%', '100%'])
  return (
    <div className="fixed inset-0 pointer-events-none z-60">
      <div className="absolute top-5 left-6 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse-glow" />
          <span className="font-orbitron text-[0.55rem] text-cyber-cyan/50 uppercase tracking-[0.15em]">
            INTERACTION CORE
          </span>
        </div>
        <div className="w-px h-3 bg-cyber-cyan/15" />
        <span className="font-outfit text-[0.5rem] text-cyber-white/20 uppercase tracking-wider">
          v2.1
        </span>
      </div>

      <div className="absolute top-5 right-6 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-green-400/60 animate-pulse" />
          <span className="font-outfit text-[0.5rem] text-green-400/40 uppercase tracking-wider">
            Online
          </span>
        </div>
        <div className="w-px h-3 bg-cyber-white/10" />
        <span className="font-outfit text-[0.5rem] text-cyber-white/15 uppercase tracking-wider">
          {new Date().toISOString().split('T')[0]}
        </span>
      </div>

      <div className="absolute bottom-5 left-6 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-px bg-cyber-cyan/25" />
          <motion.span
            key={currentZone}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-orbitron text-[0.6rem] text-cyber-cyan/60 uppercase tracking-[0.25em]"
          >
            {ZONE_NAMES[currentZone]}
          </motion.span>
        </div>

        <div className="flex items-center gap-2 ml-6">
          <span className="font-outfit text-[0.45rem] text-cyber-white/15 uppercase tracking-wider">
            Zone {currentZone + 1}/{ZONE_NAMES.length}
          </span>
          <div className="w-16 h-px bg-cyber-charcoal rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #00f0ff, #bc34fa)',
                boxShadow: '0 0 6px rgba(0, 240, 255, 0.4)',
                width
              }}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 right-6">
        <motion.span
          key={currentZone}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-outfit text-[0.45rem] text-cyber-purple/30 uppercase tracking-wider"
        >
          {currentZone === 0 && "Entering the Gateway"}
          {currentZone === 1 && "Accessing the Core"}
          {currentZone === 2 && "Exploring the Lab"}
          {currentZone === 3 && "Meeting the Team"}
          {currentZone === 4 && "Scanning the Network"}
          {currentZone === 5 && "Opening Terminal"}
        </motion.span>
      </div>

      <div className="absolute top-1/2 left-3 -translate-y-1/2">
        <div className="glow-line-vertical h-16 opacity-15" />
      </div>

      <div className="absolute top-14 left-6 right-6">
        <div className="glow-line opacity-10" />
      </div>

      <div className="absolute bottom-14 left-6 right-6">
        <div className="glow-line opacity-10" />
      </div>

      <div className="absolute top-14 left-5">
        <div className="corner-bracket corner-bracket-tl" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }} />
      </div>
      <div className="absolute top-14 right-5">
        <div className="corner-bracket corner-bracket-tr" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }} />
      </div>
      <div className="absolute bottom-14 left-5">
        <div className="corner-bracket corner-bracket-bl" style={{ borderColor: 'rgba(188, 52, 250, 0.1)' }} />
      </div>
      <div className="absolute bottom-14 right-5">
        <div className="corner-bracket corner-bracket-br" style={{ borderColor: 'rgba(188, 52, 250, 0.1)' }} />
      </div>
    </div>
  )
}
