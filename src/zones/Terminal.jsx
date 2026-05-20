import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Text, Billboard, Float } from '@react-three/drei'
import * as THREE from 'three'

function TransceiverBeam() {
  const beamRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (beamRef.current) {
      beamRef.current.rotation.y = t * 0.2
      // Pulsing volumetric opacity
      beamRef.current.material.opacity = 0.14 + Math.sin(t * 2.5) * 0.04
    }
  })

  return (
    <mesh ref={beamRef} position={[0, 8, 0]}>
      {/* Volumetric cylinder geometry: topRad, bottomRad, height, radialSegments, heightSegments, openEnded */}
      <cylinderGeometry args={[0.2, 1.4, 20, 16, 1, true]} />
      <meshBasicMaterial
        color="#bc34fa"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function TerminalTitle() {
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = 4.8 + Math.sin(t * 0.18) * 0.08
    }
  })

  return (
    <group ref={groupRef} position={[0, 4.8, 0]}>
      <Billboard>
        <Text
          fontSize={0.22}
          color="#bc34fa"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
        >
          CORE TRANSCEIVER
          <meshStandardMaterial
            color="#bc34fa"
            emissive="#bc34fa"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </Text>
      </Billboard>

      <Billboard>
        <Text
          position={[0, -0.35, 0]}
          fontSize={0.07}
          color="#f3f4f6"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
        >
          BROADCAST TRANSMISSION BUFFER
          <meshStandardMaterial color="#f3f4f6" transparent opacity={0.25} />
        </Text>
      </Billboard>

      <mesh position={[0, -0.55, 0]} scale={[2.5, 0.002, 1]}>
        <planeGeometry />
        <meshStandardMaterial
          color="#bc34fa"
          emissive="#bc34fa"
          emissiveIntensity={2}
          transparent
          opacity={0.12}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function Terminal({ visible = true }) {
  const { scene } = useGLTF('/assets/futuristic_free-standing_terminal.glb')
  
  // Clone scene so we can modify its materials safely
  const clonedScene = useMemo(() => {
    if (!scene) return null
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        // Color the physical console to glow purple to match the transmission theme
        child.material.emissive = new THREE.Color('#bc34fa')
        child.material.emissiveIntensity = 0.3
      }
    })
    return clone
  }, [scene])

  if (!visible) return null

  return (
    <group position={[0, 0, -75]}>
      <TerminalTitle />
      
      {/* Transceiver Beam shooting into space */}
      <TransceiverBeam />

      {/* Terminal Console */}
      <Float speed={1.2} rotationIntensity={0.02} floatIntensity={0.08}>
        <group position={[0, -0.5, 0]} scale={1.05}>
          {clonedScene && <primitive object={clonedScene} />}
        </group>
      </Float>

      {/* Holographic screen UI hovering directly above console */}
      <Billboard position={[0, 1.8, 0]}>
        <Text
          fontSize={0.06}
          color="#bc34fa"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
        >
          SYSTEM STATUS: READY TO TRANSMIT
          <meshStandardMaterial
            color="#bc34fa"
            emissive="#bc34fa"
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </Text>
      </Billboard>

      <Billboard position={[0, 1.6, 0]}>
        <Text
          fontSize={0.035}
          color="#f3f4f6"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
          font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
        >
          AWAITING INBOUND CONNECTIONS...
          <meshStandardMaterial color="#f3f4f6" transparent opacity={0.3} />
        </Text>
      </Billboard>

      {/* Pulsing light behind console */}
      <pointLight position={[0, 1.5, 0.5]} color="#bc34fa" intensity={1.5} distance={8} decay={2} />
      <pointLight position={[-3, 3, 2]} color="#00f0ff" intensity={0.4} distance={10} decay={2} />
      <pointLight position={[3, 1, -2]} color="#bc34fa" intensity={0.3} distance={10} decay={2} />
    </group>
  )
}

useGLTF.preload('/assets/futuristic_free-standing_terminal.glb')
