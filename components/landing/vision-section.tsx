"use client"

import { motion } from "framer-motion"

export function VisionSection() {
  return (
    <section className="bg-[#F8FAFC] py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm md:p-16">
          <p className="text-sm uppercase tracking-[0.28em] text-[#6F263D]">Why this matters</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Youbairia helps people start modern internet businesses that feel genuine, structured, and sustainable.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            We believe a digital business should be more than just a storefront. It should be an experience that inspires customers, supports creators, and scales with clarity.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
