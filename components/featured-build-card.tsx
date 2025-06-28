import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github } from "lucide-react"

interface FeaturedBuild {
  id: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  backgroundColor: string
  url?: string
  githubUrl?: string
}

interface FeaturedBuildCardProps {
  build: FeaturedBuild
}

export function FeaturedBuildCard({ build }: FeaturedBuildCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-cerulean-100 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4 relative">
        <div className={`${build.backgroundColor} rounded-lg p-4 mb-4`}>
          <Image
            src={build.image || "/placeholder.svg"}
            alt={build.imageAlt || `${build.title} preview`}
            width={300}
            height={200}
            className="w-full h-32 object-cover rounded"
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <Link
            href={build.url || "https://www.yohei.me/"}
            className="font-semibold text-blue-800 hover:text-blue-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {build.title}
          </Link>
        </div>
        <p className="text-sm text-mulberry-700 leading-relaxed mb-4 pr-16">{build.description}</p>

        {/* Links anchored to bottom right */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
          <Link
            href={build.url || "https://www.yohei.me/"}
            className="text-cerulean-600 hover:text-cerulean-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <Link
            href={build.githubUrl || "https://github.com/yoheinakajima"}
            className="text-mulberry-600 hover:text-mulberry-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
