export function timeAgo(dateString) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours < 24) return rest ? `${hours}h ${rest}m ago` : `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ${hours % 24}h ago`
}

export function timeLeft(dateString) {
  const minutes = Math.max(0, Math.ceil((new Date(dateString).getTime() - Date.now()) / 60000))
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}