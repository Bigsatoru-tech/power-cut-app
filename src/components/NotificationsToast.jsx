import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUnreadNotifications, markNotificationsRead, subscribeToNotifications } from '../notificationsApi'
import useAuth from '../hooks/useAuth'

// One small pop-up when someone starts a chat about your job
export default function NotificationToast() {
  const { profile } = useAuth()
  const myId = profile?.id
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!myId) return
    getUnreadNotifications().then(setItems).catch(() => {})
    return subscribeToNotifications(myId, (n) => {
      setItems((cur) => (cur.some((x) => x.id === n.id) ? cur : [...cur, n]))
    })
  }, [myId])

  function dismiss() {
    setItems([])
    markNotificationsRead().catch(() => {})
  }

  // hide by itself after 10 seconds
  useEffect(() => {
    if (items.length === 0) return
    const timer = setTimeout(dismiss, 10000)
    return () => clearTimeout(timer)
  }, [items])

  if (items.length === 0) return null
  const latest = items[items.length - 1]

  return (
    <div className="toast" role="status">
      <div className="toast-text">
        {latest.body}
        {items.length > 1 && <span className="toast-more"> (+{items.length - 1} more)</span>}
      </div>
      <div className="toast-actions">
        {latest.link && (
          <Link className="toast-open" to={latest.link} onClick={dismiss}>Open chat</Link>
        )}
        <button className="toast-close" onClick={dismiss} aria-label="Dismiss">✕</button>
      </div>
    </div>
  )
}