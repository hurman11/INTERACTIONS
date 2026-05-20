export const zoneTransition = {
  duration: 1.2,
  ease: 'power3.inOut'
}

export const cameraTransition = {
  duration: 2.0,
  ease: 'power4.out'
}

export const hudTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 1
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}
