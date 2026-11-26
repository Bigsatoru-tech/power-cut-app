// Phone rules. Keep in sync with public.is_valid_phone() in the database.
// Accepts Nigerian numbers (0803..., 234803..., +234803...) or any international +number.

export function cleanPhone(value) {
  return (value || '').replace(/[\s()-]/g, '')
}

export function isValidPhone(value) {
  const c = cleanPhone(value)
  return /^(\+?234|0)[789][01][0-9]{8}$/.test(c) || /^\+[1-9][0-9]{7,14}$/.test(c)
}

export const PHONE_HINT = 'Enter a valid phone number, like 0803 123 4567 or +234 803 123 4567.'