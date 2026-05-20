import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import social from '@/data/social'

const TERMINAL_LINES = [
  '> ESTABLISHING SECURE CONNECTION...',
  '> ENCRYPTION: AES-256-GCM ✓',
  '> CHANNEL: OPEN',
  '> AWAITING INPUT_'
]

function TypingLine({ text, delay, onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        indexRef.current++
        setDisplayed(text.slice(0, indexRef.current))
        if (indexRef.current >= text.length) {
          clearInterval(interval)
          onComplete?.()
        }
      }, 20)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, delay, onComplete])

  return (
    <div className="font-mono text-[0.6rem] text-cyber-cyan/50 leading-relaxed">
      {displayed}
      {displayed.length < text.length && (
        <span className="animate-pulse">█</span>
      )}
    </div>
  )
}

export default function ContactTerminal({ currentZone = 0 }) {
  const isVisible = currentZone === 5
  const [bootComplete, setBootComplete] = useState(false)
  const [completedLines, setCompletedLines] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setBootComplete(false)
      setCompletedLines(0)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-60 flex items-end justify-center pb-12">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-lg mx-4"
        >
          <div className="hud-panel relative overflow-hidden">
            <div className="corner-bracket corner-bracket-tl" />
            <div className="corner-bracket corner-bracket-tr" />
            <div className="corner-bracket corner-bracket-bl" />
            <div className="corner-bracket corner-bracket-br" />

            {/* Terminal header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="font-orbitron text-[0.55rem] text-cyber-cyan/60 uppercase tracking-[0.2em]">
                  CONTACT TERMINAL
                </span>
              </div>
              <span className="font-outfit text-[0.5rem] text-cyber-white/20 uppercase tracking-wider">
                SESSION ACTIVE
              </span>
            </div>

            <div className="glow-line mb-3" />

            {/* Boot sequence */}
            <div className="mb-4 space-y-1 bg-black/30 rounded p-3 border border-cyber-cyan/5">
              {TERMINAL_LINES.map((line, i) => (
                i <= completedLines && (
                  <TypingLine
                    key={i}
                    text={line}
                    delay={i * 600}
                    onComplete={() => {
                      setCompletedLines(prev => Math.max(prev, i + 1))
                      if (i === TERMINAL_LINES.length - 1) {
                        setTimeout(() => setBootComplete(true), 300)
                      }
                    }}
                  />
                )
              ))}
            </div>

            {/* Social links */}
            <AnimatePresence>
              {bootComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {social.map((link, i) => (
                      <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className="group flex items-center gap-3 p-3 border border-cyber-cyan/10 bg-cyber-cyan/[0.02] hover:bg-cyber-cyan/[0.06] hover:border-cyber-cyan/25 transition-all duration-300 rounded-sm cursor-pointer"
                      >
                        <span className="text-cyber-cyan/60 text-lg group-hover:text-cyber-cyan transition-colors duration-300">
                          {link.icon}
                        </span>
                        <div>
                          <div className="font-orbitron text-[0.55rem] text-cyber-cyan/70 tracking-[0.15em] group-hover:text-cyber-cyan transition-colors duration-300">
                            {link.label}
                          </div>
                          <div className="font-outfit text-[0.5rem] text-cyber-white/25 mt-0.5">
                            {link.description}
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>

                  {/* Message prompt */}
                  <div className="border border-cyber-purple/15 bg-cyber-purple/[0.03] rounded-sm p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-1 rounded-full bg-cyber-purple animate-pulse" />
                      <span className="font-orbitron text-[0.5rem] text-cyber-purple/60 tracking-[0.2em]">
                        DIRECT TRANSMISSION
                      </span>
                    </div>
                    <a
                      href="mailto:contact@interactions.dev"
                      className="block w-full text-center py-2 border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan/70 font-orbitron text-[0.6rem] tracking-[0.15em] hover:bg-cyber-cyan/10 hover:border-cyber-cyan/40 hover:text-cyber-cyan transition-all duration-300 cursor-pointer rounded-sm"
                    >
                      ▸ SEND MESSAGE
                    </a>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-cyber-white/5 flex items-center justify-between">
                    <span className="font-outfit text-[0.5rem] text-cyber-white/15 tracking-wider">
                      © 2025 INTERACTIONS
                    </span>
                    <span className="font-outfit text-[0.5rem] text-cyber-cyan/20 tracking-wider">
                      DIGITAL CIVILIZATION
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
