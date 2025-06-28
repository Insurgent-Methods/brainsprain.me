import { TimelineItem } from "@/components/timeline-item"

interface TimelineProps {
  items: Array<{
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
  }>
  onTagClick: (tag: string) => void
}

export function Timeline({ items, onTagClick }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line - made visible with proper color */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-scarlet-400 h-full shadow-sm"></div>

      <div className="space-y-12">
        {items.map((item) => (
          <TimelineItem key={item.id} item={item} onTagClick={onTagClick} />
        ))}
      </div>
    </div>
  )
}
