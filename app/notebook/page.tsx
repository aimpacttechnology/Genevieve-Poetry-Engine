'use client'

import { useState, useEffect } from 'react'
import { getSavedPoems, deletePoem } from '@/lib/storage/poems'
import { exportPoemAsText } from '@/lib/export/exportPoem'
import type { SavedPoem } from '@/types'
import Link from 'next/link'
import { ArrowLeft, Download, Trash2, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SOURCE_LABELS = {
  ai: 'AI Draft',
  wizard: 'Wizard',
  template: 'Template',
}

const SOURCE_COLORS = {
  ai: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
  wizard: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  template: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
}

function PoemCard({ poem, onDelete }: { poem: SavedPoem; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const preview = poem.content.split('\n').slice(0, 3).join('\n')
  const date = new Date(poem.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="rounded-lg border border-border/40 bg-card/30 p-5 space-y-3 hover:border-border/70 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="font-serif text-sm font-semibold text-foreground truncate">
            {poem.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full border', SOURCE_COLORS[poem.source])}>
              {SOURCE_LABELS[poem.source]}
            </span>
            {poem.form && (
              <span className="text-[10px] text-muted-foreground/60 capitalize">
                {poem.form.replace(/-/g, ' ')}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground/40">{date}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => exportPoemAsText({ title: poem.title, content: poem.content })}
            className="h-7 w-7 p-0 text-muted-foreground/60 hover:text-foreground"
            title="Export as .txt"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(poem.id)}
            className="h-7 w-7 p-0 text-muted-foreground/60 hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="font-serif text-xs leading-6 text-foreground/70 whitespace-pre-line">
        {expanded ? poem.content : preview}
        {!expanded && poem.content.split('\n').length > 3 && (
          <span className="text-muted-foreground/40 not-italic"> …</span>
        )}
      </div>

      {poem.content.split('\n').length > 3 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="w-3 h-3" /> Collapse</>
          ) : (
            <><ChevronDown className="w-3 h-3" /> Read full poem</>
          )}
        </button>
      )}
    </div>
  )
}

export default function NotebookPage() {
  const [poems, setPoems] = useState<SavedPoem[]>([])

  useEffect(() => {
    setPoems(getSavedPoems())
  }, [])

  const handleDelete = (id: string) => {
    deletePoem(id)
    setPoems(getSavedPoems())
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/30 px-4 py-3 flex items-center justify-between bg-card/20">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground/60 hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-semibold text-primary/80">Geneviève</span>
            <span className="text-muted-foreground/40 text-xs">/</span>
            <span className="text-xs text-muted-foreground">Notebook</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
          <Link href="/studio" className="hover:text-foreground transition-colors">Studio</Link>
          <Link href="/wizard" className="hover:text-foreground transition-colors">Wizard</Link>
          <Link href="/template" className="hover:text-foreground transition-colors">Templates</Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">Notebook</h1>
            <p className="text-sm text-muted-foreground/60 mt-1">
              {poems.length === 0 ? 'No poems saved yet.' : `${poems.length} poem${poems.length === 1 ? '' : 's'} saved locally.`}
            </p>
          </div>
        </div>

        {poems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <BookOpen className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-muted-foreground/60 text-sm leading-relaxed max-w-xs">
              Poems you save from the Studio, Wizard, or Template Builder will appear here.
            </p>
            <div className="flex gap-3 pt-2">
              <Link href="/studio" className="text-xs text-primary/70 hover:text-primary transition-colors">
                Open Studio →
              </Link>
              <Link href="/wizard" className="text-xs text-primary/70 hover:text-primary transition-colors">
                Open Wizard →
              </Link>
              <Link href="/template" className="text-xs text-primary/70 hover:text-primary transition-colors">
                Open Templates →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {poems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
