"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function FinalCtaSection() {
  return (
    <section className="bg-gradient-to-r from-[#6F263D]/95 to-slate-900/90 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-[#6F263D]/10 backdrop-blur-xl md:p-16">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-200">Ready to make it real?</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                Start your business on the internet with confidence.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200/90 sm:text-base">
                Join a premium platform designed for creators, founders, and digital-first businesses who want a polished launch experience.
              </p>
            </div>
            <Link href="/signup">
              <Button size="lg" className="min-w-[180px] bg-white text-[#6F263D] hover:bg-slate-100">
                Create account
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
