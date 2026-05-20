import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ZONE_CAMERA_POSITIONS, CAMERA_CONFIG, ZONE_COUNT } from '@/utils/constants'

export default function CameraRig({ children, scrollProgress = 0 }) {
  const groupRef = useRef()
  const smoothMouse = useRef({ x: 0, y: 0 })
  const currentPos = useRef(new THREE.Vector3(0, 0, 12))
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0))
  const currentFov = useRef(60)
  const { camera } = useThree()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!groupRef.current) return

    const pointer = state.pointer
    smoothMouse.current.x = THREE.MathUtils.lerp(smoothMouse.current.x, pointer.x, 0.025)
    smoothMouse.current.y = THREE.MathUtils.lerp(smoothMouse.current.y, pointer.y, 0.025)

    const progress = scrollProgress
    const rawZone = progress * ZONE_COUNT
    const zoneIndex = Math.min(Math.floor(rawZone), ZONE_COUNT - 1)
    const nextZoneIndex = Math.min(zoneIndex + 1, ZONE_COUNT - 1)
    const zoneFraction = rawZone - zoneIndex

    const currentZoneData = ZONE_CAMERA_POSITIONS[zoneIndex]
    const nextZoneData = ZONE_CAMERA_POSITIONS[nextZoneIndex]

    const easedFraction = zoneFraction * zoneFraction * (3 - 2 * zoneFraction)

    const targetPosX = THREE.MathUtils.lerp(currentZoneData.position[0], nextZoneData.position[0], easedFraction)
    const targetPosY = THREE.MathUtils.lerp(currentZoneData.position[1], nextZoneData.position[1], easedFraction)
    const targetPosZ = THREE.MathUtils.lerp(currentZoneData.position[2], nextZoneData.position[2], easedFraction)

    const targetLookX = THREE.MathUtils.lerp(currentZoneData.target[0], nextZoneData.target[0], easedFraction)
    const targetLookY = THREE.MathUtils.lerp(currentZoneData.target[1], nextZoneData.target[1], easedFraction)
    const targetLookZ = THREE.MathUtils.lerp(currentZoneData.target[2], nextZoneData.target[2], easedFraction)

    const targetFov = THREE.MathUtils.lerp(currentZoneData.fov, nextZoneData.fov, easedFraction)

    const lerpSpeed = CAMERA_CONFIG.lerpSpeed
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetPosX, lerpSpeed)
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetPosY, lerpSpeed)
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetPosZ, lerpSpeed)

    currentTarget.current.x = THREE.MathUtils.lerp(currentTarget.current.x, targetLookX, lerpSpeed)
    currentTarget.current.y = THREE.MathUtils.lerp(currentTarget.current.y, targetLookY, lerpSpeed)
    currentTarget.current.z = THREE.MathUtils.lerp(currentTarget.current.z, targetLookZ, lerpSpeed)

    currentFov.current = THREE.MathUtils.lerp(currentFov.current, targetFov, lerpSpeed)

    const breatheY = Math.sin(t * CAMERA_CONFIG.breatheSpeed) * CAMERA_CONFIG.breatheAmplitude
    const driftX = Math.sin(t * 0.08) * 0.1
    const driftZ = Math.cos(t * 0.06) * 0.08

    camera.position.set(
      currentPos.current.x + smoothMouse.current.x * CAMERA_CONFIG.parallaxFactor * 2 + driftX,
      currentPos.current.y + breatheY - smoothMouse.current.y * CAMERA_CONFIG.parallaxFactor,
      currentPos.current.z + driftZ
    )

    camera.lookAt(
      currentTarget.current.x + smoothMouse.current.x * 0.3,
      currentTarget.current.y + smoothMouse.current.y * 0.15,
      currentTarget.current.z
    )

    camera.fov = currentFov.current
    camera.updateProjectionMatrix()

    groupRef.current.rotation.y = smoothMouse.current.x * 0.015
    groupRef.current.rotation.x = -smoothMouse.current.y * 0.008
  })

  return <group ref={groupRef}>{children}</group>
}
