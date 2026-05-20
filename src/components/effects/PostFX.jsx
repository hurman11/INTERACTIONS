import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function AnimatedChromaticAberration({ scrollRef }) {
  const effectRef = useRef()
  const lastProgress = useRef(0)
  const smoothVelocity = useRef(0)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (effectRef.current) {
      const progress = scrollRef && scrollRef.current !== undefined ? scrollRef.current : 0
      const velocity = Math.abs(progress - lastProgress.current)
      lastProgress.current = progress

      // Simple inline lerp
      smoothVelocity.current += (velocity - smoothVelocity.current) * 0.1

      const pulse = Math.sin(t * 0.5) * 0.0003 + 0.0005
      
      // Dynamic anamorphic splitting: stretch the x aberration much more than y for lens feel
      const warpX = smoothVelocity.current * 0.3
      const warpY = smoothVelocity.current * 0.08

      effectRef.current.offset.set(pulse + warpX, (pulse * 0.8) + warpY)
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

export default function PostFX({ scrollRef, enableBloom = true, enableAberration = true, bloomIntensity = 0.8 }) {
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
      {enableAberration && <AnimatedChromaticAberration scrollRef={scrollRef} />}
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
