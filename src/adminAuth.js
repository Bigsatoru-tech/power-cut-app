import { supabase } from './supabaseClient'

const FLAG = 'adminLoggedIn'

export async function adminSignIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error('Wrong email or password')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, admin_requested')
    .eq('id', data.user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    await supabase.auth.signOut()
    throw new Error(
      profile && profile.admin_requested
        ? 'Your admin account is waiting for approval'
        : 'This account is not an admin',
    )
  }
  localStorage.setItem(FLAG, 'yes')
  return data.user
}

export async function adminSignUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { admin_request: true } },
  })
  if (error) throw new Error(error.message)
  await supabase.auth.signOut() // no access until an admin approves
  return data.user
}

export async function adminSignOut() {
  await supabase.auth.signOut()
  localStorage.removeItem(FLAG)
}

export function isAdminLoggedIn() {
  return localStorage.getItem(FLAG) === 'yes'
}