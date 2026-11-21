import { useEffect, useState } from 'react'
import { getSnapshot, subscribe } from '../friendsApi'

export default function useFriends() {
  const [snapshot, setSnapshot] = useState(getSnapshot)
  useEffect(() => subscribe(setSnapshot), [])
  return snapshot
}