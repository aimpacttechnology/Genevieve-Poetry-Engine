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

  const template = selectedForm ? FORM_TEMPLATES[selectedForm] : null

  // Resolve refrain values for display
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
      const word = acrosticWord.toUpperCase()
      return word.split('').map((_, i) => resolvedValues[`acl${i}`] || '').join('\n')
    }
    return template.assemble(resolvedValues)
  }, [template, resolvedValues, acrosticWord])

  const set = (id: string, val: string) => setValues((prev) => ({ ...prev, [id]: val }))

  const handleFormSelect = (id: PoetryFormId) => {
    setSelectedForm(id)
    setValues({})
    setAcrosticWord('')
    setPoemTitle('')
  }

  if (!selectedForm) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground/60 italic mb-4">
          Choose a form to load its template.
        </p>
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

  const formData = POETRY_FORMS.find((f) => f.id === selectedForm)!

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:h-full lg:overflow-hidden">

      {/* Left — inputs */}
      <div className="w-full lg:w-[420px] shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-border/30">
        <div className="px-5 py-3 border-b border-border/20 flex items-center justify-between">
          <div>
            <span className="font-semibold text-sm">{formData.name}</span>
            <span className="text-xs text-muted-foreground ml-2">template</span>
          </div>
          <button
            onClick={() => setSelectedForm(null)}
            className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            Change form
          </button>
        </div>
        <p className="px-5 py-2.5 text-xs text-muted-foreground/70 italic border-b border-border/10">
          {template!.intro}
        </p>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6">

            {/* Title input */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                Title <span className="normal-case text-muted-foreground/50">(optional)</span>
              </Label>
              <Input
                value={poemTitle}
                onChange={(e) => setPoemTitle(e.target.value)}
                placeholder="Leave blank to remain untitled"
                className="bg-background/50"
              />
            </div>

            {/* Acrostic word input */}
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
                  <div key={i} className="space-y-1">
                    <Label className="text-xs text-muted-foreground/80">
                      Line {i + 1} — starts with <span className="font-mono font-bold text-primary/70">{letter}</span>
                    </Label>
                    <Input
                      value={values[`acl${i}`] ?? ''}
                      onChange={(e) => set(`acl${i}`, e.target.value)}
                      placeholder={`${letter}...`}
                      className="bg-background/50"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Standard form groups */}
            {!template!.isAcrostic && template!.groups.map((group, gi) => (
              <div key={gi} className="space-y-3">
                {group.heading && (
                  <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium pt-1">
                    {group.heading}
                  </p>
                )}
                {group.lines.map((line) => (
                  <div key={line.id} className="space-y-1">
                    <Label className="text-xs text-muted-foreground/80">{line.label}</Label>
                    {line.hint && (
                      <p className="text-[11px] text-muted-foreground/50 leading-snug">{line.hint}</p>
                    )}
                    {line.refrainOf ? (
                      <div className="px-3 py-2 rounded-md border border-border/30 bg-muted/20 text-xs text-muted-foreground/60 italic min-h-[34px]">
                        {resolvedValues[line.refrainOf] || <span className="opacity-40">Refrain will appear here once written above</span>}
                      </div>
                    ) : line.type === 'textarea' ? (
                      <Textarea
                        value={values[line.id] ?? ''}
                        onChange={(e) => set(line.id, e.target.value)}
                        placeholder={line.placeholder}
                        className="bg-background/50 min-h-[80px] text-sm"
                      />
                    ) : (
                      <Input
                        value={values[line.id] ?? ''}
                        onChange={(e) => set(line.id, e.target.value)}
                        placeholder={line.placeholder}
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

      {/* Right — live preview */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-3 border-b border-border/20">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
            Live Preview
          </p>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {assembled.trim() ? (
            <div className="space-y-6">
              {poemTitle && (
                <h2 className="font-serif text-base font-semibold text-foreground pb-3 border-b border-border/30">
                  {poemTitle}
                </h2>
              )}
              <div className="font-serif text-sm leading-8 text-foreground/90 whitespace-pre-line">
                {assembled}
              </div>
              <SaveExportActions
                title={poemTitle || formData.name}
                content={assembled}
                form={selectedForm}
                source="template"
                size="xs"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm text-muted-foreground/50 text-center">
                Fill in the template — your poem will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
