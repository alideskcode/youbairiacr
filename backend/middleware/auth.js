const { authClient } = require("../config/supabase")

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : null

  if (!token) {
    return res.status(401).json({ error: "Authentication required" })
  }

  const { data, error } = await authClient.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }

  req.user = data.user
  req.accessToken = token
  return next()
}

module.exports = {
  requireAuth,
}
