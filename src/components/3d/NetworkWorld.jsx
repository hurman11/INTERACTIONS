import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Line } from '@react-three/drei'
import * as THREE from 'three'

// Helper to generate a random point on a sphere of a given radius
function getRandomSpherePoint(radius) {
  const u = Math.random()
  const v = Math.random()
  const theta = u * 2.0 * Math.PI
  const phi = Math.acos(2.0 * v - 1.0)
  const x = radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.sin(phi) * Math.sin(theta)
  const z = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

export default function NetworkWorld() {
  const groupRef = useRef()
  const satellitesRef = useRef()
  
  // Load Earth hologram model
  const { scene } = useGLTF('/assets/earth_hologram.glb')
  
  // Clone scene so we can modify its materials safely without impacting other instances
  const clonedScene = useMemo(() => {
    if (!scene) return null
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#00f0ff',
          emissive: '#005577',
          emissiveIntensity: 1.2,
          wireframe: true,
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending
        })
      }
    })
    return clone
  }, [scene])

  // Generate random data points on earth's surface
  const R = 2.1 // radius of the earth model in world units
  const dataNodes = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const position = getRandomSpherePoint(R)
      return {
        id: i,
        position,
        scale: 0.04 + Math.random() * 0.04,
        pulseOffset: Math.random() * Math.PI * 2,
        color: i % 2 === 0 ? '#00f0ff' : '#bc34fa'
      }
    })
  }, [R])

  // Generate Bezier curves connecting the nodes
  const dataArcs = useMemo(() => {
    const arcs = []
    for (let i = 0; i < dataNodes.length; i++) {
      const startNode = dataNodes[i]
      // Connect to the next node and a random node to form a web
      const targets = [
        dataNodes[(i + 1) % dataNodes.length],
        dataNodes[Math.floor(Math.random() * dataNodes.length)]
      ]

      targets.forEach((endNode) => {
        if (startNode.id !== endNode.id) {
          const pStart = startNode.position.clone()
          const pEnd = endNode.position.clone()
          
          // Midpoint logic with radial elevation for arc height
          const pMid = new THREE.Vector3().addVectors(pStart, pEnd).multiplyScalar(0.5)
          const distance = pStart.distanceTo(pEnd)
          pMid.normalize().multiplyScalar(R + distance * 0.45) // elevate arc
          
          const curve = new THREE.QuadraticBezierCurve3(pStart, pMid, pEnd)
          const points = curve.getPoints(24) // 24 segments for smooth rendering
          
          arcs.push({
            id: `${startNode.id}-${endNode.id}`,
            points,
            color: Math.random() > 0.4 ? startNode.color : endNode.color,
            speed: 0.5 + Math.random() * 1.5,
            offset: Math.random() * Math.PI
          })
        }
      })
    }
    return arcs
  }, [dataNodes, R])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Gentle global rotation of Earth + Node complex
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08
      groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.05
    }

    // Faster orbital rotation for the satellite ring
    if (satellitesRef.current) {
      satellitesRef.current.rotation.y = -t * 0.2
      satellitesRef.current.rotation.z = Math.sin(t * 0.1) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Placed Earth GLTF Model */}
      {clonedScene && (
        <group scale={1.0}>
          <primitive object={clonedScene} />
        </group>
      )}

      {/* Internal core glow point light */}
      <pointLight color="#00f0ff" intensity={1.5} distance={10} decay={2} />

      {/* Network Nodes (Pulsing city markers) */}
      {dataNodes.map((node) => (
        <mesh key={node.id} position={node.position.toArray()}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Network Connection Arcs */}
      {dataArcs.map((arc) => (
        <Line
          key={arc.id}
          points={arc.points}
          color={arc.color}
          lineWidth={1.2}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      ))}

      {/* Orbital Satellite Ring */}
      <group ref={satellitesRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.2, 0.005, 8, 64]} />
          <meshBasicMaterial color="#bc34fa" transparent opacity={0.15} />
        </mesh>

        {/* Satellite 1 */}
        <mesh position={[3.2, 0, 0]} scale={0.08}>
          <octahedronGeometry />
          <meshStandardMaterial
            color="#bc34fa"
            emissive="#bc34fa"
            emissiveIntensity={2}
            toneMapped={false}
          />
          <pointLight color="#bc34fa" intensity={0.5} distance={3} decay={2} />
        </mesh>

        {/* Satellite 2 */}
        <mesh position={[-3.2, 0, 0]} scale={0.08}>
          <octahedronGeometry />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={2}
            toneMapped={false}
          />
          <pointLight color="#00f0ff" intensity={0.5} distance={3} decay={2} />
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/assets/earth_hologram.glb')
