export function paymentDisplayKey(method) {
  const key = (method || '').toLowerCase()
  return key === 'gift' ? 'other' : key
}

export function formatOrderOrigin(origin) {
  if (!origin) return ''
  return origin.toLowerCase().startsWith('gift:') ? origin.slice(5) : origin
}
