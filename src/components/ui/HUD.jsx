import { motion } from 'framer-motion'
import { ZONE_NAMES } from '@/utils/constants'

const ZONE_DESCRIPTIONS = [
  'Entering the Gateway',
  'Accessing the Core',
  'Exploring the Lab',
  'Meeting the Team',
  'Scanning the Network',
  'Opening Terminal'
]

const ZONE_COLORS = ['#00E5FF', '#00E5FF', '#D946EF', '#FF3B00', '#00E5FF', '#D946EF']

function ScrollProgressBar({ progress }) {
  return (
    <div className="w-20 h-[2px] bg-cyber-charcoal rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{
          background: 'linear-gradient(90deg, #00E5FF, #D946EF)',
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
        }}
        animate={{ width: `${(progress * 100).toFixed(1)}%` }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    </div>
  )
}

function FPSMeter() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1 h-1 rounded-full bg-green-400/60 animate-pulse" />
      <span className="font-outfit text-[0.45rem] text-green-400/40 uppercase tracking-wider">
        Online
      </span>
    </div>
  )
}

export default function HUD({ currentZone = 0, scrollProgress = 0 }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-60">
      {/* Top left — System info */}
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

      {/* Top right — Status */}
      <div className="absolute top-5 right-6 flex items-center gap-4">
        <FPSMeter />
        <div className="w-px h-3 bg-cyber-white/10" />
        <span className="font-outfit text-[0.5rem] text-cyber-white/15 uppercase tracking-wider">
          {new Date().toISOString().split('T')[0]}
        </span>
      </div>

      {/* Bottom left — Zone info + progress */}
      <div className="absolute bottom-5 left-6 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-4 h-px"
            style={{ backgroundColor: ZONE_COLORS[currentZone] }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.span
            key={currentZone}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-orbitron text-[0.6rem] uppercase tracking-[0.25em]"
            style={{ color: `${ZONE_COLORS[currentZone]}99` }}
          >
            {ZONE_NAMES[currentZone]}
          </motion.span>
        </div>

        <div className="flex items-center gap-2 ml-6">
          <span className="font-outfit text-[0.45rem] text-cyber-white/15 uppercase tracking-wider">
            Zone {currentZone + 1}/{ZONE_NAMES.length}
          </span>
          <ScrollProgressBar progress={scrollProgress} />
          <span className="font-mono text-[0.4rem] text-cyber-cyan/20">
            {(scrollProgress * 100).toFixed(0)}%
          </span>
        </div>

        {/* Depth indicator */}
        <div className="flex items-center gap-2 ml-6">
          <span className="font-mono text-[0.4rem] text-cyber-white/10 tracking-wider">
            DEPTH: {(scrollProgress * 75).toFixed(1)}m
          </span>
          <span className="font-mono text-[0.4rem] text-cyber-purple/15">|</span>
          <span className="font-mono text-[0.4rem] text-cyber-white/10 tracking-wider">
            SECTOR: {String.fromCharCode(65 + currentZone)}-{(currentZone * 7 + 3).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Bottom right — Zone description */}
      <div className="absolute bottom-5 right-6 flex flex-col items-end gap-1">
        <motion.span
          key={currentZone}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-outfit text-[0.45rem] uppercase tracking-wider"
          style={{ color: `${ZONE_COLORS[currentZone]}4D` }}
        >
          {ZONE_DESCRIPTIONS[currentZone]}
        </motion.span>
        <span className="font-mono text-[0.35rem] text-cyber-white/8 tracking-widest">
          INTERACTIONS.DEV
        </span>
      </div>

      {/* Frame decorations */}
      <div className="absolute top-1/2 left-3 -translate-y-1/2">
        <motion.div
          className="glow-line-vertical h-16"
          animate={{ opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      <div className="absolute top-14 left-6 right-6">
        <div className="glow-line opacity-10" />
      </div>

      <div className="absolute bottom-14 left-6 right-6">
        <div className="glow-line opacity-10" />
      </div>

      {/* Corner brackets */}
      <div className="absolute top-14 left-5">
        <div className="corner-bracket corner-bracket-tl" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      </div>
      <div className="absolute top-14 right-5">
        <div className="corner-bracket corner-bracket-tr" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      </div>
      <div className="absolute bottom-14 left-5">
        <div className="corner-bracket corner-bracket-bl" style={{ borderColor: 'rgba(136, 136, 136, 0.1)' }} />
      </div>
      <div className="absolute bottom-14 right-5">
        <div className="corner-bracket corner-bracket-br" style={{ borderColor: 'rgba(136, 136, 136, 0.1)' }} />
      </div>
    </div>
  )
}
