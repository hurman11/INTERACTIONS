import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Text, Billboard, Float } from '@react-three/drei'
import * as THREE from 'three'
import projects from '@/data/projects'

function TerminalModel({ position, rotation = [0, 0, 0], scale = 1, isActive, onClick }) {
  const { scene } = useGLTF('/assets/futuristic_free-standing_terminal.glb')
  const modelRef = useRef()
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!modelRef.current) return

    const targetScale = isActive ? scale * 1.08 : scale
    const current = modelRef.current.scale.x
    const lerped = THREE.MathUtils.lerp(current, targetScale, 0.05)
    modelRef.current.scale.setScalar(lerped)

    modelRef.current.position.y = position[1] + Math.sin(t * 0.4 + position[0]) * 0.08
  })

  useFrame(() => {
    if (clonedScene) {
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone()
          child.material.emissive = new THREE.Color(isActive ? '#00E5FF' : '#1a1a1a')
          child.material.emissiveIntensity = isActive ? 0.3 : 0.05
        }
      })
    }
  })

  return (
    <group
      ref={modelRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      onPointerEnter={() => { document.body.style.cursor = 'pointer' }}
      onPointerLeave={() => { document.body.style.cursor = 'default' }}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

function ProjectHologram({ project, position, isActive }) {
  const groupRef = useRef()
  const frameRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!groupRef.current) return

    const targetOpacity = isActive ? 1 : 0
    const children = groupRef.current.children
    children.forEach((child) => {
      if (child.material) {
        child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, targetOpacity * 0.6, 0.05)
      }
    })

    if (frameRef.current) {
      frameRef.current.rotation.z = t * 0.15
      const pulse = 0.98 + Math.sin(t * 1.5) * 0.02
      frameRef.current.scale.setScalar(pulse)
    }
  })

  if (!project) return null

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={frameRef}>
        <torusGeometry args={[1.2, 0.008, 16, 64]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={2}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      <mesh scale={[2, 1.2, 1]} position={[0, 0, -0.1]}>
        <planeGeometry />
        <meshStandardMaterial
          color="#030305"
          emissive="#00E5FF"
          emissiveIntensity={0.05}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Billboard>
        <Text
          position={[0, 0.3, 0.1]}
          fontSize={0.14}
          color="#00E5FF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
        >
          {project.title}
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={1}
            transparent
            opacity={isActive ? 0.9 : 0}
            toneMapped={false}
          />
        </Text>
      </Billboard>

      <Billboard>
        <Text
          position={[0, -0.05, 0.1]}
          fontSize={0.055}
          color="#F8F9FA"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          lineHeight={1.4}
          font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
        >
          {project.description}
          <meshStandardMaterial
            color="#F8F9FA"
            transparent
            opacity={isActive ? 0.5 : 0}
          />
        </Text>
      </Billboard>

      <group position={[0, -0.45, 0.1]}>
        {project.technologies.map((tech, i) => (
          <Billboard key={tech}>
            <Text
              position={[(i - (project.technologies.length - 1) / 2) * 0.6, 0, 0]}
              fontSize={0.04}
              color="#D946EF"
              anchorX="center"
              anchorY="middle"
              font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
            >
              {tech}
              <meshStandardMaterial
                color="#D946EF"
                emissive="#D946EF"
                emissiveIntensity={0.5}
                transparent
                opacity={isActive ? 0.6 : 0}
                toneMapped={false}
              />
            </Text>
          </Billboard>
        ))}
      </group>
    </group>
  )
}

function LabTitle() {
  const groupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.y = 5 + Math.sin(t * 0.25) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, 5, 0]}>
      <Billboard>
        <Text
          fontSize={0.22}
          color="#00E5FF"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dy0.woff2"
        >
          THE LAB
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
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
          color="#F8F9FA"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e.woff2"
        >
          PROJECT SHOWCASE
          <meshStandardMaterial color="#F8F9FA" transparent opacity={0.25} />
        </Text>
      </Billboard>

      <mesh position={[0, -0.55, 0]} scale={[2.5, 0.002, 1]}>
        <planeGeometry />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={2}
          transparent
          opacity={0.12}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function LabFloorGrid() {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.03 + Math.sin(t * 0.3) * 0.01
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[30, 30, 30, 30]} />
      <meshStandardMaterial
        color="#00E5FF"
        emissive="#00E5FF"
        emissiveIntensity={0.3}
        wireframe
        transparent
        opacity={0.03}
        toneMapped={false}
      />
    </mesh>
  )
}

const TERMINAL_POSITIONS = [
  { position: [-3.5, -0.5, 2], rotation: [0, 0.4, 0] },
  { position: [0, -0.5, 0], rotation: [0, 0, 0] },
  { position: [3.5, -0.5, 2], rotation: [0, -0.4, 0] },
]

export default function Lab({ visible = true }) {
  const [activeProject, setActiveProject] = useState(1)

  if (!visible) return null

  return (
    <group position={[2, 0, -30]}>
      <LabTitle />
      <LabFloorGrid />

      {projects.map((project, i) => (
        <group key={project.id}>
          <Float speed={0.8} rotationIntensity={0.01} floatIntensity={0.15}>
            <TerminalModel
              position={TERMINAL_POSITIONS[i].position}
              rotation={TERMINAL_POSITIONS[i].rotation}
              scale={0.8}
              isActive={activeProject === i}
              onClick={() => setActiveProject(i)}
            />
          </Float>

          <ProjectHologram
            project={project}
            position={[
              TERMINAL_POSITIONS[i].position[0],
              TERMINAL_POSITIONS[i].position[1] + 2.5,
              TERMINAL_POSITIONS[i].position[2]
            ]}
            isActive={activeProject === i}
          />

          <pointLight
            position={[
              TERMINAL_POSITIONS[i].position[0],
              TERMINAL_POSITIONS[i].position[1] + 1,
              TERMINAL_POSITIONS[i].position[2] + 1
            ]}
            color={activeProject === i ? '#00E5FF' : '#1a1a1a'}
            intensity={activeProject === i ? 1 : 0.1}
            distance={6}
            decay={2}
          />
        </group>
      ))}

      <pointLight position={[0, 5, 3]} color="#00E5FF" intensity={0.5} distance={15} decay={2} />
      <pointLight position={[-5, 1, -2]} color="#D946EF" intensity={0.3} distance={12} decay={2} />
      <pointLight position={[5, 2, 1]} color="#1e3a5f" intensity={0.2} distance={10} decay={2} />
    </group>
  )
}

useGLTF.preload('/assets/futuristic_free-standing_terminal.glb')
