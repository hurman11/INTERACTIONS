import { useEffect, useRef } from 'react'

export default function useGSAPWorld() {
  const worldTimeline = useRef(null)

  useEffect(() => {
    return () => {
      if (worldTimeline.current) {
        worldTimeline.current.kill()
      }
    }
  }, [])

  return { worldTimeline }
}
