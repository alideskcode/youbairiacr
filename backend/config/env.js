const dotenv = require("dotenv")

dotenv.config({ path: ".env.local" })
dotenv.config()

const required = [
  ["SUPABASE_URL", process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL],
  ["SUPABASE_ANON_KEY", process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
  ["SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY],
]

for (const [name, value] of required) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
}

module.exports = {
  port: Number(process.env.BACKEND_PORT || process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.BACKEND_CORS_ORIGIN || "http://localhost:3000",
  supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}
