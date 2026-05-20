export function isMobileDevice() {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function isTouchDevice() {
  if (typeof window === "undefined") return false
  return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

export function getDeviceSpecs() {
  if (typeof window === "undefined") return { width: 0, height: 0, pixelRatio: 1 }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 1.5)
  }
}
