import { useState, useEffect, useMemo } from 'react'
import { isMobileDevice, isTouchDevice, getDeviceSpecs } from '@/utils/device'

export default function useDeviceDetect() {
  const [specs, setSpecs] = useState(() => getDeviceSpecs())

  const capabilities = useMemo(() => {
    const mobile = isMobileDevice()
    const touch = isTouchDevice()
    const lowEnd = specs.pixelRatio <= 1 || specs.width < 768

    return {
      isMobile: mobile,
      isTouch: touch,
      isLowEnd: lowEnd,
      enablePostProcessing: !lowEnd,
      enableParticles: !lowEnd,
      maxDpr: lowEnd ? 1 : 1.5,
      particleCount: lowEnd ? 200 : 500
    }
  }, [specs])

  useEffect(() => {
    function handleResize() {
      setSpecs(getDeviceSpecs())
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return capabilities
}
