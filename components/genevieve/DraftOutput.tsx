'use client'

import type { PoemDraft } from '@/types'
import type { PoetryFormId } from '@/types'
import { SaveExportActions } from './SaveExportActions'
import { Loader2 } from 'lucide-react'

interface DraftOutputProps {
  draft: PoemDraft | null
  isGenerating: boolean
  form?: PoetryFormId | null
}

export function DraftOutput({ draft, isGenerating, form }: DraftOutputProps) {
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-48 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin opacity-50" />
        <span className="text-sm">The draft is being drawn…</span>
      </div>
    )
  }

  if (!draft) {
    return (
      <div className="flex items-center justify-center h-48 text-center px-6">
        <p className="text-muted-foreground/60 text-sm leading-relaxed">
          Complete the steps and generate the first draft.<br />
          The poem will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="px-1">
        {draft.title && (
          <h3 className="font-serif text-base font-semibold text-foreground mb-4 pb-3 border-b border-border/30">
            {draft.title}
          </h3>
        )}
        <div className="font-serif text-sm leading-8 text-foreground/90 whitespace-pre-line animate-fade-in">
          {draft.content}
        </div>
      </div>
      <SaveExportActions
        title={draft.title ?? 'Untitled'}
        content={draft.content}
        form={form ?? null}
        source="ai"
        size="xs"
      />
    </div>
  )
}
