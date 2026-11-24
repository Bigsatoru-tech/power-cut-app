import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  document.body.innerHTML =
    '<div style="padding:24px;font-family:sans-serif;color:#f8fafc;background:#0f172a;min-height:100vh">' +
    '<h2>Supabase keys are missing</h2>' +
    '<p>Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (in .env.local on your laptop, or in Vercel settings online), then restart.</p>' +
    '</div>'
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(url, key)