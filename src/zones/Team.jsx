import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard, Float } from '@react-three/drei'
import * as THREE from 'three'
import team from '@/data/team'

const MEMBER_COLORS = ['#00E5FF', '#D946EF', '#FF3B00']

function HolographicAvatar({ color, isActive, index }) {
  const groupRef = useRef()
  const innerRef = useRef()
  const outerRef = useRef()
  const coreRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!groupRef.current) return

    if (innerRef.current) {
      innerRef.current.rotation.x = t * 0.3 + index
      innerRef.current.rotation.y = t * 0.2
    }
    if (outerRef.current) {
      outerRef.current.rotation.z = -t * 0.15
      outerRef.current.rotation.x = t * 0.1 + index * 2
    }
    if (coreRef.current) {
      const pulse = isActive ? 0.35 + Math.sin(t * 2) * 0.1 : 0.2
      coreRef.current.scale.setScalar(pulse)
      coreRef.current.material.emissiveIntensity = isActive ? 3 + Math.sin(t * 3) * 1 : 1
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={isActive ? 0.6 : 0.25}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={outerRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          wireframe
          transparent
          opacity={isActive ? 0.2 : 0.08}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.005, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={isActive ? 0.3 : 0.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function MemberPlatform({ position, color, isActive }) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.material.opacity = isActive ? 0.08 + Math.sin(t * 0.5) * 0.03 : 0.03
    }
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[position[0], position[1] - 1.2, position[2]]}>
      <circleGeometry args={[1.2, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.03}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function TeamTitle() {
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
          THE TEAM
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
          THE MINDS BEHIND THE MACHINE
          <meshStandardMaterial color="#F8F9FA" transparent opacity={0.25} />
        </Text>
      </Billboard>
      <mesh position={[0, -0.55, 0]} scale={[2.5, 0.002, 1]}>
        <planeGeometry />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={2} transparent opacity={0.12} toneMapped={false} />
      </mesh>
    </group>
  )
}

const MEMBER_POSITIONS = [
  [-3.5, 0, 1],
  [0, 0, 0],
  [3.5, 0, 1]
]

export default function Team({ visible = true }) {
  const [activeMember, setActiveMember] = useState(1)

  if (!visible) return null

  return (
    <group position={[-1, 0, -45]}>
      <TeamTitle />

      {team.map((member, i) => (
        <group key={member.id}>
          <group
            position={MEMBER_POSITIONS[i]}
            onClick={(e) => { e.stopPropagation(); setActiveMember(i) }}
            onPointerEnter={() => { document.body.style.cursor = 'pointer' }}
            onPointerLeave={() => { document.body.style.cursor = 'default' }}
          >
            <Float speed={1.2} rotationIntensity={0.02} floatIntensity={0.2}>
              <HolographicAvatar
                color={MEMBER_COLORS[i]}
                isActive={activeMember === i}
                index={i}
              />
            </Float>

            <Billboard>
              <Text
                position={[0, -1.5, 0]}
                fontSize={0.1}
                color={MEMBER_COLORS[i]}
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.2}
                font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
              >
                {member.name}
                <meshStandardMaterial
                  color={MEMBER_COLORS[i]}
                  emissive={MEMBER_COLORS[i]}
                  emissiveIntensity={activeMember === i ? 1.5 : 0.3}
                  transparent
                  opacity={activeMember === i ? 0.9 : 0.4}
                  toneMapped={false}
                />
              </Text>
            </Billboard>

            <Billboard>
              <Text
                position={[0, -1.8, 0]}
                fontSize={0.055}
                color="#F8F9FA"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.1}
                font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
              >
                {member.role}
                <meshStandardMaterial color="#F8F9FA" transparent opacity={activeMember === i ? 0.5 : 0.2} />
              </Text>
            </Billboard>
          </group>

          <MemberPlatform position={MEMBER_POSITIONS[i]} color={MEMBER_COLORS[i]} isActive={activeMember === i} />

          <pointLight
            position={[MEMBER_POSITIONS[i][0], MEMBER_POSITIONS[i][1] + 1.5, MEMBER_POSITIONS[i][2] + 1]}
            color={MEMBER_COLORS[i]}
            intensity={activeMember === i ? 1.2 : 0.15}
            distance={5}
            decay={2}
          />
        </group>
      ))}

      <pointLight position={[0, 5, 3]} color="#00E5FF" intensity={0.4} distance={15} decay={2} />
      <pointLight position={[-4, 1, -2]} color="#D946EF" intensity={0.3} distance={12} decay={2} />
    </group>
  )
}
