"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinalCtaSection() {
  return (
    <section className="bg-white pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="rounded-lg bg-black px-6 py-12 text-white md:px-12 md:py-16"
        >
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-400">Create yours</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Start with one product. Grow into a marketplace business.
              </h2>
              <p className="mt-5 text-lg leading-8 text-neutral-300">
                Launch a store for your course, software, AI tool, community, ebook, PDF, service knowledge, or digital product catalog.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <Button asChild size="lg" className="h-12 rounded-md bg-white px-6 text-black hover:bg-neutral-200">
                <Link href="/signup">
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-md border-white/20 bg-transparent px-6 text-white hover:bg-white/10">
                <Link href="/contact-us">Get help</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
