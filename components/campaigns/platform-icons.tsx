import { PLATFORMS, type PlatformKey } from "@/lib/types/campaign"
import { cn } from "@/lib/utils"

const PLATFORM_COLORS: Record<PlatformKey, string> = {
  tiktok: "bg-black text-white",
  instagram: "bg-gradient-to-br from-purple-600 to-pink-500 text-white",
  youtube_shorts: "bg-red-600 text-white",
  facebook_reels: "bg-blue-600 text-white",
}

export function PlatformIcons({
  platforms,
  className,
}: {
  platforms: PlatformKey[] | string[]
  className?: string
}) {
  const keys = platforms.filter((p) =>
    PLATFORMS.some((x) => x.key === p)
  ) as PlatformKey[]

  if (!keys.length) return null

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {keys.map((key) => {
        const label = PLATFORMS.find((p) => p.key === key)?.label ?? key
        return (
          <span
            key={key}
            className={cn(
              "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              PLATFORM_COLORS[key]
            )}
            title={label}
          >
            {label.split(" ")[0]}
          </span>
        )
      })}
    </div>
  )
}
