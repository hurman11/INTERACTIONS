import { Glitch as GlitchEffect } from '@react-three/postprocessing'
import { GlitchMode } from 'postprocessing'

export default function Glitch({ active = false }) {
  if (!active) return null

  return (
    <GlitchEffect
      delay={[1.5, 3.5]}
      duration={[0.1, 0.3]}
      strength={[0.05, 0.15]}
      mode={GlitchMode.SPORADIC}
    />
  )
}
