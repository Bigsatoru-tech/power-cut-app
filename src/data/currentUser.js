export const currentUser = { id: 'me', username: 'you_demo', name: 'Satoru', xp: 140 }

export function getLevelInfo(xp) {
  if (xp >= 300) return { level: 3, progress: 100 }
  if (xp >= 100) return { level: 2, progress: ((xp - 100) / 200) * 100 }
  return { level: 1, progress: (xp / 100) * 100 }
}