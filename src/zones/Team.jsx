import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard, Float } from '@react-three/drei'
import * as THREE from 'three'
import team from '@/data/team'

function MemberNode({ name, role, geometryType, position, isActive, onHover, onClick }) {
  const meshRef = useRef()
  const frameRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.4
      meshRef.current.rotation.y = t * 0.6
      
      const targetScale = (isActive || hovered) ? 1.25 : 1.0
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1))
    }

    if (frameRef.current) {
      frameRef.current.rotation.z = -t * 0.2
      const pulse = 1.0 + Math.sin(t * 1.5) * 0.05
      frameRef.current.scale.setScalar(THREE.MathUtils.lerp(frameRef.current.scale.x, pulse * ((isActive || hovered) ? 1.15 : 1.0), 0.1))
    }
  })

  // Determine geometry based on type
  const renderGeometry = () => {
    switch (geometryType) {
      case 'octahedron':
        return <octahedronGeometry args={[0.7, 0]} />
      case 'torus':
        return <torusGeometry args={[0.5, 0.15, 12, 32]} />
      case 'dodecahedron':
      default:
        return <dodecahedronGeometry args={[0.6, 0]} />
    }
  }

  const color = geometryType === 'octahedron' ? '#00f0ff' : geometryType === 'torus' ? '#bc34fa' : '#ff5e00'

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover?.(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        onHover?.(false)
        document.body.style.cursor = 'default'
      }}
    >
      {/* Interactive geometry shape */}
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
        <mesh ref={meshRef}>
          {renderGeometry()}
          <meshStandardMaterial
            color={color}
            wireframe
            transparent
            opacity={isActive || hovered ? 0.95 : 0.4}
            emissive={color}
            emissiveIntensity={isActive || hovered ? 1.5 : 0.3}
            toneMapped={false}
          />
        </mesh>
      </Float>

      {/* Holographic orbital frame ring */}
      <mesh ref={frameRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.1, 0.012, 8, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive || hovered ? 2.0 : 0.5}
          transparent
          opacity={isActive || hovered ? 0.8 : 0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Profile Billboard Name Tag */}
      <Billboard position={[0, 1.6, 0]}>
        <Text
          fontSize={0.14}
          color="#00f0ff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
        >
          {name}
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={isActive || hovered ? 1.0 : 0.3}
            transparent
            opacity={isActive || hovered ? 0.9 : 0.5}
            toneMapped={false}
          />
        </Text>
      </Billboard>

      {/* Profile Billboard Role Tag */}
      <Billboard position={[0, 1.35, 0]}>
        <Text
          fontSize={0.065}
          color="#f3f4f6"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
          font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
        >
          {role.toUpperCase()}
          <meshStandardMaterial
            color="#f3f4f6"
            transparent
            opacity={isActive || hovered ? 0.6 : 0.25}
          />
        </Text>
      </Billboard>

      {/* Core Node lighting */}
      <pointLight
        position={[0, 0, 0.5]}
        color={color}
        intensity={isActive || hovered ? 1.8 : 0.3}
        distance={6}
        decay={2}
      />
    </group>
  )
}

function TeamTitle() {
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = 5.0 + Math.sin(t * 0.2) * 0.08
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
          THE SYNDICATE
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
          CORE CREW IDENTIFICATION
          <meshStandardMaterial color="#f3f4f6" transparent opacity={0.25} />
        </Text>
      </Billboard>

      <mesh position={[0, -0.55, 0]} scale={[2.5, 0.002, 1]}>
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

export default function Team({ visible = true, activeMember = 0, onSelectMember }) {
  if (!visible) return null

  // Geometries for Arthur, Tessia, Elijah
  const geometries = ['octahedron', 'torus', 'dodecahedron']

  return (
    <group position={[-1, 0, -45]}>
      <TeamTitle />
      
      {team.map((member, i) => {
        // Lay out team diagonally to look amazing from the camera rig perspective
        const xOffset = (i - 1) * 2.2
        const zOffset = (i - 1) * 0.8
        const yOffset = -0.3
        
        return (
          <MemberNode
            key={member.id}
            name={member.name}
            role={member.role}
            geometryType={geometries[i]}
            position={[xOffset, yOffset, zOffset]}
            isActive={activeMember === i}
            onHover={(isHovered) => {
              if (isHovered) {
                onSelectMember?.(i)
              }
            }}
            onClick={() => onSelectMember?.(i)}
          />
        )
      })}

      <pointLight position={[0, 4, 2]} color="#00f0ff" intensity={0.4} distance={15} decay={2} />
      <pointLight position={[-4, 1, -1]} color="#bc34fa" intensity={0.3} distance={10} decay={2} />
      <pointLight position={[4, 2, 1]} color="#ff5e00" intensity={0.25} distance={10} decay={2} />
    </group>
  )
}
