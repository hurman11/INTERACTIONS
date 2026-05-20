import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import NetworkWorld from '@/components/3d/NetworkWorld'

function NetworkTitle() {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) ref.current.position.y = 6 + Math.sin(t * 0.25) * 0.1
  })

  return (
    <group ref={ref} position={[0, 6, 0]}>
      <Billboard>
        <Text
          fontSize={0.22}
          color="#00E5FF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
        >
          THE NETWORK
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
          GLOBAL REACH & CONNECTIONS
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

function StatsDisplay() {
  const stats = [
    { label: 'NODES', value: '2,847', x: -3 },
    { label: 'LATENCY', value: '12ms', x: 0 },
    { label: 'UPTIME', value: '99.97%', x: 3 },
  ]

  return (
    <group position={[0, -4, 2]}>
      {stats.map((stat, i) => (
        <group key={stat.label} position={[stat.x, 0, 0]}>
          <Billboard>
            <Text
              fontSize={0.15}
              color="#00E5FF"
              anchorX="center"
              anchorY="middle"
              font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
            >
              {stat.value}
              <meshStandardMaterial
                color="#00E5FF"
                emissive="#00E5FF"
                emissiveIntensity={1}
                transparent
                opacity={0.8}
                toneMapped={false}
              />
            </Text>
          </Billboard>
          <Billboard>
            <Text
              position={[0, -0.25, 0]}
              fontSize={0.05}
              color="#F8F9FA"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.2}
              font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
            >
              {stat.label}
              <meshStandardMaterial color="#F8F9FA" transparent opacity={0.3} />
            </Text>
          </Billboard>
        </group>
      ))}
    </group>
  )
}

export default function Network({ visible = true }) {
  if (!visible) return null

  return (
    <group position={[0, 0, -60]}>
      <NetworkTitle />
      <NetworkWorld position={[0, 1, 0]} />
      <StatsDisplay />

      <pointLight position={[0, 6, 3]} color="#00E5FF" intensity={0.5} distance={15} decay={2} />
      <pointLight position={[-5, -1, 2]} color="#D946EF" intensity={0.3} distance={12} decay={2} />
      <pointLight position={[5, 3, -2]} color="#FF3B00" intensity={0.2} distance={10} decay={2} />
    </group>
  )
}
