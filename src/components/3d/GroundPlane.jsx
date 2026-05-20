import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function GroundPlane({ scrollProgress = 0 }) {
  const meshRef = useRef()

  const textures = useTexture({
    map: '/assets/MetalWalkway010_1K-JPG/MetalWalkway010_1K-JPG_Color.jpg',
    normalMap: '/assets/MetalWalkway010_1K-JPG/MetalWalkway010_1K-JPG_NormalGL.jpg',
    roughnessMap: '/assets/MetalWalkway010_1K-JPG/MetalWalkway010_1K-JPG_Roughness.jpg',
    metalnessMap: '/assets/MetalWalkway010_1K-JPG/MetalWalkway010_1K-JPG_Metalness.jpg',
  })

  useMemo(() => {
    Object.values(textures).forEach(tex => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(40, 40)
    })
  }, [textures])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.15 + Math.sin(t * 0.2) * 0.03
    }
  })

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3.5, -40]}
    >
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial
        {...textures}
        transparent
        opacity={0.15}
        metalness={0.8}
        roughness={0.4}
        color="#0a0a0a"
        emissive="#00E5FF"
        emissiveIntensity={0.02}
        envMapIntensity={0.3}
      />
    </mesh>
  )
}
