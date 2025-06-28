"use client"

import { Badge } from "@/components/ui/badge"

interface FilterSidebarProps {
  filters: {
    type: string[]
    tutorials: string[]
    categories: string[]
  }
  activeFilters: {
    type: string[]
    tutorials: string[]
    categories: string[]
  }
  onFilterChange: (section: string, value: string) => void
}

const filterSections = [
  {
    key: "type",
    title: "type",
    items: [
      { label: "public", className: "bg-sea_green-100 text-sea_green-800" },
      { label: "private", className: "text-purple-600" },
      { label: "prototype", className: "bg-arctic_blue-100 text-arctic_blue-800" },
      { label: "personal", className: "bg-cerise-100 text-cerise-800" },
    ],
  },
  {
    key: "tutorials",
    title: "tutorials",
    items: [
      { label: "video", className: "bg-pistachio-100 text-pistachio-800" },
      { label: "template", className: "text-purple-600" },
      { label: "live tweet", className: "text-purple-600" },
    ],
  },
  {
    key: "categories",
    title: "categories",
    items: [
      { label: "ai", className: "text-phthalo_blue-700" },
      { label: "backend", className: "text-purple-600" },
      { label: "data", className: "text-arctic_blue-700" },
      { label: "automation", className: "text-pistachio-700" },
      { label: "optimization", className: "text-scarlet-700" },
      { label: "no code", className: "text-cerise-700" },
      { label: "python", className: "text-phthalo_blue-600" },
      { label: "javascript", className: "text-gold-700" },
      { label: "api", className: "text-sea_green-700" },
    ],
  },
]

export function FilterSidebar({ filters, activeFilters, onFilterChange }: FilterSidebarProps) {
  const isFilterActive = (section: string, value: string) => {
    return activeFilters[section as keyof typeof activeFilters]?.includes(value) || false
  }

  const getFilterVariant = (section: string, value: string) => {
    return isFilterActive(section, value) ? "default" : "outline"
  }

  return (
    <div className="space-y-6">
      {filterSections.map((section) => (
        <div key={section.key}>
          <h4 className="font-medium text-phthalo_blue-800 mb-3">{section.title}</h4>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {section.items.map((item) => (
                <Badge
                  key={item.label}
                  variant={getFilterVariant(section.key, item.label)}
                  className={`cursor-pointer transition-colors hover:bg-cerise-100 hover:text-cerise-800 ${
                    isFilterActive(section.key, item.label)
                      ? "bg-phthalo_blue-600 text-phthalo_blue-50 border-phthalo_blue-600"
                      : item.className
                  }`}
                  onClick={() => onFilterChange(section.key, item.label)}
                >
                  {item.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
