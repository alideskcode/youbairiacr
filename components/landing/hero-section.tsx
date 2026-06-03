"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Globe2, Layers, Sparkles, Rocket } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-20 md:pt-24 md:pb-28">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#6F263D]/10 to-transparent pointer-events-none" />
      <div className="absolute right-[-20%] top-16 h-72 w-72 rounded-full bg-[#6F263D]/5 blur-3xl opacity-90" />
      <div className="absolute left-[-10%] top-52 h-52 w-52 rounded-full bg-sky-300/10 blur-3xl opacity-80" />
      <div className="container mx-auto px-4">
        <motion.div variants={container} initial="hidden" animate="visible" className="relative overflow-hidden rounded-[2rem] border border-[#6F263D]/10 bg-white shadow-[0_40px_120px_rgba(111,38,61,0.08)] px-6 py-12 md:px-12 md:py-16">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#6F263D]/8 via-transparent pointer-events-none" />
          <motion.div variants={item} className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex rounded-full border border-[#6F263D]/12 bg-[#6F263D]/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.3em] text-[#6F263D] backdrop-blur">
               WANNA TO DO SOMETHING BIG?
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Where From Internet Business Starts. Build Your Digital Store in Minutes. 
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg md:text-xl">
              Youbairia makes it simple to launch your storefront, manage campaigns, and grow a digital business that feels polished from day one.
            </p>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="min-w-[170px] bg-[#6F263D] text-white hover:bg-[#5c2034]">
                Start Building
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="min-w-[170px] border-[#6F263D] text-[#6F263D] hover:bg-[#6F263D]/5">
                Create Your Space
              </Button>
            </Link>
          </motion.div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <motion.div variants={item} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 shadow-sm backdrop-blur-sm">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6F263D]/10 text-[#6F263D]">
                <Globe2 className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Launch globally</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Set up a polished storefront and sell digital products across the internet instantly.
              </p>
            </motion.div>
            <motion.div variants={item} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 shadow-sm backdrop-blur-sm">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <Layers className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Built for creators</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep your tools simple, your campaigns live, and your audience engaged with a modern workflow.
              </p>
            </motion.div>
            <motion.div variants={item} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 shadow-sm backdrop-blur-sm">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900">Modern brand motion</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Soft motion, premium spacing, and a refined layout that feels like a launch-ready startup brand.
              </p>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute right-6 top-12 hidden h-48 w-48 rounded-[2rem] border border-white/60 bg-white/70 shadow-[0_22px_80px_rgba(0,0,0,0.08)] blur-sm md:block" />
          <div className="pointer-events-none absolute left-6 bottom-12 hidden h-36 w-36 rounded-[1.75rem] border border-white/60 bg-sky-50/70 shadow-[0_18px_60px_rgba(56,189,248,0.12)] blur-sm md:block" />
          <div className="pointer-events-none absolute right-8 bottom-16 hidden h-28 w-28 rounded-[1.5rem] border border-white/50 bg-[#6F263D]/8 blur-sm md:block" />
        </motion.div>
      </div>
    </section>
  )
}
