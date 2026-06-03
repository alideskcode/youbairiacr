"use client"

import { motion } from "framer-motion"

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export function ShowcaseSection() {
  return (
    <section className="relative bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-[#6F263D]">Product experience</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                A refined workspace for selling, analytics, and community growth.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                Your dashboard feels premium, fast, and easy to trust—built around the actions every creator and brand needs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="rounded-[2rem] border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">Dashboard</span>
                  <span>Live</span>
                </div>
                <div className="space-y-4">
                  <div className="h-2.5 w-24 rounded-full bg-[#6F263D]/10" />
                  <div className="grid gap-3">
                    <div className="h-4 rounded-full bg-slate-200" />
                    <div className="h-4 rounded-full bg-slate-200/80 w-5/6" />
                    <div className="h-24 rounded-[1.5rem] bg-white p-4 shadow-sm">
                      <div className="h-2 rounded-full bg-slate-300/80 w-3/4 mb-4" />
                      <div className="grid gap-2">
                        <div className="h-3 rounded-full bg-[#6F263D]/10 w-2/3" />
                        <div className="h-3 rounded-full bg-[#6F263D]/10 w-1/3" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.08 }} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">Storefront</span>
                  <span>Preview</span>
                </div>
                <div className="space-y-4">
                  <div className="h-2.5 w-28 rounded-full bg-[#6F263D]/10" />
                  <div className="h-40 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="h-3 w-24 rounded-full bg-slate-300" />
                    <div className="mt-5 grid gap-3">
                      <div className="h-10 rounded-[1.25rem] bg-white shadow-sm" />
                      <div className="h-10 rounded-[1.25rem] bg-white shadow-sm" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.16 }} className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-900/10">
            <div className="mb-6 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
              <span className="text-sm uppercase tracking-[0.24em] text-slate-300">Analytics</span>
              <span className="rounded-full bg-[#6F263D] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">Live</span>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold">82.4%</p>
                  <p className="text-sm text-slate-400">weekly conversion</p>
                </div>
                <div className="rounded-3xl bg-[#6F263D]/10 px-3 py-1 text-sm font-medium text-[#6F263D]">
                  +14.2%
                </div>
              </div>
              <div className="rounded-[1.75rem] bg-slate-900/80 p-4">
                <div className="h-2 rounded-full bg-slate-700" />
                <div className="mt-6 flex items-end gap-3">
                  <div className="h-28 w-full rounded-[1rem] bg-gradient-to-t from-[#6F263D] to-[#6F263D]/30" />
                  <div className="h-20 w-full rounded-[1rem] bg-gradient-to-t from-sky-500 to-sky-500/30" />
                  <div className="h-32 w-full rounded-[1rem] bg-gradient-to-t from-emerald-400 to-emerald-400/30" />
                  <div className="h-16 w-full rounded-[1rem] bg-gradient-to-t from-slate-700 to-slate-700/30" />
                </div>
              </div>
              <div className="grid gap-3 rounded-[1.75rem] bg-slate-900/80 p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Average order value</span>
                  <span>$118</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Monthly visitors</span>
                  <span>24.1k</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
