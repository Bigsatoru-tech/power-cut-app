import { supabase } from './supabaseClient'

export async function signUpUser({ email, password, username, phone, area }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: username.trim().toLowerCase(), phone, area } },
  })
  if (error) {
    if (/already registered/i.test(error.message)) {
      throw new Error('This email is already used by another account. Log in instead.')
    }
    if (/database error/i.test(error.message)) {
      throw new Error('That username is already taken or not valid (3-20 letters, numbers or _)')
    }
    throw new Error(error.message)
  }
  // With email confirmation on, Supabase hides duplicates by returning a user with no identities
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error('This email is already used by another account. Log in instead.')
  }
  return data
}

export async function signInUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error('Wrong email or password')
  return data
}