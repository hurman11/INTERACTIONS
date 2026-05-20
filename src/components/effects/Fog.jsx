import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Fog({ color = '#030305', near = 8, far = 45 }) {
  const { scene } = useThree()
  const fogRef = useRef()

  useEffect(() => {
    const fog = new THREE.FogExp2(color, 0.025)
    scene.fog = fog
    fogRef.current = fog

    return () => {
      scene.fog = null
    }
  }, [scene, color])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (fogRef.current) {
      fogRef.current.density = 0.022 + Math.sin(t * 0.15) * 0.003
    }
  })

  return null
}
