import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard, Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function CentralTerminal() {
  const { scene } = useGLTF('/assets/futuristic_free-standing_terminal.glb')
  const modelRef = useRef()
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.material.emissive = new THREE.Color('#00E5FF')
        child.material.emissiveIntensity = 0.15
      }
    })
    return clone
  }, [scene])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (modelRef.current) {
      modelRef.current.position.y = -0.5 + Math.sin(t * 0.3) * 0.08
    }
  })

  return (
    <Float speed={0.6} rotationIntensity={0.01} floatIntensity={0.1}>
      <group ref={modelRef} position={[0, -0.5, 0]} scale={1.2}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  )
}

function TerminalTitle() {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) ref.current.position.y = 5 + Math.sin(t * 0.25) * 0.1
  })

  return (
    <group ref={ref} position={[0, 5, 0]}>
      <Billboard>
        <Text
          fontSize={0.22}
          color="#00E5FF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
        >
          THE TERMINAL
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} transparent opacity={0.7} toneMapped={false} />
        </Text>
      </Billboard>
      <Billboard>
        <Text
          position={[0, -0.35, 0]}
          fontSize={0.07}
          color="#F8F9FA"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
        >
          INITIATE CONTACT
          <meshStandardMaterial color="#F8F9FA" transparent opacity={0.25} />
        </Text>
      </Billboard>
      <mesh position={[0, -0.55, 0]} scale={[3, 0.002, 1]}>
        <planeGeometry />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={2} transparent opacity={0.12} toneMapped={false} />
      </mesh>
    </group>
  )
}

function HolographicScreen() {
  const meshRef = useRef()
  const frameRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.04 + Math.sin(t * 0.5) * 0.015
    }
    if (frameRef.current) {
      frameRef.current.material.opacity = 0.15 + Math.sin(t * 0.8) * 0.05
    }
  })

  return (
    <group position={[0, 2.2, -0.5]}>
      <mesh ref={meshRef} scale={[3.5, 2, 1]}>
        <planeGeometry />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.1}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={frameRef} scale={[3.6, 2.1, 1]}>
        <planeGeometry />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={1}
          transparent
          opacity={0.15}
          wireframe
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      <Billboard>
        <Text
          position={[0, 0.6, 0.1]}
          fontSize={0.12}
          color="#00E5FF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.25}
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
        >
          READY TO CONNECT?
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1} transparent opacity={0.7} toneMapped={false} />
        </Text>
      </Billboard>

      <Billboard>
        <Text
          position={[0, 0.2, 0.1]}
          fontSize={0.055}
          color="#F8F9FA"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          lineHeight={1.5}
          font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
        >
          We build digital experiences that push boundaries. If you've got a vision, we've got the firepower.
          <meshStandardMaterial color="#F8F9FA" transparent opacity={0.35} />
        </Text>
      </Billboard>

      <Billboard>
        <Text
          position={[0, -0.4, 0.1]}
          fontSize={0.04}
          color="#D946EF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
          font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
        >
          ▼  USE THE PANEL BELOW TO REACH US  ▼
          <meshStandardMaterial color="#D946EF" emissive="#D946EF" emissiveIntensity={0.5} transparent opacity={0.4} toneMapped={false} />
        </Text>
      </Billboard>
    </group>
  )
}

function TerminalParticles() {
  const pointsRef = useRef()
  const count = 120

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.015
      const posAttr = pointsRef.current.geometry.attributes.position
      for (let i = 0; i < count; i++) {
        posAttr.array[i * 3 + 1] += Math.sin(t * 0.3 + i * 0.5) * 0.0008
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#D946EF" transparent opacity={0.3} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function FloorGrid() {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.material.opacity = 0.025 + Math.sin(t * 0.3) * 0.01
    }
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshStandardMaterial color="#D946EF" emissive="#D946EF" emissiveIntensity={0.3} wireframe transparent opacity={0.025} toneMapped={false} />
    </mesh>
  )
}

export default function Terminal({ visible = true }) {
  if (!visible) return null

  return (
    <group position={[0, 0, -75]}>
      <TerminalTitle />
      <CentralTerminal />
      <HolographicScreen />
      <TerminalParticles />
      <FloorGrid />

      <pointLight position={[0, 4, 3]} color="#00E5FF" intensity={0.6} distance={12} decay={2} />
      <pointLight position={[-3, 1, 2]} color="#D946EF" intensity={0.5} distance={10} decay={2} />
      <pointLight position={[3, 2, -1]} color="#1e3a5f" intensity={0.3} distance={10} decay={2} />
      <pointLight position={[0, -1, 2]} color="#00E5FF" intensity={0.2} distance={6} decay={2} />
    </group>
  )
}
