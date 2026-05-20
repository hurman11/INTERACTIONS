import { motion, AnimatePresence } from 'framer-motion'
import { ZONE_NAMES } from '@/utils/constants'

export default function NavigationSystem({ currentZone = 0, onNavigate }) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-70 pointer-events-auto">
      <div className="flex flex-col items-end gap-1">
        {ZONE_NAMES.map((name, i) => {
          const isActive = i === currentZone
          const isPast = i < currentZone

          return (
            <button
              key={name}
              onClick={() => onNavigate?.(i)}
              className="group flex items-center gap-3 py-1.5 px-1 transition-all duration-500 cursor-pointer bg-transparent border-none outline-none"
            >
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, x: 10, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: 'auto' }}
                    exit={{ opacity: 0, x: 10, width: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="font-orbitron text-[0.6rem] uppercase tracking-[0.2em] text-cyber-cyan whitespace-nowrap text-glow-cyan"
                  >
                    {name}
                  </motion.span>
                )}
              </AnimatePresence>

              <motion.span
                className="font-outfit text-[0.5rem] uppercase tracking-wider transition-colors duration-300 hidden group-hover:inline-block whitespace-nowrap"
                initial={false}
                style={{ color: isActive ? 'transparent' : isPast ? 'rgba(255, 255, 255, 0.3)' : 'rgba(243, 244, 246, 0.15)' }}
              >
                {!isActive && name}
              </motion.span>

              <div className="relative flex items-center justify-center">
                <motion.div
                  className="rounded-full transition-all duration-500"
                  animate={{
                    width: isActive ? 10 : 5,
                    height: isActive ? 10 : 5,
                    backgroundColor: isActive
                      ? '#00E5FF'
                      : isPast
                        ? 'rgba(255, 255, 255, 0.35)'
                        : 'rgba(243, 244, 246, 0.12)',
                    boxShadow: isActive
                      ? '0 0 12px rgba(255, 255, 255, 0.6), 0 0 25px rgba(255, 255, 255, 0.25)'
                      : '0 0 0px transparent'
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />

                {isActive && (
                  <motion.div
                    className="absolute rounded-full border border-cyber-cyan/30"
                    initial={{ width: 10, height: 10, opacity: 1 }}
                    animate={{ width: 22, height: 22, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
              </div>

              {i < ZONE_NAMES.length - 1 && (
                <div className="absolute right-[4px] top-full w-px h-1"
                  style={{
                    background: isPast
                      ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05))'
                      : 'linear-gradient(to bottom, rgba(243, 244, 246, 0.06), transparent)'
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="absolute -left-2 top-0 bottom-0 w-px opacity-30"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.2), rgba(136, 136, 136, 0.2), transparent)'
        }}
      />
    </div>
  )
}
