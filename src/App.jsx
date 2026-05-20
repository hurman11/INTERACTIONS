import { useState, useCallback, useRef, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import LoadingScreen from '@/components/ui/LoadingScreen'
import HUD from '@/components/ui/HUD'
import NavigationSystem from '@/components/ui/NavigationSystem'
import ProjectTerminal from '@/components/ui/ProjectTerminal'
import TeamProfiles from '@/components/ui/TeamProfiles'
import ContactTerminal from '@/components/ui/ContactTerminal'
import Environment from '@/components/3d/Environment'
import Particles from '@/components/3d/Particles'
import FloatingGeometry from '@/components/3d/FloatingGeometry'
import Walkway from '@/components/3d/Walkway'
import CameraRig from '@/components/3d/CameraRig'
import PostFX from '@/components/effects/PostFX'
import Fog from '@/components/effects/Fog'
import Gateway from '@/zones/Gateway'
import Core from '@/zones/Core'
import Lab from '@/zones/Lab'
import Team from '@/zones/Team'
import Network from '@/zones/Network'
import Terminal from '@/zones/Terminal'
import useDeviceDetect from '@/hooks/useDeviceDetect'
import useWorldProgress from '@/hooks/useWorldProgress'

function Scene({ capabilities, scrollProgress, activeMember, setActiveMember }) {
  return (
    <>
      <CameraRig scrollProgress={scrollProgress}>
        <Environment enableHDRI={!capabilities.isLowEnd} />
        <Walkway />
        <Particles
          count={capabilities.particleCount}
          enableNeural={!capabilities.isLowEnd}
        />
        <FloatingGeometry count={capabilities.isLowEnd ? 12 : 25} />

        <Gateway />
        <Core />
        <Lab />
        <Team activeMember={activeMember} onSelectMember={setActiveMember} />
        <Network />
        <Terminal />
      </CameraRig>

      <Stars
        radius={50}
        depth={80}
        count={capabilities.isLowEnd ? 1000 : 3000}
        factor={3}
        saturation={0.1}
        fade
        speed={0.5}
      />

      <Fog />

      {capabilities.enablePostProcessing && (
        <PostFX bloomIntensity={0.8} />
      )}
    </>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeProject, setActiveProject] = useState(1)
  const [activeMember, setActiveMember] = useState(0)
  const capabilities = useDeviceDetect()
  const world = useWorldProgress()

  const scrollTarget = useRef(0)
  const scrollCurrent = useRef(0)

  useEffect(() => {
    const handleWheel = (e) => {
      scrollTarget.current = Math.max(0, Math.min(1, scrollTarget.current + e.deltaY * 0.0004))
    }

    let lastTouchY = 0
    const handleTouchStart = (e) => {
      lastTouchY = e.touches[0].clientY
    }
    const handleTouchMove = (e) => {
      const delta = (lastTouchY - e.touches[0].clientY) * 0.002
      scrollTarget.current = Math.max(0, Math.min(1, scrollTarget.current + delta))
      lastTouchY = e.touches[0].clientY
    }

    let raf
    function animate() {
      scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * 0.08

      if (Math.abs(scrollTarget.current - scrollCurrent.current) > 0.00001) {
        setScrollProgress(scrollCurrent.current)
        world.update(scrollCurrent.current)
      }

      raf = requestAnimationFrame(animate)
    }

    document.addEventListener('wheel', handleWheel, { passive: true })
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    raf = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      cancelAnimationFrame(raf)
    }
  }, [world])

  const handleNavigate = useCallback((zoneIndex) => {
    const target = zoneIndex / 6
    const start = scrollCurrent.current
    const diff = target - start
    const startTime = performance.now()

    function step(now) {
      const elapsed = (now - startTime) / 2500
      if (elapsed >= 1) {
        scrollTarget.current = target
        return
      }
      const eased = 1 - Math.pow(1 - elapsed, 4)
      scrollTarget.current = start + diff * eased
      requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [])

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleProjectNavigate = useCallback((index) => {
    setActiveProject(index)
  }, [])

  const handleMemberNavigate = useCallback((index) => {
    setActiveMember(index)
  }, [])

  return (
    <div className="relative w-full h-screen bg-cyber-black text-cyber-white select-none overflow-hidden">
      {isLoading && <LoadingScreen onComplete={handleLoadComplete} />}

      <div className={`absolute inset-0 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Canvas
          dpr={[1, capabilities.maxDpr]}
          camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 200 }}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
          style={{ background: '#050508' }}
        >
          <color attach="background" args={['#050508']} />
          <Suspense fallback={null}>
            <Scene
              capabilities={capabilities}
              scrollProgress={scrollProgress}
              activeMember={activeMember}
              setActiveMember={setActiveMember}
            />
          </Suspense>
        </Canvas>
      </div>

      {!isLoading && (
        <>
          <HUD currentZone={world.currentZone} scrollProgress={scrollProgress} />
          <NavigationSystem currentZone={world.currentZone} onNavigate={handleNavigate} />
          <ProjectTerminal
            activeProject={activeProject}
            onNavigate={handleProjectNavigate}
            currentZone={world.currentZone}
          />
          <TeamProfiles
            activeMember={activeMember}
            onNavigate={handleMemberNavigate}
            currentZone={world.currentZone}
          />
          <ContactTerminal
            currentZone={world.currentZone}
          />
          <div className="scanline-overlay opacity-20 fixed inset-0 pointer-events-none z-50" />
        </>
      )}
    </div>
  )
}

export default App
