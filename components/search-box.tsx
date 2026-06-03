"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBox() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isExpanded ? (
          <motion.form
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "300px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            onSubmit={handleSearch}
            className="flex items-center gap-2"
          >
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsExpanded(false)
                setSearchQuery("")
              }}
              className="h-9 w-9"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(true)}
              className="h-9 w-9"
            >
              <Search className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 