"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"

const workflow = [
  {
    title: "Create your store",
    description: "Set up a public digital storefront for your business, personal brand, course, software, or community.",
  },
  {
    title: "Add digital products",
    description: "Sell courses, PDFs, ebooks, software files, AI tools, templates, and knowledge products.",
  },
  {
    title: "Grow with campaigns",
    description: "Use marketing campaigns and community workflows to bring attention to what you sell.",
  },
]

const productRows = [
  ["Course", "Launch system", "$99"],
  ["Software", "Automation toolkit", "$149"],
  ["AI tool", "Prompt workflow", "$39"],
  ["Community", "Founder circle", "$19/mo"],
]

export function ShowcaseSection() {
  return (
    <section className="bg-neutral-950 py-16 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-400">Marketplace system</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              From idea to digital business without scattered tools.
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-300">
              Youbairia brings the storefront, product catalog, community layer, and campaign engine into a single marketplace experience.
            </p>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg border border-white/10 bg-white p-5 text-black"
            >
              <div className="flex items-center justify-between border-b border-black/10 pb-4">
                <div>
                  <p className="text-sm font-semibold">Digital storefront</p>
                  <p className="mt-1 text-xs text-neutral-500">Products, community, campaigns</p>
                </div>
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div className="mt-4 divide-y divide-black/10">
                {productRows.map(([type, name, price]) => (
                  <div key={name} className="grid grid-cols-[0.8fr_1fr_auto] gap-3 py-3 text-sm">
                    <span className="text-neutral-500">{type}</span>
                    <span className="font-medium">{name}</span>
                    <span className="font-semibold">{price}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3">
              {workflow.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
                >
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <h3 className="mt-5 font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
