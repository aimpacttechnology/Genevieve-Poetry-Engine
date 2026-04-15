'use client'

import type { PoetryPrompt } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PromptPreviewProps {
  prompt: PoetryPrompt | null
  isBuilding?: boolean
}

export function PromptPreview({ prompt, isBuilding }: PromptPreviewProps) {
  if (isBuilding) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        <span className="animate-pulse">Composing the prompt…</span>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="flex items-center justify-center h-32 text-center px-6">
        <p className="text-muted-foreground/60 text-sm leading-relaxed">
          Complete the idea, form, and style panels above.<br />
          The composition prompt will appear here.
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full max-h-[320px]">
      <div className="prose prose-sm max-w-none">
        {prompt.generatedPrompt.split('\n\n').map((paragraph, i) => (
          <p
            key={i}
            className="text-sm text-foreground/80 leading-relaxed mb-3 last:mb-0"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </ScrollArea>
  )
}
