import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Walkway() {
  const leftRailRef = useRef()
  const rightRailRef = useRef()

  // Load PBR textures
  const textures = useTexture({
    map: '/assets/MetalWalkway010_1K-JPG/MetalWalkway010_1K-JPG_Color.jpg',
    roughnessMap: '/assets/MetalWalkway010_1K-JPG/MetalWalkway010_1K-JPG_Roughness.jpg',
    metalnessMap: '/assets/MetalWalkway010_1K-JPG/MetalWalkway010_1K-JPG_Metalness.jpg',
    normalMap: '/assets/MetalWalkway010_1K-JPG/MetalWalkway010_1K-JPG_NormalGL.jpg',
    alphaMap: '/assets/MetalWalkway010_1K-JPG/MetalWalkway010_1K-JPG_Opacity.jpg',
  })

  // Configure texture wrap and repeating
  useEffect(() => {
    Object.values(textures).forEach((texture) => {
      if (texture) {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(1.5, 40) // 1.5 repeats across, 40 along the length
      }
    })
  }, [textures])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    // Animate the guardrails with a breathing cyber glow
    if (leftRailRef.current) {
      leftRailRef.current.material.emissiveIntensity = 2.0 + Math.sin(t * 2.0) * 0.5
    }
    if (rightRailRef.current) {
      rightRailRef.current.material.emissiveIntensity = 2.0 + Math.cos(t * 2.0) * 0.5
    }
  })

  // Generate support pillars along the 100-unit long path
  const supportPositions = []
  for (let z = 15; z >= -85; z -= 10) {
    supportPositions.push(z)
  }

  return (
    <group>
      {/* Walkway floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, -35]} receiveShadow>
        <planeGeometry args={[3.2, 100, 1, 100]} />
        <meshStandardMaterial
          {...textures}
          transparent={true}
          roughness={0.6}
          metalness={0.9}
          normalScale={new THREE.Vector2(0.6, 0.6)}
        />
      </mesh>

      {/* Left neon rail */}
      <mesh
        ref={leftRailRef}
        position={[-1.6, -1.9, -35]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.015, 0.015, 100, 8]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Right neon rail */}
      <mesh
        ref={rightRailRef}
        position={[1.6, -1.9, -35]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.015, 0.015, 100, 8]} />
        <meshStandardMaterial
          color="#bc34fa"
          emissive="#bc34fa"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Support pillars */}
      {supportPositions.map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          {/* Left support */}
          <mesh position={[-1.6, -2.15, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#0e0e16" roughness={0.9} metalness={0.1} />
          </mesh>
          
          {/* Right support */}
          <mesh position={[1.6, -2.15, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#0e0e16" roughness={0.9} metalness={0.1} />
          </mesh>
          
          {/* Floor cross support beam */}
          <mesh position={[0, -2.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 3.2, 8]} />
            <meshStandardMaterial color="#0e0e16" roughness={0.9} metalness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
