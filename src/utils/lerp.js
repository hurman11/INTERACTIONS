export function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end
}

export function damp(start, end, lambda, dt) {
  return lerp(start, end, 1 - Math.exp(-lambda * dt))
}
