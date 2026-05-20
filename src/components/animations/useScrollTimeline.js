import { useEffect, useRef } from 'react'

export default function useScrollTimeline() {
  const progress = useRef(0)
  const timeline = useRef(null)

  useEffect(() => {
    return () => {
      if (timeline.current) {
        timeline.current.kill()
      }
    }
  }, [])

  return { progress, timeline }
}
