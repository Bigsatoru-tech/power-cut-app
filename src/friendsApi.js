import { users } from './data/users'
import { currentUser } from './data/currentUser'
import { sendMessage } from './chatApi'

const STORAGE_KEY = 'powerCutFriends'

function defaultState() {
  return {
    friends: ['ada_obi'],
    requests: [
      {
        id: 1,
        from: 'tunde_adeyemi',
        to: currentUser.username,
        skill: { id: 2, title: '50 A5 flyers or sticker batch print' },
        status: 'pending',
        time: Date.now() - 3600000,
      },
    ],
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // storage unavailable, use defaults
  }
  return defaultState()
}

let state = load()
const listeners = new Set()

function findUser(username) {
  return users.find((u) => u.username === username)
}

export function getSnapshot() {
  const friends = state.friends.map(findUser).filter(Boolean)
  const pending = state.requests.filter((r) => r.status === 'pending')
  const incoming = pending
    .filter((r) => r.to === currentUser.username)
    .map((r) => ({ ...r, user: findUser(r.from) }))
  const outgoing = pending
    .filter((r) => r.from === currentUser.username)
    .map((r) => ({ ...r, user: findUser(r.to) }))
  return { friends, incoming, outgoing }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable
  }
  const snapshot = getSnapshot()
  listeners.forEach((cb) => cb(snapshot))
}

export function subscribe(cb) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function getStatus(username) {
  if (state.friends.includes(username)) return 'friends'
  const pending = state.requests.filter((r) => r.status === 'pending')
  if (pending.some((r) => r.from === currentUser.username && r.to === username)) return 'sent'
  if (pending.some((r) => r.from === username && r.to === currentUser.username)) return 'received'
  return 'none'
}

export function searchUsers(query) {
  const q = query.trim().toLowerCase().replace(/^@/, '')
  if (!q) return []
  return users
    .filter((u) => u.username !== currentUser.username && u.username.includes(q))
    .map((u) => ({ ...u, status: getStatus(u.username) }))
}

export function respond(requestId, accept) {
  const req = state.requests.find((r) => r.id === requestId)
  if (!req || req.status !== 'pending') return
  const other = req.from === currentUser.username ? req.to : req.from

  state = {
    friends: accept && !state.friends.includes(other) ? [...state.friends, other] : state.friends,
    requests: state.requests.map((r) =>
      r.id === requestId ? { ...r, status: accept ? 'accepted' : 'declined' } : r,
    ),
  }

  if (accept && req.skill) {
    const sender = findUser(req.from)
    const who = req.from === currentUser.username ? currentUser.name : sender ? sender.name : req.from
    sendMessage(`dm-${other}`, who, `Hi! I'd like to talk about: ${req.skill.title}`)
  }
  save()
}

export function sendRequest(toUsername, skill = null) {
  if (getStatus(toUsername) !== 'none') return
  const id = Date.now()
  state = {
    ...state,
    requests: [
      ...state.requests,
      { id, from: currentUser.username, to: toUsername, skill, status: 'pending', time: id },
    ],
  }
  save()
  // Demo only: remove this when the backend exists. The other person "accepts" after 3 seconds.
  setTimeout(() => respond(id, true), 3000)
}