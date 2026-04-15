import Link from 'next/link'
import { POETRY_FORMS } from '@/data/poetryForms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Poetry Forms Library — Geneviève',
}

const DIFFICULTY_STYLES = {
  beginner: 'border-emerald-400/40 text-emerald-400 bg-emerald-400/10',
  intermediate: 'border-amber-400/40 text-amber-400 bg-amber-400/10',
  advanced: 'border-rose-400/40 text-rose-400 bg-rose-400/10',
}

export default function FormsLibraryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-semibold text-primary/80">Geneviève</span>
            <span className="text-muted-foreground/40 text-xs">/</span>
            <span className="text-xs text-muted-foreground">Forms Library</span>
          </div>
        </div>
        <Link href="/studio">
          <Button size="sm" className="text-xs">
            Open Studio
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-10 space-y-2">
          <h1 className="font-serif text-3xl font-semibold text-foreground">Forms Library</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
            Ten forms, each with its own demands and gifts. Understanding the form is understanding
            what the poem wants to hold.
          </p>
        </div>

        <div className="space-y-6">
          {POETRY_FORMS.map((form, i) => (
            <article
              key={form.id}
              className="rounded-lg border border-border/30 bg-card/20 overflow-hidden"
            >
              <div className="px-6 py-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="font-serif text-xl font-semibold text-foreground">
                        {form.name}
                      </h2>
                      <span
                        className={cn(
                          'text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border',
                          DIFFICULTY_STYLES[form.difficulty]
                        )}
                      >
                        {form.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/60 italic">{form.origin}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {form.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
                      Best For
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{form.bestFor}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
                      Emotional Strengths
                    </h3>
                    <ul className="space-y-0.5">
                      {form.emotionalStrengths.map((s, j) => (
                        <li key={j} className="text-xs text-muted-foreground flex gap-2">
                          <span className="text-primary/40 shrink-0">—</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <Separator className="opacity-30" />

              <div className="px-6 py-4 bg-card/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
                    Structure Rules
                  </h3>
                  <ul className="space-y-0.5">
                    {form.structureRules.map((rule, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-primary/40 shrink-0">·</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
                    Craft Notes
                  </h3>
                  <ul className="space-y-1">
                    {form.promptHints.map((hint, j) => (
                      <li key={j} className="text-xs text-muted-foreground/80 italic leading-relaxed flex gap-2">
                        <span className="text-primary/40 shrink-0 not-italic">→</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator className="opacity-30" />

              <div className="px-6 py-4 bg-card/5">
                <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-semibold mb-3">
                  Structure Template
                </h3>
                <pre className="font-serif text-xs text-muted-foreground/60 whitespace-pre-wrap leading-relaxed italic">
                  {form.sampleTemplate}
                </pre>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/studio">
            <Button size="lg">
              Begin composing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-border/20 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground/40">Geneviève Poetry Engine</span>
          <span className="text-xs text-muted-foreground/30 italic">
            "Choose the vessel for the poem."
          </span>
        </div>
      </footer>
    </div>
  )
}
