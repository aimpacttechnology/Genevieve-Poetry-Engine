import { PoemWizard } from '@/components/genevieve/PoemWizard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Poem Wizard — Geneviève Poetry Engine',
}

export default function WizardPage() {
  return (
    <div className="min-h-screen flex flex-col lg:h-screen lg:overflow-hidden">
      <header className="shrink-0 border-b border-border/30 px-4 py-3 flex items-center justify-between bg-card/20">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-semibold text-primary/80">Geneviève</span>
            <span className="text-muted-foreground/40 text-xs">/</span>
            <span className="text-xs text-muted-foreground">Poem Wizard</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
          <Link href="/template" className="hover:text-foreground transition-colors">Templates</Link>
          <Link href="/notebook" className="hover:text-foreground transition-colors">Notebook</Link>
        </div>
      </header>
      <main className="flex-1 lg:overflow-hidden">
        <PoemWizard />
      </main>
    </div>
  )
}
