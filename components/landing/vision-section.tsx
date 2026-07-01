"use client"

import { motion } from "framer-motion"

const audiences = [
  "Creators selling knowledge",
  "Businesses launching digital stores",
  "Developers selling software",
  "Operators building niche communities",
  "Brands running marketing campaigns",
]

export function VisionSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
          className="grid gap-10 border-b border-black/10 pb-16 lg:grid-cols-[1fr_0.8fr]"
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">About Youbairia</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              A home for people turning knowledge, tools, and communities into digital products.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-neutral-600">
              Youbairia enables people to buy, sell, and build around digital products. A business can create an instant store, sell courses or software, publish ebooks and PDFs, offer AI tools, build a community, and use campaigns to reach the right buyers.
            </p>
            <div className="mt-8 grid gap-3">
              {audiences.map((audience) => (
                <div key={audience} className="flex items-center justify-between border-t border-black/10 py-3 text-sm">
                  <span className="font-medium text-black">{audience}</span>
                  <span className="text-neutral-400">Ready</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
