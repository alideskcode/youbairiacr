export function getAdminEmails(): string[] {
  const raw =
    process.env.ADMIN_EMAILS ??
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ??
    "admin@example.com"

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}
