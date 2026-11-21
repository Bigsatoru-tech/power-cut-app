// MOCK ONLY. The real check must happen on the backend.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function adminSignIn(email, password) {
  await delay(600)
  if (!email || !password) throw new Error('Enter your email and password')
  localStorage.setItem('adminLoggedIn', 'yes')
  return { email }
}

export async function adminSignUp(email, password) {
  await delay(600)
  if (!email || !password) throw new Error('Enter your email and password')
  localStorage.setItem('adminLoggedIn', 'yes')
  return { email }
}

export function adminSignOut() {
  localStorage.removeItem('adminLoggedIn')
}

export function isAdminLoggedIn() {
  return localStorage.getItem('adminLoggedIn') === 'yes'
}