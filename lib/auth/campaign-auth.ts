import { createServerSupabaseClient } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin-auth"
import type { ProfileRole } from "@/lib/types/campaign"

export type AuthContext = {
  userId: string
  email: string
  role: ProfileRole
  isSeller: boolean
  isAdmin: boolean
}

export async function getAuthContext(
  bearerToken?: string | null
): Promise<AuthContext | null> {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
    error,
  } = bearerToken
    ? await supabase.auth.getUser(bearerToken)
    : await supabase.auth.getUser()

  if (error || !user?.id) return null

  const email = user.email ?? ""
  let role: ProfileRole = "user"

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role === "seller" || profile?.role === "admin") {
    role = profile.role
  } else if (isAdminEmail(email)) {
    role = "admin"
  }

  return {
    userId: user.id,
    email,
    role,
    isSeller: role === "seller" || role === "admin",
    isAdmin: role === "admin" || isAdminEmail(email),
  }
}

export function requireAuth(ctx: AuthContext | null) {
  return ctx !== null
}

export function requireSeller(ctx: AuthContext | null) {
  return ctx?.isSeller === true
}
