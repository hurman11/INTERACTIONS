import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const GEOMETRY_TYPES = ['octahedron', 'tetrahedron', 'icosahedron', 'box', 'torus']

function FloatingShape({ position, geometryType, scale, rotSpeed, floatSpeed, floatAmp, color, opacity }) {
  const meshRef = useRef()
  const initialY = position[1]

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!meshRef.current) return

    meshRef.current.rotation.x += rotSpeed.x
    meshRef.current.rotation.y += rotSpeed.y
    meshRef.current.rotation.z += rotSpeed.z
    meshRef.current.position.y = initialY + Math.sin(t * floatSpeed) * floatAmp
    meshRef.current.position.x = position[0] + Math.sin(t * floatSpeed * 0.5 + position[2]) * floatAmp * 0.3
  })

  const geometry = useMemo(() => {
    switch (geometryType) {
      case 'octahedron': return <octahedronGeometry args={[1, 0]} />
      case 'tetrahedron': return <tetrahedronGeometry args={[1, 0]} />
      case 'icosahedron': return <icosahedronGeometry args={[1, 0]} />
      case 'box': return <boxGeometry args={[1, 1, 1]} />
      case 'torus': return <torusGeometry args={[1, 0.3, 8, 16]} />
      default: return <octahedronGeometry args={[1, 0]} />
    }
  }, [geometryType])

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </mesh>
  )
}

function HolographicRing({ radius, y, speed, color, opacity }) {
  const ringRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ringRef.current) {
      ringRef.current.rotation.z = t * speed
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.1
      const pulse = 0.95 + Math.sin(t * 1.5) * 0.05
      ringRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <mesh ref={ringRef} position={[0, y, 0]}>
      <torusGeometry args={[radius, 0.015, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={opacity}
        toneMapped={false}
      />
    </mesh>
  )
}

export default function FloatingGeometry({ count = 25 }) {
  const shapes = useMemo(() => {
    const colors = ['#00f0ff', '#bc34fa', '#8b5cf6', '#00f0ff', '#bc34fa']
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 35
      ],
      geometryType: GEOMETRY_TYPES[Math.floor(Math.random() * GEOMETRY_TYPES.length)],
      scale: 0.08 + Math.random() * 0.22,
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.006
      },
      floatSpeed: 0.3 + Math.random() * 0.5,
      floatAmp: 0.5 + Math.random() * 1.5,
      color: colors[i % colors.length],
      opacity: 0.15 + Math.random() * 0.25
    }))
  }, [count])

  return (
    <group>
      {shapes.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}

      <HolographicRing radius={8} y={0} speed={0.08} color="#00f0ff" opacity={0.08} />
      <HolographicRing radius={12} y={-1} speed={-0.05} color="#bc34fa" opacity={0.05} />
      <HolographicRing radius={16} y={2} speed={0.03} color="#8b5cf6" opacity={0.03} />
    </group>
  )
}
