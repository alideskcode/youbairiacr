import type { CampaignEarning, PlatformKey } from "@/lib/types/campaign"
import { PLATFORMS } from "@/lib/types/campaign"

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPayout(earnings: CampaignEarning[] | undefined): string {
  if (!earnings?.length) return "—"
  const max = Math.max(...earnings.map((e) => Number(e.payout_per_1k)))
  return `${formatCurrency(max)} / 1K views`
}

export function platformLabel(key: PlatformKey | string): string {
  return PLATFORMS.find((p) => p.key === key)?.label ?? key
}

export function creatorDisplayName(
  creator: { full_name?: string | null; email?: string | null } | null | undefined
): string {
  if (!creator) return "Creator"
  return creator.full_name?.trim() || creator.email?.split("@")[0] || "Creator"
}
