"use client"

import { motion } from "framer-motion"

const points = [
  "Instant stores for any business",
  "Digital products and downloads",
  "Creator communities",
  "Marketing campaigns",
]

export function TrustStrip() {
  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45 }}
          className="grid gap-3 border-y border-black/10 py-5 text-sm text-neutral-600 md:grid-cols-4"
        >
          {points.map((point) => (
            <div key={point} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              <span>{point}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
