import { useState, useRef, useCallback } from 'react'
import { ZONE_COUNT } from '@/utils/constants'

export default function useWorldProgress() {
  const [currentZone, setCurrentZone] = useState(0)
  const progressRef = useRef(0)
  const zoneRef = useRef(0)
  const listeners = useRef(new Set())

  const getZone = useCallback((scrollProgress) => {
    const raw = scrollProgress * ZONE_COUNT
    return Math.min(Math.floor(raw), ZONE_COUNT - 1)
  }, [])

  const getZoneProgress = useCallback((scrollProgress) => {
    const raw = scrollProgress * ZONE_COUNT
    const zone = Math.min(Math.floor(raw), ZONE_COUNT - 1)
    return raw - zone
  }, [])

  const update = useCallback((scrollProgress) => {
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress))
    progressRef.current = clampedProgress
    const newZone = getZone(clampedProgress)

    if (newZone !== zoneRef.current) {
      zoneRef.current = newZone
      setCurrentZone(newZone)
      listeners.current.forEach(fn => fn(newZone, clampedProgress))
    }

    return {
      progress: clampedProgress,
      zone: newZone,
      zoneProgress: getZoneProgress(clampedProgress)
    }
  }, [getZone, getZoneProgress])

  const onZoneChange = useCallback((fn) => {
    listeners.current.add(fn)
    return () => listeners.current.delete(fn)
  }, [])

  const getScrollTargetForZone = useCallback((zoneIndex) => {
    return zoneIndex / ZONE_COUNT
  }, [])

  return {
    currentZone,
    progressRef,
    update,
    getZone,
    getZoneProgress,
    onZoneChange,
    getScrollTargetForZone
  }
}
