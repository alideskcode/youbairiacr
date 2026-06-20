"use client"

import { motion } from "framer-motion"

const stats = [
  { label: "Creators", value: "1.7k+" },
  { label: "Digital businesses", value: "890+" },
  { label: "Products sold", value: "48k+" },
  { label: "Communities active", value: "12k+" },
]

export function TrustStrip() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="rounded-[2rem] border border-slate-200 bg-slate-50/90 px-6 py-8 shadow-sm md:px-10 md:py-10">
          <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#6F263D]">Trusted by ambitious founders</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Built for people who want a premium internet business.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white/90 px-4 py-5 text-center shadow-sm">
                  <p className="text-2xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
