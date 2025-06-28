"use client"

import { useState, useMemo } from "react"

interface TimelineItem {
  id: string
  title: string
  description: string
  date: string
  status: string
  statusColor: string
  tags: string[]
  side: "left" | "right"
}

interface Filters {
  type: string[]
  tutorials: string[]
  categories: string[]
}

export function useFilters(items: TimelineItem[]) {
  const [activeFilters, setActiveFilters] = useState<Filters>({
    type: [],
    tutorials: [],
    categories: [],
  })

  // Extract all unique filter values from the data
  const availableFilters = useMemo(() => {
    const types = new Set<string>()
    const tutorials = new Set<string>()
    const categories = new Set<string>()

    items.forEach((item) => {
      types.add(item.status)
      item.tags.forEach((tag) => {
        // Categorize tags
        if (["video", "template", "live tweet"].includes(tag)) {
          tutorials.add(tag)
        } else {
          categories.add(tag)
        }
      })
    })

    return {
      type: Array.from(types),
      tutorials: Array.from(tutorials),
      categories: Array.from(categories),
    }
  }, [items])

  const toggleFilter = (section: string, value: string) => {
    setActiveFilters((prev) => {
      const sectionFilters = prev[section as keyof Filters] || []
      const isActive = sectionFilters.includes(value)

      return {
        ...prev,
        [section]: isActive ? sectionFilters.filter((f) => f !== value) : [...sectionFilters, value],
      }
    })
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // If no filters are active, show all items
      const hasActiveFilters = Object.values(activeFilters).some((filters) => filters.length > 0)
      if (!hasActiveFilters) return true

      // Check type filter
      const typeMatch = activeFilters.type.length === 0 || activeFilters.type.includes(item.status)

      // Check categories filter (tags)
      const categoryMatch =
        activeFilters.categories.length === 0 ||
        activeFilters.categories.some((category) => item.tags.includes(category))

      // Check tutorials filter (also in tags)
      const tutorialMatch =
        activeFilters.tutorials.length === 0 || activeFilters.tutorials.some((tutorial) => item.tags.includes(tutorial))

      return typeMatch && categoryMatch && tutorialMatch
    })
  }, [items, activeFilters])

  const clearFilters = () => {
    setActiveFilters({
      type: [],
      tutorials: [],
      categories: [],
    })
  }

  return {
    availableFilters,
    activeFilters,
    filteredItems,
    toggleFilter,
    clearFilters,
    hasActiveFilters: Object.values(activeFilters).some((filters) => filters.length > 0),
  }
}
