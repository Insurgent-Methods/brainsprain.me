"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mulberry-500 h-4 w-4" />
      <Input
        type="text"
        placeholder="Type here to search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 py-3 text-mulberry-700 border-cerulean-300 focus:border-blue-500 focus:ring-blue-200 bg-white/80 backdrop-blur-sm"
      />
    </div>
  )
}
