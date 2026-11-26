import { supabase } from './supabaseClient'
import { cleanPhone, isValidPhone, PHONE_HINT } from './phone'

export async function signUpUser({ email, password, username, phone }) {
  if (!isValidPhone(phone)) throw new Error(PHONE_HINT)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: username.trim().toLowerCase(), phone: cleanPhone(phone) } },
  })
  if (error) {
    if (/already registered/i.test(error.message)) {
      throw new Error('This email is already used by another account. Log in instead.')
    }
    if (/database error/i.test(error.message)) {
      throw new Error(
        'Could not create the account. The username may be taken or not valid (3-20 letters, numbers or _), or the phone number is not valid.',
      )
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

// Existing users who have no phone number add it once (the database checks it again)
export async function saveMyPhone(phone) {
  if (!isValidPhone(phone)) throw new Error(PHONE_HINT)
  const { error } = await supabase.rpc('set_my_phone', { p_phone: cleanPhone(phone) })
  if (error) throw new Error(error.message)
}