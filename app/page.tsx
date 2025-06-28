"use client"

import { FeaturedBuildCard } from "@/components/featured-build-card"
import { SiteHeader } from "@/components/site-header"
import { FilterSidebar } from "@/components/filter-sidebar"
import { FilterControls } from "@/components/filter-controls"
import { SearchBar } from "@/components/search-bar"
import { Timeline } from "@/components/timeline"
import { FractalBackground } from "@/components/fractal-background"
import { useSearchAndFilters } from "@/hooks/use-search-and-filters"
import projectsData from "@/data/projects.json"

export default function Component() {
  const { projects } = projectsData

  // Separate featured and timeline items
  const featuredBuilds = projects.filter((project) => project.featured)
  const timelineItems = projects

  const {
    searchQuery,
    setSearchQuery,
    availableFilters,
    activeFilters,
    filteredAndSearchedItems,
    toggleFilter,
    handleTagClick,
    clearFilters,
    hasActiveFilters,
    hasSearchQuery,
  } = useSearchAndFilters(timelineItems)

  return (
    <div className="min-h-screen bg-white relative">
      <FractalBackground />

      <div className="relative z-10">
        <SiteHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Builds - without title */}
          <div className="mb-12">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {featuredBuilds.map((build) => (
                <FeaturedBuildCard key={build.id} build={build} />
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <FilterSidebar filters={availableFilters} activeFilters={activeFilters} onFilterChange={toggleFilter} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
              <FilterControls
                hasActiveFilters={hasActiveFilters}
                activeFilters={activeFilters}
                onClearFilters={clearFilters}
              />
              <Timeline items={filteredAndSearchedItems} onTagClick={handleTagClick} />

              {filteredAndSearchedItems.length === 0 && (hasActiveFilters || hasSearchQuery) && (
                <div className="text-center py-12">
                  <p className="text-purple-700 text-lg">
                    No projects match your current {hasSearchQuery ? "search" : "filters"}.
                  </p>
                  <p className="text-scarlet-600 text-sm mt-2">
                    Try adjusting your {hasSearchQuery ? "search terms" : "filters"} or clearing them to see more
                    results.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
