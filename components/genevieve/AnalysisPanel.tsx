'use client'

import type { AnalysisResult } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface AnalysisPanelProps {
  analysis: AnalysisResult | null
  isAnalyzing?: boolean
}

const DENSITY_LABELS = {
  sparse: { label: 'Sparse', color: 'text-muted-foreground' },
  moderate: { label: 'Moderate', color: 'text-amber-400' },
  rich: { label: 'Rich', color: 'text-emerald-400' },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">
        {title}
      </h4>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

export function AnalysisPanel({ analysis, isAnalyzing }: AnalysisPanelProps) {
  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        <span className="animate-pulse">Reading the poem…</span>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-32 text-center px-4">
        <p className="text-muted-foreground/60 text-xs leading-relaxed">
          Generate a draft to see craft analysis.
        </p>
      </div>
    )
  }

  const density = DENSITY_LABELS[analysis.imageryDensity]

  return (
    <ScrollArea className="h-full max-h-[520px]">
      <div className="space-y-5 pr-1">
        <Section title="Overview">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-card/40 border border-border/30 px-3 py-2">
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-0.5">Imagery</p>
              <p className={cn('text-xs font-medium', density.color)}>{density.label}</p>
            </div>
            <div className="rounded-md bg-card/40 border border-border/30 px-3 py-2">
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-0.5">Tone</p>
              <p className="text-xs font-medium text-foreground/80">{analysis.likelyTone}</p>
            </div>
          </div>
        </Section>

        <Section title="Concrete vs Abstract">
          <p className="text-xs text-muted-foreground leading-relaxed">{analysis.abstractVsConcrete}</p>
        </Section>

        {analysis.devicesFound.length > 0 && (
          <Section title="Poetic Devices">
            {analysis.devicesFound.map((device, i) => (
              <div key={i} className="rounded-md bg-card/30 border border-border/20 px-3 py-2 space-y-1">
                <p className="text-xs font-semibold text-foreground/80">{device.name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{device.explanation}</p>
                {device.examples.length > 0 && (
                  <p className="text-[11px] font-serif italic text-muted-foreground/70 border-l-2 border-primary/20 pl-2">
                    {device.examples[0]}
                  </p>
                )}
              </div>
            ))}
          </Section>
        )}

        {analysis.repetitionNotes.length > 0 && (
          <Section title="Repetition">
            {analysis.repetitionNotes.map((note, i) => (
              <p key={i} className="text-xs text-muted-foreground leading-relaxed">{note}</p>
            ))}
          </Section>
        )}

        <Section title="Line Breaks">
          {analysis.linBreakObservations.map((obs, i) => (
            <p key={i} className="text-xs text-muted-foreground leading-relaxed">{obs}</p>
          ))}
        </Section>

        <Section title="Rhythm & Sound">
          <p className="text-xs text-muted-foreground leading-relaxed">{analysis.rhythmNotes}</p>
        </Section>

        {analysis.suggestions.length > 0 && (
          <Section title="Suggestions">
            {analysis.suggestions.map((s, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-primary/50 text-xs shrink-0">→</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{s}</p>
              </div>
            ))}
          </Section>
        )}
      </div>
    </ScrollArea>
  )
}
