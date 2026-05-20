import { useEffect, useRef, useCallback } from 'react'

export default function useLenis(onScroll) {
  const progressRef = useRef(0)
  const targetRef = useRef(0)
  const velocityRef = useRef(0)
  const rafRef = useRef(null)
  const onScrollRef = useRef(onScroll)

  // Keep callback ref fresh
  useEffect(() => {
    onScrollRef.current = onScroll
  }, [onScroll])

  useEffect(() => {
    console.log('[VirtualScroll] Initialized')

    const handleWheel = (e) => {
      const delta = e.deltaY * 0.0004
      targetRef.current = Math.max(0, Math.min(1, targetRef.current + delta))
      console.log('[VirtualScroll] wheel delta:', e.deltaY, 'target:', targetRef.current.toFixed(4))
    }

    let lastTouchY = 0
    const handleTouchStart = (e) => {
      lastTouchY = e.touches[0].clientY
    }
    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY
      const delta = (lastTouchY - currentY) * 0.002
      targetRef.current = Math.max(0, Math.min(1, targetRef.current + delta))
      lastTouchY = currentY
    }

    function animate() {
      const prev = progressRef.current
      progressRef.current += (targetRef.current - progressRef.current) * 0.08

      if (Math.abs(targetRef.current - progressRef.current) > 0.00001) {
        velocityRef.current = progressRef.current - prev
        if (onScrollRef.current) {
          onScrollRef.current({
            progress: progressRef.current,
            target: targetRef.current,
            velocity: velocityRef.current,
            direction: velocityRef.current > 0 ? 1 : -1
          })
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const scrollTo = useCallback((zoneProgress, options = {}) => {
    const duration = options.duration || 2
    const start = progressRef.current
    const diff = zoneProgress - start
    const startTime = performance.now()

    function ease(t) {
      return 1 - Math.pow(1 - t, 4)
    }

    function step(currentTime) {
      const elapsed = (currentTime - startTime) / (duration * 1000)
      if (elapsed >= 1) {
        targetRef.current = zoneProgress
        return
      }
      targetRef.current = start + diff * ease(elapsed)
      requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [])

  return { progressRef, scrollTo }
}
