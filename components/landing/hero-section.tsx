"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check, Command, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

const productTypes = ["Courses", "Software", "AI tools", "Ebooks", "PDFs", "Communities"]

export function HeroSection() {
  return (
    <section className="bg-white pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
        >
          <div>
            <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Digital marketplace for internet businesses
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-8 max-w-4xl text-5xl font-semibold tracking-tight text-black sm:text-6xl md:text-7xl"
            >
              Build your digital business on Youbairia.
            </motion.h1>

            <motion.p variants={item} className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600 md:text-xl">
              Buy and sell courses, software, AI tools, ebooks, PDFs, communities, and every kind of digital product from one clean marketplace.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-md bg-black px-6 text-white hover:bg-neutral-800">
                <Link href="/signup">
                  Create yours
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-md border-black/15 px-6 text-black hover:bg-neutral-50">
                <Link href="/products">Explore products</Link>
              </Button>
            </motion.div>

            <motion.div variants={item} className="mt-8 flex flex-wrap gap-2">
              {productTypes.map((type) => (
                <span key={type} className="rounded-full border border-black/10 px-3 py-1 text-sm text-neutral-700">
                  {type}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div variants={item} className="relative">
            <div className="rounded-lg border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Command className="h-4 w-4 text-black" />
                  <span className="text-sm font-semibold text-black">Youbairia store</span>
                </div>
                <span className="rounded-full bg-black px-2.5 py-1 text-xs font-medium text-white">Live</span>
              </div>
              <div className="p-5">
                <div className="rounded-md border border-black/10 bg-neutral-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Storefront</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black">Knowledge, tools, and community in one place.</h2>
                  <div className="mt-6 grid gap-3">
                    {["Course bundle", "AI automation kit", "Paid community"].map((title, index) => (
                      <div key={title} className="flex items-center justify-between rounded-md border border-black/10 bg-white p-4">
                        <div>
                          <p className="font-medium text-black">{title}</p>
                          <p className="mt-1 text-sm text-neutral-500">{index === 0 ? "Learning product" : index === 1 ? "Software resource" : "Membership"}</p>
                        </div>
                        <span className="text-sm font-semibold text-black">${[49, 129, 19][index]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {["Instant store", "M. campaigns", "Community"].map((label) => (
                    <div key={label} className="rounded-md border border-black/10 p-3">
                      <Check className="h-4 w-4 text-black" />
                      <p className="mt-2 text-sm font-medium text-black">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
