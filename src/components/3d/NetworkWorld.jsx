import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function ConnectionNodes({ count = 40, radius = 4 }) {
  const groupRef = useRef()

  const nodes = useMemo(() => {
    const data = []
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      data.push({
        position: [
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ],
        scale: 0.03 + Math.random() * 0.04,
        color: Math.random() > 0.5 ? '#00E5FF' : '#D946EF'
      })
    }
    return data
  }, [count, radius])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.03
      groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position} scale={node.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
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

function DataArcs({ count = 15, radius = 4 }) {
  const groupRef = useRef()

  const arcs = useMemo(() => {
    const data = []
    for (let i = 0; i < count; i++) {
      const startPhi = Math.random() * Math.PI
      const startTheta = Math.random() * Math.PI * 2
      const endPhi = Math.random() * Math.PI
      const endTheta = Math.random() * Math.PI * 2

      const points = []
      for (let t = 0; t <= 1; t += 0.05) {
        const phi = startPhi + (endPhi - startPhi) * t
        const theta = startTheta + (endTheta - startTheta) * t
        const r = radius + Math.sin(t * Math.PI) * 0.8
        points.push(new THREE.Vector3(
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi)
        ))
      }

      data.push({
        points,
        color: i % 3 === 0 ? '#FF3B00' : i % 2 === 0 ? '#00E5FF' : '#D946EF'
      })
    }
    return data
  }, [count, radius])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      {arcs.map((arc, i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(arc.points)
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial
              color={arc.color}
              transparent
              opacity={0.15}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </line>
        )
      })}
    </group>
  )
}

function OrbitShells() {
  const ringsRef = useRef([])

  const configs = useMemo(() => [
    { radius: 4.5, tube: 0.004, speed: 0.08, tiltX: Math.PI / 3, color: '#00E5FF', opacity: 0.08 },
    { radius: 5, tube: 0.003, speed: -0.05, tiltX: Math.PI / 2.5, color: '#D946EF', opacity: 0.06 },
    { radius: 5.5, tube: 0.003, speed: 0.03, tiltX: Math.PI / 1.8, color: '#1e3a5f', opacity: 0.04 },
  ], [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return
      ring.rotation.z = t * configs[i].speed
      ring.rotation.y = Math.sin(t * 0.08 + i) * 0.2
    })
  })

  return (
    <group>
      {configs.map((cfg, i) => (
        <mesh key={i} ref={el => ringsRef.current[i] = el} rotation={[cfg.tiltX, 0, 0]}>
          <torusGeometry args={[cfg.radius, cfg.tube, 16, 100]} />
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

export default function NetworkWorld({ position = [0, 0, 0] }) {
  const { scene } = useGLTF('/assets/earth_hologram.glb')
  const modelRef = useRef()
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.material.transparent = true
        child.material.opacity = 0.85
        child.material.emissive = new THREE.Color('#00E5FF')
        child.material.emissiveIntensity = 0.2
      }
    })
    return clone
  }, [scene])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (modelRef.current) {
      modelRef.current.rotation.y = t * 0.05
    }
  })

  return (
    <group position={position}>
      <group ref={modelRef} scale={2.5}>
        <primitive object={clonedScene} />
      </group>

      <ConnectionNodes count={50} radius={4} />
      <DataArcs count={20} radius={4} />
      <OrbitShells />

      <pointLight position={[0, 0, 0]} color="#00E5FF" intensity={1} distance={8} decay={2} />
    </group>
  )
}

useGLTF.preload('/assets/earth_hologram.glb')
