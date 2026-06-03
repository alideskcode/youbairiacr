import { supabase } from "@/lib/supabase/client"

export async function getAccessToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

export async function authHeaders(): Promise<HeadersInit> {
  const token = await getAccessToken()
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : { "Content-Type": "application/json" }
}
