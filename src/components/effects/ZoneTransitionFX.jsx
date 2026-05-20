import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ZoneTransitionFX({ scrollProgress = 0, zoneCount = 6 }) {
  const lightRef = useRef()
  const flashRef = useRef(0)
  const prevZone = useRef(0)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const rawZone = scrollProgress * zoneCount
    const currentZone = Math.min(Math.floor(rawZone), zoneCount - 1)

    if (currentZone !== prevZone.current) {
      flashRef.current = 1.0
      prevZone.current = currentZone
    }

    flashRef.current *= 0.92

    if (lightRef.current) {
      lightRef.current.intensity = flashRef.current * 3
      const colors = ['#00E5FF', '#D946EF', '#FF3B00', '#00E5FF', '#D946EF', '#1e3a5f']
      lightRef.current.color.set(colors[currentZone] || '#00E5FF')
    }
  })

  return (
    <pointLight
      ref={lightRef}
      position={[0, 5, 0]}
      intensity={0}
      distance={30}
      decay={2}
    />
  )
}
