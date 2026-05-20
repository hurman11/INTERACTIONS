import { EffectComposer, Bloom as BloomEffect } from '@react-three/postprocessing'

export default function Bloom({ children }) {
  return (
    <EffectComposer>
      <BloomEffect
        intensity={0.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      {children}
    </EffectComposer>
  )
}
