import { useState, useEffect, useRef, useCallback } from 'react'
import { lerp } from '@/utils/lerp'

export default function useMouseParallax(factor = 0.05) {
  const mouse = useRef({ x: 0, y: 0 })
  const smoothed = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function handleMouseMove(e) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const update = useCallback((dt = 0.016) => {
    smoothed.current.x = lerp(smoothed.current.x, mouse.current.x * factor, 0.05)
    smoothed.current.y = lerp(smoothed.current.y, mouse.current.y * factor, 0.05)
    return smoothed.current
  }, [factor])

  return { mouse, smoothed, update }
}
