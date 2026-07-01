"use client"

import { motion } from "framer-motion"
import { BookOpen, Bot, Boxes, HelpCircle, Megaphone, Settings, Users, Wrench } from "lucide-react"

const features = [
  {
    title: "Courses",
    description: "Package knowledge into structured learning products with a storefront built for trust.",
    icon: BookOpen,
  },
  {
    title: "Software",
    description: "Sell scripts, apps, templates, tools, licenses, and technical resources from one place.",
    icon: Wrench,
  },
  {
    title: "AI tools",
    description: "Launch prompt packs, AI workflows, automation kits, agents, and digital tool bundles.",
    icon: Bot,
  },
  {
    title: "M. campaigns",
    description: "Run marketing campaigns that help products reach creators, buyers, and niche audiences.",
    icon: Megaphone,
  },
  {
    title: "Community",
    description: "Create paid or open communities around your courses, products, services, or expertise.",
    icon: Users,
  },
  {
    title: "Create yours",
    description: "Open a store for your business, brand, or personal knowledge product in minutes.",
    icon: Boxes,
  },
  {
    title: "Settings",
    description: "Manage your store identity, offers, product details, audience, and growth workflow.",
    icon: Settings,
  },
  {
    title: "Help",
    description: "Give buyers a clearer path to trust with support, policies, and product information.",
    icon: HelpCircle,
  },
]

export function FeatureGrid() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">What you can build</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-black sm:text-5xl">
            One marketplace for digital products, stores, communities, and growth.
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-600">
            Youbairia gives creators, businesses, and operators a clean place to sell knowledge, software, tools, downloads, and memberships.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="bg-white p-6"
              >
                <Icon className="h-5 w-5 text-black" />
                <h3 className="mt-5 text-lg font-semibold text-black">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
