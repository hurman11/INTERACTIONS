import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import CoreSphere from '@/components/3d/CoreSphere'
import HologramNodes from '@/components/3d/HologramNodes'
import { Text, Billboard } from '@react-three/drei'

function CoreTitle() {
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = 4.5 + Math.sin(t * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, 4.5, 0]}>
      <Billboard>
        <Text
          fontSize={0.22}
          color="#00f0ff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
        >
          THE INTERACTION CORE
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
          fontSize={0.08}
          color="#f3f4f6"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
        >
          IDENTITY & SERVICES
          <meshStandardMaterial color="#f3f4f6" transparent opacity={0.25} />
        </Text>
      </Billboard>

      <mesh position={[0, -0.55, 0]} scale={[3, 0.002, 1]}>
        <planeGeometry />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          transparent
          opacity={0.15}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export default function Core({ visible = true }) {
  if (!visible) return null

  return (
    <group position={[0, 0, -15]}>
      <CoreTitle />
      <CoreSphere position={[0, 1, 0]} />
      <HologramNodes position={[0, 1, 0]} radius={3.8} />

      <pointLight position={[0, 6, 2]} color="#00f0ff" intensity={0.6} distance={15} decay={2} />
      <pointLight position={[-4, -1, 3]} color="#bc34fa" intensity={0.4} distance={12} decay={2} />
      <pointLight position={[4, 2, -2]} color="#8b5cf6" intensity={0.3} distance={10} decay={2} />
    </group>
  )
}
