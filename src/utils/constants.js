export const COLORS = {
  black: "#030305",
  charcoal: "#0B0B12",
  cyan: "#00E5FF",
  purple: "#D946EF",
  magenta: "#D946EF",
  white: "#F8F9FA",
  orange: "#FF3B00",
  green: "#00FF9D"
}

export const ZONES = {
  GATEWAY: 0,
  CORE: 1,
  LAB: 2,
  TEAM: 3,
  NETWORK: 4,
  TERMINAL: 5
}

export const ZONE_NAMES = ['Gateway', 'Core', 'Lab', 'Team', 'Network', 'Terminal']

export const ZONE_COUNT = Object.keys(ZONES).length

export const ZONE_CAMERA_POSITIONS = [
  { position: [0, 0, 12], target: [0, 0, 0], fov: 60 },
  { position: [0, 2, -6], target: [0, 1, -15], fov: 55 },
  { position: [4, 1, -26], target: [2, 0, -30], fov: 58 },
  { position: [-3, 1.5, -40], target: [-1, 0.5, -45], fov: 56 },
  { position: [0, 4, -52], target: [0, 2, -60], fov: 62 },
  { position: [0, 0.5, -68], target: [0, 0, -75], fov: 50 }
]

export const CAMERA_CONFIG = {
  fov: 60,
  near: 0.1,
  far: 200,
  parallaxFactor: 0.05,
  lerpSpeed: 0.035,
  breatheSpeed: 0.15,
  breatheAmplitude: 0.15
}

export const PERFORMANCE = {
  dprMin: 1,
  dprMax: 1.5,
  mobileDprMax: 1
}

export const SCROLL_CONFIG = {
  totalHeight: 600,
  zoneHeight: 100,
  lenisDuration: 1.4,
  cameraTransitionSpeed: 0.03
}
