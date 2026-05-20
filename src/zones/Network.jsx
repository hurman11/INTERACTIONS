import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import NetworkWorld from '@/components/3d/NetworkWorld'

function NetworkTitle() {
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = 5.0 + Math.sin(t * 0.22) * 0.08
    }
  })

  return (
    <group ref={groupRef} position={[0, 5.0, 0]}>
      <Billboard>
        <Text
          fontSize={0.22}
          color="#00f0ff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
        >
          GLOBAL CONSTELLATION
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
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
          DECENTRALIZED NODE INFRASTRUCTURE
          <meshStandardMaterial color="#f3f4f6" transparent opacity={0.25} />
        </Text>
      </Billboard>

      <mesh position={[0, -0.55, 0]} scale={[2.8, 0.002, 1]}>
        <planeGeometry />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          transparent
          opacity={0.12}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function GridDisc() {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.z = t * 0.04
      meshRef.current.material.opacity = 0.08 + Math.sin(t * 0.5) * 0.03
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.98, 0]}>
      <ringGeometry args={[0.5, 4.5, 32]} />
      <meshBasicMaterial
        color="#00f0ff"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  )
}

export default function Network({ visible = true }) {
  if (!visible) return null

  return (
    <group position={[0, 0, -60]}>
      <NetworkTitle />
      
      {/* Circle helper disc on floor */}
      <GridDisc />

      {/* Network World globe containing GLTF and arcs */}
      <group position={[0, 1.3, 0]}>
        <NetworkWorld />
      </group>

      {/* Spotlighting for depth */}
      <pointLight position={[0, 5, 2]} color="#00f0ff" intensity={0.6} distance={15} decay={2} />
      <pointLight position={[-5, 0, -3]} color="#bc34fa" intensity={0.4} distance={12} decay={2} />
      <pointLight position={[5, 1, 3]} color="#00f0ff" intensity={0.3} distance={12} decay={2} />
    </group>
  )
}
