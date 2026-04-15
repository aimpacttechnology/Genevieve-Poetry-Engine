import { CompositionStudio } from '@/components/genevieve/CompositionStudio'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Composition Studio — Geneviève Poetry Engine',
}

export default function StudioPage() {
  return (
    <div className="min-h-screen flex flex-col lg:h-screen lg:overflow-hidden">
      {/* Studio header */}
      <header className="shrink-0 border-b border-border/30 px-4 py-3 flex items-center justify-between bg-card/20">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-semibold text-primary/80">Geneviève</span>
            <span className="text-muted-foreground/40 text-xs">/</span>
            <span className="text-xs text-muted-foreground">Composition Studio</span>
          </div>
        </div>
        <Link
          href="/forms"
          className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          Forms Library
        </Link>
      </header>

      {/* Studio workspace */}
      <main className="flex-1 lg:overflow-hidden">
        <CompositionStudio />
      </main>
    </div>
  )
}
