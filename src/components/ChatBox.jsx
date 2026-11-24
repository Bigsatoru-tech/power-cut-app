import { useEffect, useRef, useState } from 'react'
import { getMessages, sendMessage, subscribe } from '../chatApi'

export default function ChatBox({ room }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    let active = true
    getMessages(room)
      .then((list) => {
        if (active) setMessages(list)
      })
      .catch((err) => setError(err.message))

    const unsubscribe = subscribe(room, (msg) => {
      setMessages((current) => (current.some((m) => m.id === msg.id) ? current : [...current, msg]))
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [room])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    const clean = text.trim()
    if (!clean) return
    setText('')
    setError('')
    try {
      const msg = await sendMessage(room, clean)
      setMessages((current) => (current.some((m) => m.id === msg.id) ? current : [...current, msg]))
    } catch (err) {
      setError(err.message)
      setText(clean)
    }
  }

  return (
    <div className="chat-box">
      <div className="chat-list">
        {messages.map((m) => (
          <div key={m.id} className={m.mine ? 'msg me' : 'msg'}>
            <div className="msg-user">
              {m.mine ? 'You' : m.user} · {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {error && <div className="chat-error">{error}</div>}
      <form className="chat-form" onSubmit={handleSend}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}