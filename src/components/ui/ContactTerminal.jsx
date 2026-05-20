import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ContactTerminal({ currentZone = 0 }) {
  const isVisible = currentZone === 5
  
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [transmissionState, setTransmissionState] = useState('idle') // idle, handshake, encrypting, transmitting, success
  const [consoleLogs, setConsoleLogs] = useState([])
  const logsEndRef = useRef(null)

  // Web Audio Synthesizer Beeps for premium sci-fi tactile feedback
  const playTypeSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      
      osc.type = 'sine'
      // Subtle variations in pitch to feel like vintage relays
      osc.frequency.value = 650 + Math.random() * 150 
      
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.04)
      
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.04)
    } catch (e) {
      // AudioContext might be blocked until user gesture, ignore safely
    }
  }, [])

  const playSweepSound = useCallback((success = true) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const now = audioCtx.currentTime
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      
      osc.type = success ? 'triangle' : 'sawtooth'
      osc.frequency.setValueAtTime(success ? 300 : 150, now)
      osc.frequency.exponentialRampToValueAtTime(success ? 1000 : 80, now + 0.6)
      
      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.6)
      
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(now + 0.6)
    } catch (e) {}
  }, [])

  const handleInputChange = (field, val) => {
    if (transmissionState !== 'idle') return
    playTypeSound()
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  // Scroll terminal logs to bottom automatically
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [consoleLogs])

  const addLog = useCallback((text, delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`])
        playTypeSound()
        resolve()
      }, delay)
    })
  }, [playTypeSound])

  const handleTransmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    if (transmissionState !== 'idle') return

    setTransmissionState('handshake')
    setConsoleLogs([])
    playSweepSound(true)

    await addLog("INITIATING BROADBAND CONNECTION BUFFER...", 100)
    await addLog("RESOLVING ENDPOINT IP: 127.0.0.95 (DEEP_CORE_CONSTELLATION)...", 400)
    
    setTransmissionState('encrypting')
    await addLog("ESTABLISHING ENCRYPTED SECURE CHANNEL (AES-256)...", 400)
    await addLog(`PREPARING SENDER DATA: [ID: ${formData.name.toUpperCase()}]`, 300)
    await addLog(`PREPARING METADATA ROUTE: [RELAY: ${formData.email}]`, 300)
    
    setTransmissionState('transmitting')
    await addLog("TRANSMITTING ENCRYPTED QUANTUM MESSAGE PACKETS...", 500)
    await addLog("BURST PACKETS IN FLIGHT: . . . . . 100% COMPLETE", 600)
    
    setTransmissionState('success')
    playSweepSound(true)
    await addLog("TRANSMISSION COMPLETED SUCCESSFULLY!", 400)
    await addLog("CORE STATUS: STANDBY // SIGNAL EMBEDDED IN DEEP SPACE.", 200)
  }

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' })
    setTransmissionState('idle')
    setConsoleLogs([])
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-60 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="terminal-form"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-lg"
        >
          <div className="hud-panel relative overflow-hidden backdrop-blur-md border border-cyber-purple/20 bg-cyber-black/80">
            {/* Tech bracket shapes */}
            <div className="corner-bracket corner-bracket-tl border-cyber-purple" />
            <div className="corner-bracket corner-bracket-tr border-cyber-purple" />
            <div className="corner-bracket corner-bracket-bl border-cyber-purple" />
            <div className="corner-bracket corner-bracket-br border-cyber-purple" />

            {/* Header info */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse" />
                <span className="font-orbitron text-[0.55rem] text-cyber-purple/70 uppercase tracking-[0.2em]">
                  TRANSCEIVER CLI // CHANNEL_5
                </span>
              </div>
              <span className="font-outfit text-[0.5rem] text-cyber-purple/40 uppercase tracking-wider">
                Console Connection Open
              </span>
            </div>

            <div className="glow-line mb-4 bg-gradient-to-r from-cyber-purple/40 via-cyber-purple/10 to-transparent" />

            {transmissionState === 'idle' ? (
              <form onSubmit={handleTransmit} className="space-y-4">
                {/* Sender ID (Name) */}
                <div className="space-y-1">
                  <label className="block font-orbitron text-[0.55rem] text-cyber-purple tracking-widest uppercase">
                    SENDER_ID &gt;
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="ENTER YOUR NAME..."
                    className="w-full bg-cyber-black/40 border border-cyber-purple/15 text-cyber-white p-2 font-outfit text-xs focus:outline-none focus:border-cyber-purple/60 placeholder-cyber-purple/30 rounded-sm uppercase tracking-wide transition-all"
                  />
                </div>

                {/* Secure Relay (Email) */}
                <div className="space-y-1">
                  <label className="block font-orbitron text-[0.55rem] text-cyber-purple tracking-widest uppercase">
                    SECURE_RELAY &gt;
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="ENTER YOUR EMAIL..."
                    className="w-full bg-cyber-black/40 border border-cyber-purple/15 text-cyber-white p-2 font-outfit text-xs focus:outline-none focus:border-cyber-purple/60 placeholder-cyber-purple/30 rounded-sm transition-all"
                  />
                </div>

                {/* Payload (Message) */}
                <div className="space-y-1">
                  <label className="block font-orbitron text-[0.55rem] text-cyber-purple tracking-widest uppercase">
                    PAYLOAD_BUFFER &gt;
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="ENTER SENSORY TRANSMISSION PAYLOAD..."
                    className="w-full bg-cyber-black/40 border border-cyber-purple/15 text-cyber-white p-2 font-outfit text-xs focus:outline-none focus:border-cyber-purple/60 placeholder-cyber-purple/30 rounded-sm resize-none uppercase tracking-wide transition-all"
                  />
                </div>

                {/* Send button */}
                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-cyber-purple/10 border border-cyber-purple/35 text-cyber-purple hover:bg-cyber-purple/20 hover:border-cyber-purple/70 transition-all font-orbitron text-[0.65rem] tracking-[0.25em] uppercase text-glow-purple cursor-pointer rounded-sm"
                >
                  TRANSMIT PAYLOAD
                </button>
              </form>
            ) : (
              // Transmission Terminal CLI log display
              <div className="space-y-4">
                <div className="bg-cyber-black/80 border border-cyber-purple/10 p-3 h-48 overflow-y-auto font-mono text-[0.55rem] text-cyber-purple/80 space-y-1.5 rounded-sm select-text">
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>

                {/* Live indicators */}
                <div className="flex items-center justify-between font-orbitron text-[0.5rem] tracking-wider text-cyber-purple/40">
                  <div className="flex items-center gap-2">
                    <span className="animate-pulse">●</span>
                    <span>
                      {transmissionState === 'handshake' && 'ESTABLISHING HANDSHAKE...'}
                      {transmissionState === 'encrypting' && 'ENCRYPTING MESSAGE...'}
                      {transmissionState === 'transmitting' && 'SENDING BURST PACKETS...'}
                      {transmissionState === 'success' && 'TRANSMISSION COMPLETE'}
                    </span>
                  </div>
                  <span>
                    {(transmissionState === 'handshake' && '25%') ||
                      (transmissionState === 'encrypting' && '55%') ||
                      (transmissionState === 'transmitting' && '85%') ||
                      (transmissionState === 'success' && '100%')}
                  </span>
                </div>

                {/* Animated visual progress bar */}
                <div className="w-full bg-cyber-purple/5 border border-cyber-purple/10 h-1.5 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-cyber-purple"
                    initial={{ width: '0%' }}
                    animate={{
                      width:
                        transmissionState === 'handshake'
                          ? '25%'
                          : transmissionState === 'encrypting'
                          ? '55%'
                          : transmissionState === 'transmitting'
                          ? '85%'
                          : '100%',
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {transmissionState === 'success' && (
                  <button
                    onClick={handleReset}
                    className="w-full py-2 bg-cyber-cyan/10 border border-cyber-cyan/35 text-cyber-cyan hover:bg-cyber-cyan/20 hover:border-cyber-cyan/70 transition-all font-orbitron text-[0.6rem] tracking-[0.2em] uppercase text-glow-cyan cursor-pointer rounded-sm"
                  >
                    RESET TRANSCEIVER TERMINAL
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
