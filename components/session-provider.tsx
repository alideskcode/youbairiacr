"use client"

// Supabase auth doesn't require a session provider wrapper
// This component is kept for backwards compatibility

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
} 