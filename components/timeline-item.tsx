"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"

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
}

interface TimelineItemProps {
  item: TimelineItem
  onTagClick: (tag: string) => void
}

export function TimelineItem({ item, onTagClick }: TimelineItemProps) {
  const isLeft = item.side === "left"

  const ContentCard = () => (
    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-arctic_blue-100 bg-white/95 backdrop-blur-sm">
      <CardContent className="p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <Link
            href={item.url || "https://www.yohei.me/"}
            className="font-medium text-phthalo_blue-800 hover:text-phthalo_blue-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.title}
          </Link>
          <Badge
            variant="secondary"
            className={`${item.statusColor} text-xs ml-2 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity`}
            onClick={() => onTagClick(item.status)}
          >
            {item.status}
          </Badge>
        </div>
        <p className="text-sm text-purple-700 mb-4 pr-16">{item.description}</p>

        {/* Tags container with proper wrapping and click handlers */}
        <div className="flex flex-wrap gap-2 mb-2 pr-16">
          {item.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs border-pistachio-300 text-pistachio-700 hover:bg-pistachio-50 cursor-pointer transition-colors"
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Links anchored to bottom right */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          <Link
            href={item.url || "https://www.yohei.me/"}
            className="text-arctic_blue-600 hover:text-arctic_blue-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <Link
            href={item.githubUrl || "https://github.com/yoheinakajima"}
            className="text-purple-600 hover:text-purple-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="relative flex items-center">
      {/* Timeline dot - made more visible */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-scarlet-400 rounded-full z-10 shadow-lg"></div>

      {isLeft ? (
        <>
          <div className="w-1/2 pr-8">
            <ContentCard />
          </div>
          <div className="w-1/2 pl-8 flex items-center">
            <div className="text-2xl font-bold text-scarlet-600">{item.date}</div>
          </div>
        </>
      ) : (
        <>
          <div className="w-1/2 pr-8 flex items-center justify-end">
            <div className="text-2xl font-bold text-scarlet-600">{item.date}</div>
          </div>
          <div className="w-1/2 pl-8">
            <ContentCard />
          </div>
        </>
      )}
    </div>
  )
}
