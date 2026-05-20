export const EASINGS = {
  power4Out: "power4.out",
  power3InOut: "power3.inOut",
  expoOut: "expo.out",
  cyberEase: "customEase"
}

export const HUD_TRANSITION = {
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 1
}

export const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}
