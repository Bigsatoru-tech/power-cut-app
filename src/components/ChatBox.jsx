import { useEffect, useRef, useState } from 'react'
import { getMessages, sendMessage, subscribe } from '../chatApi'
import { currentUser } from '../data/currentUser'

export default function ChatBox({ room, autoReplyFrom }) {
  const [messages, setMessages] = useState(() => getMessages(room))
  const [text, setText] = useState('')
  const endRef = useRef(null)

  useEffect(() => subscribe(room, setMessages), [room])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(e) {
    e.preventDefault()
    const clean = text.trim()
    if (!clean) return
    sendMessage(room, currentUser.name, clean)
    setText('')
    // Demo only: remove this when real chat is connected
    if (autoReplyFrom) {
      setTimeout(() => {
        sendMessage(room, autoReplyFrom, "Thanks for the message! Let's talk about how we can swap.")
      }, 1500)
    }
  }

  return (
    <div className="chat-box">
      <div className="chat-list">
        {messages.map((m) => (
          <div key={m.id} className={m.user === currentUser.name ? 'msg me' : 'msg'}>
            <div className="msg-user">
              {m.user} · {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form className="chat-form" onSubmit={handleSend}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}