import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_SEQUENCE = [
  "INITIALIZING INTERACTION CORE...",
  "LOADING 3D ENGINE.............",
  "ESTABLISHING NEURAL LINKS.....",
  "CALIBRATING HOLOGRAPHIC MATRIX",
  "SYNCING ENVIRONMENT DATA......",
  "ACTIVATING PARTICLE SYSTEMS...",
  "DEPLOYING DIGITAL UNIVERSE....",
  "SYSTEM ONLINE ✦ WELCOME"
]

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [visibleLines, setVisibleLines] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const frameRef = useRef(null)
  const startTimeRef = useRef(null)
  const duration = 3200

  useEffect(() => {
    startTimeRef.current = performance.now()

    function animate(now) {
      const elapsed = now - startTimeRef.current
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)

      setProgress(eased * 100)

      const lineIndex = Math.floor(eased * BOOT_SEQUENCE.length)
      setVisibleLines(Math.min(lineIndex + 1, BOOT_SEQUENCE.length))

      if (t < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          setIsExiting(true)
          setTimeout(() => {
            onComplete?.()
          }, 800)
        }, 400)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="loading-grid" />
          <div className="scanline-overlay" />

          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse-glow" />
            <span className="boot-text">SYS.BOOT v2.1.0</span>
          </div>

          <div className="absolute top-6 right-6">
            <span className="boot-text opacity-40">
              {new Date().toISOString().split('T')[0]}
            </span>
          </div>

          <motion.div
            className="relative flex flex-col items-center gap-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <div className="absolute -inset-8 bg-radial-glow opacity-50" />
              <h1 className="relative font-orbitron text-4xl md:text-6xl font-bold tracking-tight holo-text-lg select-none">
                INTERACTIONS
              </h1>
              <div className="absolute -bottom-3 left-0 right-0 h-px glow-line" />
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="loading-progress-track">
                <div
                  className="loading-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between w-[280px]">
                <span className="boot-text">{Math.floor(progress)}%</span>
                <span className="boot-text opacity-40">
                  {progress < 100 ? "LOADING" : "READY"}
                </span>
              </div>
            </div>

            <div className="relative w-[320px] md:w-[400px] hud-panel overflow-hidden">
              <div className="corner-bracket corner-bracket-tl" />
              <div className="corner-bracket corner-bracket-tr" />
              <div className="corner-bracket corner-bracket-bl" />
              <div className="corner-bracket corner-bracket-br" />

              <div className="flex flex-col gap-1.5">
                {BOOT_SEQUENCE.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={i < visibleLines ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center gap-2"
                  >
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${
                      i < visibleLines - 1
                        ? "bg-cyber-cyan"
                        : i === visibleLines - 1
                          ? "bg-cyber-cyan animate-pulse"
                          : "bg-cyber-cyan/20"
                    }`} />
                    <span className={`boot-text ${
                      i < visibleLines
                        ? i === BOOT_SEQUENCE.length - 1
                          ? "text-cyber-cyan"
                          : "text-cyber-white/40"
                        : "text-cyber-white/10"
                    }`}>
                      {line}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <span className="boot-text opacity-30 tracking-[0.3em]">
              DIGITAL CIVILIZATION
            </span>
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <div className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                progress >= 100 ? "bg-green-400" : "bg-cyber-orange animate-pulse"
              }`} />
              <span className="boot-text opacity-40">
                {progress >= 100 ? "CONNECTED" : "CONNECTING"}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
