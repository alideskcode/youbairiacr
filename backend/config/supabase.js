const { createClient } = require("@supabase/supabase-js")
const env = require("./env")

const authClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Service role is used only on the backend so protected columns like content_link
// can stay out of public/client Supabase access.
const db = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

module.exports = {
  authClient,
  db,
}
