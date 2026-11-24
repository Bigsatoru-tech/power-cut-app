import { supabase } from './supabaseClient'

export async function signUpUser({ email, password, username, phone, area }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: username.trim().toLowerCase(), phone, area } },
  })
  if (error) {
    if (/database error/i.test(error.message)) {
      throw new Error('That username is taken or not valid (3-20 letters, numbers or _)')
    }
    throw new Error(error.message)
  }
  return data
}

export async function signInUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error('Wrong email or password')
  return data
}