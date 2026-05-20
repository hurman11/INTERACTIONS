import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'

const SERVICES = [
  { id: 'web', label: 'WEB DEV', icon: 'octahedron', color: '#00E5FF', description: 'Full-stack web applications' },
  { id: 'ai', label: 'AI', icon: 'tetrahedron', color: '#D946EF', description: 'Machine learning systems' },
  { id: 'cyber', label: 'SECURITY', icon: 'icosahedron', color: '#FF3B00', description: 'Cybersecurity solutions' },
  { id: 'uiux', label: 'UI/UX', icon: 'dodecahedron', color: '#00E5FF', description: 'Interface design & motion' },
  { id: 'mobile', label: 'MOBILE', icon: 'box', color: '#D946EF', description: 'Cross-platform mobile apps' },
  { id: 'auto', label: 'AUTOMATION', icon: 'torus', color: '#1e3a5f', description: 'Workflow automation tools' },
]

function NodeGeometry({ type, color }) {
  const props = {
    color,
    emissive: color,
    emissiveIntensity: 1.2,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
    toneMapped: false,
  }

  switch (type) {
    case 'octahedron':
      return <mesh><octahedronGeometry args={[0.25, 0]} /><meshStandardMaterial {...props} /></mesh>
    case 'tetrahedron':
      return <mesh><tetrahedronGeometry args={[0.3, 0]} /><meshStandardMaterial {...props} /></mesh>
    case 'icosahedron':
      return <mesh><icosahedronGeometry args={[0.25, 0]} /><meshStandardMaterial {...props} /></mesh>
    case 'dodecahedron':
      return <mesh><dodecahedronGeometry args={[0.25, 0]} /><meshStandardMaterial {...props} /></mesh>
    case 'box':
      return <mesh><boxGeometry args={[0.35, 0.35, 0.35]} /><meshStandardMaterial {...props} /></mesh>
    case 'torus':
      return <mesh><torusGeometry args={[0.22, 0.08, 8, 16]} /><meshStandardMaterial {...props} /></mesh>
    default:
      return <mesh><octahedronGeometry args={[0.25, 0]} /><meshStandardMaterial {...props} /></mesh>
  }
}

function ServiceNode({ service, angle, radius, index, hoveredNode, onHover }) {
  const groupRef = useRef()
  const shapeRef = useRef()
  const isHovered = hoveredNode === service.id
  const baseY = Math.sin(index * 1.2) * 0.5

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!groupRef.current) return

    const currentAngle = angle + t * 0.12
    groupRef.current.position.x = Math.cos(currentAngle) * radius
    groupRef.current.position.z = Math.sin(currentAngle) * radius
    groupRef.current.position.y = baseY + Math.sin(t * 0.6 + index * 1.5) * 0.3

    if (shapeRef.current) {
      shapeRef.current.rotation.x += 0.008
      shapeRef.current.rotation.y += 0.012
      const targetScale = isHovered ? 1.6 : 1
      const currentScale = shapeRef.current.scale.x
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08)
      shapeRef.current.scale.setScalar(newScale)
    }
  })

  return (
    <group ref={groupRef}>
      <group
        ref={shapeRef}
        onPointerEnter={(e) => { e.stopPropagation(); onHover(service.id) }}
        onPointerLeave={(e) => { e.stopPropagation(); onHover(null) }}
      >
        <NodeGeometry type={service.icon} color={service.color} />
      </group>

      <Billboard>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.1}
          color={service.color}
          anchorX="center"
          anchorY="bottom"
          letterSpacing={0.15}
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
        >
          {service.label}
          <meshStandardMaterial
            color={service.color}
            emissive={service.color}
            emissiveIntensity={isHovered ? 2 : 0.5}
            transparent
            opacity={isHovered ? 0.9 : 0.5}
            toneMapped={false}
          />
        </Text>
      </Billboard>

      {isHovered && (
        <Billboard>
          <Text
            position={[0, -0.45, 0]}
            fontSize={0.065}
            color="#F8F9FA"
            anchorX="center"
            anchorY="top"
            font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
          >
            {service.description}
            <meshStandardMaterial color="#F8F9FA" transparent opacity={0.5} />
          </Text>
        </Billboard>
      )}

      <ConnectionLine
        color={service.color}
        length={radius}
        angle={angle}
        index={index}
        isHovered={isHovered}
      />

      <pointLight
        position={[0, 0, 0]}
        color={service.color}
        intensity={isHovered ? 1.5 : 0.3}
        distance={3}
        decay={2}
      />
    </group>
  )
}

function ConnectionLine({ color, length, angle, index, isHovered }) {
  const lineRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (lineRef.current) {
      lineRef.current.material.opacity = isHovered ? 0.3 : 0.06 + Math.sin(t * 0.5 + index) * 0.03
    }
  })

  const points = useMemo(() => {
    return [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-Math.cos(angle) * length * 0.85, -Math.sin(index * 1.2) * 0.5, -Math.sin(angle) * length * 0.85)]
  }, [angle, length, index])

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.08}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </line>
  )
}

export default function HologramNodes({ position = [0, 1, 0], radius = 3.5 }) {
  const [hoveredNode, setHoveredNode] = useState(null)
  const groupRef = useRef()

  return (
    <group ref={groupRef} position={position}>
      {SERVICES.map((service, i) => (
        <ServiceNode
          key={service.id}
          service={service}
          angle={(i / SERVICES.length) * Math.PI * 2}
          radius={radius}
          index={i}
          hoveredNode={hoveredNode}
          onHover={setHoveredNode}
        />
      ))}
    </group>
  )
}
