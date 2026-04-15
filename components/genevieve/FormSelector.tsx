'use client'

import { POETRY_FORMS } from '@/data/poetryForms'
import type { PoetryFormId } from '@/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface FormSelectorProps {
  selected: PoetryFormId | null
  onSelect: (id: PoetryFormId) => void
}

const DIFFICULTY_COLORS = {
  beginner: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  intermediate: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  advanced: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
}

export function FormSelector({ selected, onSelect }: FormSelectorProps) {
  return (
    <div className="space-y-2">
      {POETRY_FORMS.map((form) => (
        <button
          key={form.id}
          onClick={() => onSelect(form.id)}
          className={cn(
            'w-full text-left rounded-md border p-4 transition-all duration-150',
            'hover:border-primary/40 hover:bg-accent/30',
            selected === form.id
              ? 'border-primary/60 bg-accent/40 ring-1 ring-primary/20'
              : 'border-border/40 bg-card/30'
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-foreground">{form.name}</span>
                <span
                  className={cn(
                    'text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full border',
                    DIFFICULTY_COLORS[form.difficulty]
                  )}
                >
                  {form.difficulty}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {form.description}
              </p>
            </div>
            {selected === form.id && (
              <div className="shrink-0 w-2 h-2 rounded-full bg-primary mt-1" />
            )}
          </div>
          {selected === form.id && (
            <div className="mt-3 pt-3 border-t border-border/30 space-y-2 animate-fade-in">
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground/60 font-medium">Best for: </span>
                {form.bestFor}
              </p>
              <ul className="space-y-0.5">
                {form.structureRules.map((rule, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-primary/50 shrink-0">—</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
