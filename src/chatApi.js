const rooms = {
  power: [
    { id: 1, user: 'Chinedu', text: 'Light just went off in my area again', time: Date.now() - 600000 },
    { id: 2, user: 'Amina', text: 'Same here, I just confirmed your report', time: Date.now() - 300000 },
  ],
  skills: [
    { id: 1, user: 'Tunde', text: 'Need flyers printed? I need two shirts altered', time: Date.now() - 400000 },
  ],
}
const listeners = {}

export function getMessages(room) {
  return [...(rooms[room] || [])]
}

export function sendMessage(room, user, text) {
  const msg = { id: Date.now() + Math.random(), user, text, time: Date.now() }
  rooms[room] = [...(rooms[room] || []), msg]
  const subs = listeners[room] || []
  subs.forEach((cb) => cb(getMessages(room)))
  return msg
}

export function subscribe(room, cb) {
  listeners[room] = [...(listeners[room] || []), cb]
  return () => {
    listeners[room] = listeners[room].filter((l) => l !== cb)
  }
}