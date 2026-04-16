'use client'

import { useState, useMemo } from 'react'
import { FORM_TEMPLATES } from '@/lib/templates/formTemplates'
import { POETRY_FORMS } from '@/data/poetryForms'
import { SaveExportActions } from './SaveExportActions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { PoetryFormId } from '@/types'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const DIFFICULTY_COLORS = {
  beginner: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  intermediate: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  advanced: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
}

export function TemplateBuilder() {
  const [selectedForm, setSelectedForm] = useState<PoetryFormId | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [acrosticWord, setAcrosticWord] = useState('')
  const [poemTitle, setPoemTitle] = useState('')
  const [guideOpen, setGuideOpen] = useState(true)

  const template = selectedForm ? FORM_TEMPLATES[selectedForm] : null
  const formData = POETRY_FORMS.find((f) => f.id === selectedForm) ?? null

  const resolvedValues = useMemo(() => {
    const out: Record<string, string> = { ...values }
    if (template) {
      for (const group of template.groups) {
        for (const line of group.lines) {
          if (line.refrainOf) out[line.id] = values[line.refrainOf] ?? ''
        }
      }
    }
    return out
  }, [values, template])

  const assembled = useMemo(() => {
    if (!template) return ''
    if (template.isAcrostic) {
      return acrosticWord.toUpperCase().split('').map((_, i) => resolvedValues[`acl${i}`] || '').join('\n')
    }
    return template.assemble(resolvedValues)
  }, [template, resolvedValues, acrosticWord])

  const set = (id: string, val: string) => setValues((prev) => ({ ...prev, [id]: val }))

  const handleFormSelect = (id: PoetryFormId) => {
    setSelectedForm(id)
    setValues({})
    setAcrosticWord('')
    setPoemTitle('')
    setGuideOpen(true)
  }

  // ── Form selection screen ──────────────────────────────────────────────────
  if (!selectedForm) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
        <div className="space-y-1 mb-6">
          <h2 className="font-serif text-lg font-semibold text-foreground">Choose a form</h2>
          <p className="text-xs text-muted-foreground/60">
            You write every word. The template provides the structure — nothing else.
          </p>
        </div>
        {POETRY_FORMS.map((form) => (
          <button
            key={form.id}
            onClick={() => handleFormSelect(form.id)}
            className="w-full text-left rounded-md border border-border/40 bg-card/30 p-4 hover:border-primary/40 hover:bg-accent/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{form.name}</span>
              <span className={cn('text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full border', DIFFICULTY_COLORS[form.difficulty])}>
                {form.difficulty}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{form.description}</p>
          </button>
        ))}
      </div>
    )
  }

  // ── Template screen ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:h-full lg:overflow-hidden">

      {/* Left — inputs */}
      <div className="w-full lg:w-[420px] shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-border/30">

        {/* Header */}
        <div className="px-5 py-3 border-b border-border/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{formData!.name}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
              No AI
            </span>
          </div>
          <button
            onClick={() => setSelectedForm(null)}
            className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            Change form
          </button>
        </div>

        {/* Form Guide — collapsible reference panel */}
        <div className="border-b border-border/20">
          <button
            onClick={() => setGuideOpen((o) => !o)}
            className="w-full flex items-center justify-between px-5 py-2.5 text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            Form Guide
            <ChevronRight className={cn('w-3.5 h-3.5 transition-transform', guideOpen && 'rotate-90')} />
          </button>
          {guideOpen && (
            <div className="px-5 pb-4 space-y-3">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Structure</p>
                <ul className="space-y-0.5">
                  {formData!.structureRules.map((rule, i) => (
                    <li key={i} className="text-xs text-muted-foreground/70 flex gap-2">
                      <span className="text-primary/40 shrink-0">—</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Best for</p>
                <p className="text-xs text-muted-foreground/70">{formData!.bestFor}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Origin</p>
                <p className="text-xs text-muted-foreground/70">{formData!.origin}</p>
              </div>
            </div>
          )}
        </div>

        {/* Inputs */}
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6">

            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                Title <span className="normal-case text-muted-foreground/50">(optional)</span>
              </Label>
              <Input
                value={poemTitle}
                onChange={(e) => setPoemTitle(e.target.value)}
                placeholder="Untitled"
                className="bg-background/50"
              />
            </div>

            {/* Acrostic word */}
            {template!.isAcrostic && (
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Acrostic word or name
                </Label>
                <Input
                  value={acrosticWord}
                  onChange={(e) => setAcrosticWord(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                  placeholder="e.g. SOLITUDE"
                  className="bg-background/50 uppercase tracking-widest"
                  maxLength={20}
                />
                {acrosticWord && (
                  <p className="text-[11px] text-muted-foreground/60">
                    {acrosticWord.length} lines — one per letter
                  </p>
                )}
              </div>
            )}

            {/* Acrostic lines */}
            {template!.isAcrostic && acrosticWord && (
              <div className="space-y-3">
                {acrosticWord.toUpperCase().split('').map((letter, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-mono font-bold text-primary/60 text-sm w-4 shrink-0">{letter}</span>
                    <Input
                      value={values[`acl${i}`] ?? ''}
                      onChange={(e) => set(`acl${i}`, e.target.value)}
                      placeholder=""
                      className="bg-background/50 flex-1"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Standard form groups */}
            {!template!.isAcrostic && template!.groups.map((group, gi) => (
              <div key={gi} className="space-y-3">
                {group.heading && (
                  <p className="text-[10px] uppercase tracking-widest text-primary/50 font-medium pt-1 border-t border-border/20">
                    {group.heading}
                  </p>
                )}
                {group.lines.map((line) => (
                  <div key={line.id} className="space-y-1">
                    <Label className="text-xs text-muted-foreground/70">{line.label}</Label>
                    {line.refrainOf ? (
                      <div className="px-3 py-2 rounded-md border border-dashed border-border/30 bg-muted/10 text-xs text-muted-foreground/50 italic min-h-[34px]">
                        {resolvedValues[line.refrainOf] || 'Repeats from stanza 1'}
                      </div>
                    ) : line.type === 'textarea' ? (
                      <Textarea
                        value={values[line.id] ?? ''}
                        onChange={(e) => set(line.id, e.target.value)}
                        placeholder=""
                        className="bg-background/50 min-h-[80px] text-sm"
                      />
                    ) : (
                      <Input
                        value={values[line.id] ?? ''}
                        onChange={(e) => set(line.id, e.target.value)}
                        placeholder=""
                        className="bg-background/50"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}

          </div>
        </ScrollArea>
      </div>

      {/* Right — poem output */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-3 border-b border-border/20">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
            Your Poem
          </p>
        </div>
        <div className="flex-1 overflow-auto p-8">
          {assembled.trim() ? (
            <div className="max-w-lg space-y-8">
              {poemTitle && (
                <h2 className="font-serif text-base font-semibold text-foreground pb-3 border-b border-border/30">
                  {poemTitle}
                </h2>
              )}
              <div className="font-serif text-sm leading-9 text-foreground whitespace-pre-line">
                {assembled}
              </div>
              <SaveExportActions
                title={poemTitle || formData!.name}
                content={assembled}
                form={selectedForm}
                source="template"
                size="xs"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <p className="text-sm text-muted-foreground/40 text-center">
                Your poem will appear here as you write.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
