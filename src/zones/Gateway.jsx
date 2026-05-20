import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'

function GatewayLogo() {
  const groupRef = useRef()
  const glowRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.03
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.06 + Math.sin(t * 0.8) * 0.03
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      <Text
        fontSize={1.6}
        letterSpacing={0.12}
        color="#00E5FF"
        anchorX="center"
        anchorY="middle"
        maxWidth={20}
        font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
      >
        INTERACTIONS
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={1.2}
          transparent
          opacity={0.95}
          toneMapped={false}
        />
      </Text>

      <Text
        position={[0, -1.3, 0]}
        fontSize={0.13}
        letterSpacing={0.25}
        color="#F8F9FA"
        anchorX="center"
        anchorY="middle"
        maxWidth={12}
        font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
      >
        WE DON'T BUILD WEBSITES. WE BUILD DIGITAL EXPERIENCES.
        <meshStandardMaterial
          color="#F8F9FA"
          transparent
          opacity={0.35}
        />
      </Text>

      <mesh ref={glowRef} position={[0, 0, -1]} scale={[12, 4, 1]}>
        <planeGeometry />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function GatewayRings() {
  const ringsRef = useRef([])

  const ringConfigs = useMemo(() => [
    { radius: 4, tube: 0.008, speed: 0.12, color: '#00E5FF', opacity: 0.15, tiltX: Math.PI / 2 },
    { radius: 5.5, tube: 0.006, speed: -0.08, color: '#D946EF', opacity: 0.1, tiltX: Math.PI / 2.2 },
    { radius: 7, tube: 0.005, speed: 0.05, color: '#1e3a5f', opacity: 0.06, tiltX: Math.PI / 1.9 },
  ], [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return
      const cfg = ringConfigs[i]
      ring.rotation.z = t * cfg.speed
      ring.rotation.y = Math.sin(t * 0.1 + i) * 0.15
      const pulse = 0.97 + Math.sin(t * 1.2 + i * 2) * 0.03
      ring.scale.set(pulse, pulse, pulse)
    })
  })

  return (
    <group>
      {ringConfigs.map((cfg, i) => (
        <mesh
          key={i}
          ref={el => ringsRef.current[i] = el}
          rotation={[cfg.tiltX, 0, 0]}
        >
          <torusGeometry args={[cfg.radius, cfg.tube, 32, 128]} />
          <meshStandardMaterial
            color={cfg.color}
            emissive={cfg.color}
            emissiveIntensity={2}
            transparent
            opacity={cfg.opacity}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function GatewayParticleField() {
  const pointsRef = useRef()
  const count = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 8
      const height = (Math.random() - 0.5) * 6
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = height
      pos[i * 3 + 2] = Math.sin(angle) * radius
    }
    return pos
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.02
      const posAttr = pointsRef.current.geometry.attributes.position
      for (let i = 0; i < count; i++) {
        posAttr.array[i * 3 + 1] += Math.sin(t * 0.5 + i * 0.3) * 0.001
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00E5FF"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function TaglineBar() {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.material.opacity = 0.12 + Math.sin(t * 0.6) * 0.04
    }
  })

  return (
    <group position={[0, -1.6, 0]}>
      <mesh ref={ref} scale={[6, 0.003, 1]}>
        <planeGeometry />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={2}
          transparent
          opacity={0.12}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function ScrollCue() {
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = -3.2 + Math.sin(t * 1.5) * 0.15
      groupRef.current.children.forEach((child) => {
        if (child.material) child.material.opacity = 0.15 + Math.sin(t * 2) * 0.1
      })
    }
  })

  return (
    <group ref={groupRef} position={[0, -3.2, 0]}>
      <mesh rotation={[0, 0, Math.PI / 4]} scale={0.1}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={2}
          transparent
          opacity={0.2}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]} scale={0.07} position={[0, -0.2, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={2}
          transparent
          opacity={0.12}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function Gateway({ visible = true }) {
  if (!visible) return null

  return (
    <group position={[0, 0, 0]}>
      <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.3}>
        <GatewayLogo />
      </Float>
      <GatewayRings />
      <GatewayParticleField />
      <TaglineBar />
      <ScrollCue />

      <pointLight position={[0, 3, 5]} color="#00E5FF" intensity={0.8} distance={15} decay={2} />
      <pointLight position={[0, -2, 3]} color="#D946EF" intensity={0.4} distance={12} decay={2} />
    </group>
  )
}
