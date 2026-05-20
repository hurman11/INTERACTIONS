import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function AnimatedChromaticAberration() {
  const effectRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (effectRef.current) {
      const pulse = Math.sin(t * 0.5) * 0.0003 + 0.0005
      effectRef.current.offset = new Vector2(pulse, pulse * 0.8)
    }
  })

  return (
    <ChromaticAberration
      ref={effectRef}
      blendFunction={BlendFunction.NORMAL}
      offset={new Vector2(0.0005, 0.0004)}
      radialModulation
      modulationOffset={0.2}
    />
  )
}

export default function PostFX({ enableBloom = true, enableAberration = true, bloomIntensity = 0.8 }) {
  return (
    <EffectComposer multisampling={0}>
      {enableBloom && (
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.7}
          mipmapBlur
          radius={0.85}
        />
      )}
      {enableAberration && <AnimatedChromaticAberration />}
      <Vignette
        offset={0.25}
        darkness={0.75}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.3}
      />
    </EffectComposer>
  )
}
