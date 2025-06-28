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
  url?: string
  githubUrl?: string
  featured?: boolean
}

interface Filters {
  type: string[]
  tutorials: string[]
  categories: string[]
}

export function useSearchAndFilters(items: TimelineItem[]) {
  const [searchQuery, setSearchQuery] = useState("")
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

  // Handle tag clicks from content cards
  const handleTagClick = (tag: string) => {
    // Determine which section this tag belongs to
    let section = "categories" // default
    if (["public", "private", "prototype", "personal"].includes(tag)) {
      section = "type"
    } else if (["video", "template", "live tweet"].includes(tag)) {
      section = "tutorials"
    }

    toggleFilter(section, tag)
  }

  const filteredAndSearchedItems = useMemo(() => {
    let filtered = items

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Apply category filters
    const hasActiveFilters = Object.values(activeFilters).some((filters) => filters.length > 0)
    if (hasActiveFilters) {
      filtered = filtered.filter((item) => {
        // Check type filter
        const typeMatch = activeFilters.type.length === 0 || activeFilters.type.includes(item.status)

        // Check categories filter (tags)
        const categoryMatch =
          activeFilters.categories.length === 0 ||
          activeFilters.categories.some((category) => item.tags.includes(category))

        // Check tutorials filter (also in tags)
        const tutorialMatch =
          activeFilters.tutorials.length === 0 ||
          activeFilters.tutorials.some((tutorial) => item.tags.includes(tutorial))

        return typeMatch && categoryMatch && tutorialMatch
      })
    }

    return filtered
  }, [items, searchQuery, activeFilters])

  const clearFilters = () => {
    setActiveFilters({
      type: [],
      tutorials: [],
      categories: [],
    })
  }

  const clearSearch = () => {
    setSearchQuery("")
  }

  const clearAll = () => {
    clearFilters()
    clearSearch()
  }

  return {
    searchQuery,
    setSearchQuery,
    availableFilters,
    activeFilters,
    filteredAndSearchedItems,
    toggleFilter,
    handleTagClick,
    clearFilters,
    clearSearch,
    clearAll,
    hasActiveFilters: Object.values(activeFilters).some((filters) => filters.length > 0),
    hasSearchQuery: searchQuery.trim().length > 0,
  }
}
