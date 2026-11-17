import { useState } from 'react'
import ChatBox from './ChatBox'

export default function CommunityChat({ room, title }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {!open && <button className="chat-fab" onClick={() => setOpen(true)}>Chat</button>}
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <span>{title}</span>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </div>
          <ChatBox room={room} />
        </div>
      )}
    </>
  )
}