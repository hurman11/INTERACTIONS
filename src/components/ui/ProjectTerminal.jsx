import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import projects from '@/data/projects'

export default function ProjectTerminal({ activeProject = 0, onNavigate, currentZone = 0 }) {
  const isVisible = currentZone === 2
  const project = projects[activeProject]

  if (!isVisible || !project) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-60 flex items-end justify-center pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto"
        >
          <div className="hud-panel max-w-md w-full mx-4 relative overflow-hidden">
            <div className="corner-bracket corner-bracket-tl" />
            <div className="corner-bracket corner-bracket-tr" />
            <div className="corner-bracket corner-bracket-bl" />
            <div className="corner-bracket corner-bracket-br" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
                <span className="font-orbitron text-[0.55rem] text-cyber-cyan/60 uppercase tracking-[0.2em]">
                  Project {activeProject + 1}/{projects.length}
                </span>
              </div>
              <span className="font-outfit text-[0.5rem] text-cyber-purple/40 uppercase tracking-wider">
                Active Terminal
              </span>
            </div>

            <div className="glow-line mb-3" />

            <h3 className="font-orbitron text-sm text-cyber-cyan tracking-[0.15em] mb-1.5 text-glow-cyan">
              {project.title}
            </h3>

            <p className="font-outfit text-[0.7rem] text-cyber-white/40 leading-relaxed mb-3">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[0.55rem] font-outfit text-cyber-purple/70 border border-cyber-purple/15 bg-cyber-purple/5 rounded-sm uppercase tracking-wider"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-button text-[0.55rem]"
                >
                  Live Demo
                </a>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-button-purple cyber-button text-[0.55rem]"
                >
                  GitHub
                </a>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate?.(Math.max(0, activeProject - 1))}
                  disabled={activeProject === 0}
                  className="w-6 h-6 flex items-center justify-center border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan/50 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/40 transition-all duration-300 text-[0.6rem] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer rounded-sm"
                >
                  ◂
                </button>
                <button
                  onClick={() => onNavigate?.(Math.min(projects.length - 1, activeProject + 1))}
                  disabled={activeProject === projects.length - 1}
                  className="w-6 h-6 flex items-center justify-center border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan/50 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/40 transition-all duration-300 text-[0.6rem] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer rounded-sm"
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
