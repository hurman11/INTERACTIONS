import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleLayer({ count, spread, size, color, speed, opacity, drift }) {
  const meshRef = useRef()
  const velocities = useRef()

  const [positions, sizes, opacities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    const opa = new Float32Array(count)
    const vel = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * spread
      pos[i3 + 1] = (Math.random() - 0.5) * spread
      pos[i3 + 2] = (Math.random() - 0.5) * spread

      siz[i] = size * (0.3 + Math.random() * 0.7)
      opa[i] = opacity * (0.3 + Math.random() * 0.7)

      vel[i3] = (Math.random() - 0.5) * drift
      vel[i3 + 1] = (Math.random() - 0.5) * drift
      vel[i3 + 2] = (Math.random() - 0.5) * drift
    }

    velocities.current = vel
    return [pos, siz, opa]
  }, [count, spread, size, opacity, drift])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!meshRef.current) return

    const posAttr = meshRef.current.geometry.attributes.position
    const half = spread / 2
    const vel = velocities.current

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      posAttr.array[i3] += vel[i3] * speed + Math.sin(t * 0.2 + i * 0.1) * 0.001
      posAttr.array[i3 + 1] += vel[i3 + 1] * speed + Math.cos(t * 0.15 + i * 0.05) * 0.001
      posAttr.array[i3 + 2] += vel[i3 + 2] * speed

      if (Math.abs(posAttr.array[i3]) > half) posAttr.array[i3] *= -0.95
      if (Math.abs(posAttr.array[i3 + 1]) > half) posAttr.array[i3 + 1] *= -0.95
      if (Math.abs(posAttr.array[i3 + 2]) > half) posAttr.array[i3 + 2] *= -0.95
    }

    posAttr.needsUpdate = true
    meshRef.current.rotation.y = t * 0.008
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function NeuralConnections({ count = 40, spread = 25 }) {
  const linesRef = useRef()

  const lineData = useMemo(() => {
    const vertices = []
    const colors = []

    for (let i = 0; i < count; i++) {
      const x1 = (Math.random() - 0.5) * spread
      const y1 = (Math.random() - 0.5) * spread
      const z1 = (Math.random() - 0.5) * spread

      const angle = Math.random() * Math.PI * 2
      const len = 1 + Math.random() * 3
      const x2 = x1 + Math.cos(angle) * len
      const y2 = y1 + (Math.random() - 0.5) * len
      const z2 = z1 + Math.sin(angle) * len

      vertices.push(x1, y1, z1, x2, y2, z2)

      const isCyan = Math.random() > 0.5
      const r = isCyan ? 0 : 0.737
      const g = isCyan ? 0.941 : 0.204
      const b = isCyan ? 1 : 0.98
      colors.push(r, g, b, r, g, b)
    }

    return {
      positions: new Float32Array(vertices),
      colors: new Float32Array(colors)
    }
  }, [count, spread])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.005
      linesRef.current.rotation.x = Math.sin(t * 0.03) * 0.02
    }
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={lineData.positions.length / 3} array={lineData.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={lineData.colors.length / 3} array={lineData.colors} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

export default function Particles({ count = 500, enableNeural = true }) {
  return (
    <group>
      <ParticleLayer
        count={Math.floor(count * 0.6)}
        spread={35}
        size={0.04}
        color="#00E5FF"
        speed={0.3}
        opacity={0.5}
        drift={0.008}
      />

      <ParticleLayer
        count={Math.floor(count * 0.3)}
        spread={40}
        size={0.06}
        color="#D946EF"
        speed={0.2}
        opacity={0.35}
        drift={0.005}
      />

      <ParticleLayer
        count={Math.floor(count * 0.1)}
        spread={30}
        size={0.1}
        color="#00E5FF"
        speed={0.15}
        opacity={0.2}
        drift={0.003}
      />

      {enableNeural && <NeuralConnections count={50} spread={30} />}
    </group>
  )
}
