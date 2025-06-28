import Link from "next/link"

const navigation = [
  { name: "home", href: "#" },
  { name: "writing", href: "#" },
  { name: "investments", href: "#" },
  { name: "publications", href: "#" },
  { name: "twitter", href: "#" },
]

export function SiteHeader() {
  return (
    <header className="border-b border-phthalo_blue-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-phthalo_blue-800">
              brainsprain<span className="text-scarlet-400">.me</span>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-purple-700 hover:text-phthalo_blue-800 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
