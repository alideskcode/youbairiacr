import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase/server"

export async function getAdminSupabaseClient() {
  const serviceClient = createServiceSupabaseClient()
  if (serviceClient) return serviceClient
  return createServerSupabaseClient()
}
