"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FilterControlsProps {
  hasActiveFilters: boolean
  activeFilters: {
    type: string[]
    tutorials: string[]
    categories: string[]
  }
  onClearFilters: () => void
}

export function FilterControls({ hasActiveFilters, activeFilters, onClearFilters }: FilterControlsProps) {
  if (!hasActiveFilters) return null

  return (
    <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-vermillion-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([section, filters]) =>
            filters.map((filter) => (
              <Badge
                key={`${section}-${filter}`}
                variant="secondary"
                className="text-xs bg-cerulean-100 text-cerulean-800"
              >
                {filter}
              </Badge>
            )),
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-mulberry-700 hover:text-mulberry-900 hover:bg-vermillion-100"
        >
          Clear All
        </Button>
      </div>
    </div>
  )
}
