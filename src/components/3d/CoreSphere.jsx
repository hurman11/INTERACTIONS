import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function InnerSphere() {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15
      meshRef.current.rotation.y = t * 0.2
      const scale = 1 + Math.sin(t * 0.8) * 0.03
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color="#00f0ff"
        emissive="#00f0ff"
        emissiveIntensity={0.8}
        wireframe
        transparent
        opacity={0.35}
        toneMapped={false}
      />
    </mesh>
  )
}

function OuterSphere() {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = -t * 0.08
      meshRef.current.rotation.z = t * 0.12
      const scale = 1 + Math.sin(t * 0.5) * 0.02
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 2]} />
      <meshStandardMaterial
        color="#bc34fa"
        emissive="#bc34fa"
        emissiveIntensity={0.4}
        wireframe
        transparent
        opacity={0.1}
        toneMapped={false}
      />
    </mesh>
  )
}

function EnergyCore() {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      const pulse = 0.3 + Math.sin(t * 1.5) * 0.15
      meshRef.current.scale.setScalar(pulse)
      meshRef.current.material.emissiveIntensity = 2 + Math.sin(t * 2) * 1
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#00f0ff"
        emissive="#00f0ff"
        emissiveIntensity={2}
        transparent
        opacity={0.6}
        toneMapped={false}
      />
    </mesh>
  )
}

function OrbitalRings() {
  const ringsRef = useRef([])

  const configs = useMemo(() => [
    { radius: 2.2, tube: 0.01, rotX: Math.PI / 2, speed: 0.3, color: '#00f0ff' },
    { radius: 2.5, tube: 0.008, rotX: Math.PI / 2.5, speed: -0.2, color: '#bc34fa' },
    { radius: 2.8, tube: 0.006, rotX: Math.PI / 1.8, speed: 0.15, color: '#8b5cf6' },
  ], [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return
      ring.rotation.z = t * configs[i].speed
      ring.rotation.y = Math.sin(t * 0.15 + i * 1.5) * 0.2
    })
  })

  return (
    <group>
      {configs.map((cfg, i) => (
        <mesh key={i} ref={el => ringsRef.current[i] = el} rotation={[cfg.rotX, 0, 0]}>
          <torusGeometry args={[cfg.radius, cfg.tube, 16, 100]} />
          <meshStandardMaterial
            color={cfg.color}
            emissive={cfg.color}
            emissiveIntensity={2}
            transparent
            opacity={0.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function DataStreams() {
  const groupRef = useRef()
  const count = 30

  const lines = useMemo(() => {
    const data = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 2.3 + Math.random() * 0.5
      const length = 0.5 + Math.random() * 1.5
      data.push({ angle, radius, length, speed: 0.5 + Math.random() * 1 })
    }
    return data
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => {
        const x = Math.cos(line.angle) * line.radius
        const z = Math.sin(line.angle) * line.radius
        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, -line.angle, Math.PI / 2]} scale={[0.005, line.length, 0.005]}>
            <boxGeometry />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={1.5}
              transparent
              opacity={0.15}
              toneMapped={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function CoreSphere({ position = [0, 1, 0] }) {
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.3) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <EnergyCore />
      <InnerSphere />
      <OuterSphere />
      <OrbitalRings />
      <DataStreams />

      <pointLight position={[0, 0, 0]} color="#00f0ff" intensity={1.5} distance={8} decay={2} />
    </group>
  )
}
