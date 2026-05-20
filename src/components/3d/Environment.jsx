import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment as DreiEnv } from '@react-three/drei'
import * as THREE from 'three'

function PulsatingLight({ position, color, intensity = 1, speed = 1, range = 0.3 }) {
  const lightRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (lightRef.current) {
      lightRef.current.intensity = intensity + Math.sin(t * speed) * range
    }
  })

  return <pointLight ref={lightRef} position={position} color={color} intensity={intensity} distance={25} decay={2} />
}

function OrbitalLight({ color, radius = 8, speed = 0.2, intensity = 0.4, yOffset = 0 }) {
  const lightRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(t * speed) * radius
      lightRef.current.position.z = Math.sin(t * speed) * radius
      lightRef.current.position.y = yOffset + Math.sin(t * speed * 0.5) * 2
    }
  })

  return <pointLight ref={lightRef} color={color} intensity={intensity} distance={30} decay={2} />
}

function NeuralGridFloor() {
  const meshRef = useRef()
  const materialRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (materialRef.current) {
      materialRef.current.opacity = 0.04 + Math.sin(t * 0.3) * 0.015
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
      <planeGeometry args={[100, 100, 80, 80]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#00E5FF"
        wireframe
        transparent
        opacity={0.04}
        emissive="#00E5FF"
        emissiveIntensity={0.15}
      />
    </mesh>
  )
}

function AmbientOrbs() {
  const groupRef = useRef()
  const orbs = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      radius: 12 + Math.random() * 8,
      speed: 0.05 + Math.random() * 0.08,
      y: (Math.random() - 0.5) * 10,
      scale: 0.08 + Math.random() * 0.12,
      color: i % 2 === 0 ? '#00E5FF' : '#D946EF'
    }))
  )

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const orb = orbs.current[i]
        child.position.x = Math.cos(t * orb.speed + orb.angle) * orb.radius
        child.position.z = Math.sin(t * orb.speed + orb.angle) * orb.radius
        child.position.y = orb.y + Math.sin(t * 0.3 + i) * 1.5
      })
    }
  })

  return (
    <group ref={groupRef}>
      {orbs.current.map((orb, i) => (
        <mesh key={i} scale={orb.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={2}
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function Environment({ enableHDRI = true }) {
  return (
    <group>
      <ambientLight intensity={0.08} color="#4a0080" />

      <PulsatingLight position={[0, 8, 0]} color="#00E5FF" intensity={0.6} speed={0.5} range={0.2} />
      <PulsatingLight position={[0, -4, 0]} color="#D946EF" intensity={0.3} speed={0.7} range={0.15} />

      <OrbitalLight color="#00E5FF" radius={15} speed={0.15} intensity={0.35} yOffset={3} />
      <OrbitalLight color="#D946EF" radius={12} speed={-0.1} intensity={0.25} yOffset={-2} />
      <OrbitalLight color="#FF3B00" radius={20} speed={0.08} intensity={0.15} yOffset={5} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={0.15}
        color="#1e3a5f"
      />

      <NeuralGridFloor />
      <AmbientOrbs />

      {enableHDRI && (
        <DreiEnv
          files="/assets/studio_small_01_1k.exr"
          background={false}
          environmentIntensity={0.3}
        />
      )}
    </group>
  )
}
