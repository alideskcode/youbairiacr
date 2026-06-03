type Bucket = { count: number; resetAt: number }

const store = new Map<string, Bucket>()

export function rateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const bucket = store.get(key)

  if (!bucket || now > bucket.resetAt) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, resetAt }
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt }
  }

  bucket.count += 1
  store.set(key, bucket)
  return { ok: true, remaining: limit - bucket.count, resetAt: bucket.resetAt }
}
