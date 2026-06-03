"use client"

import { motion } from "framer-motion"
import { Package, Globe2, Zap, ArrowUpRight } from "lucide-react"

const features = [
  {
    title: "Sell digital products",
    description: "Launch polished listings, accept payments, and grow recurring revenue with a premium storefront.",
    icon: Package,
  },
  {
    title: "Build internet-native brands",
    description: "Create a modern business identity that feels crafted for the web, creators, and scale.",
    icon: Globe2,
  },
  {
    title: "Campaign tools for creators",
    description: "Design, launch, and manage seller campaigns from one elegant dashboard.",
    icon: Zap,
  },
  {
    title: "Move offline work online",
    description: "Turn your existing services into a digital business that can reach customers anywhere.",
    icon: ArrowUpRight,
  },
]

export function FeatureGrid() {
  return (
    <section className="bg-slate-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-[#6F263D]">What Youbairia does</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Powerful tools for a new generation of internet businesses.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Focus on what matters most—selling, campaigning, and growing. We handle the refined experience that makes your brand feel premium.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#6F263D]/10 text-[#6F263D] shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
