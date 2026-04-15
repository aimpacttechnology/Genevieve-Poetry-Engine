'use client'

import type { RevisionActionType } from '@/types'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface RevisionAction {
  type: RevisionActionType
  label: string
  description: string
}

const REVISION_ACTIONS: RevisionAction[] = [
  { type: 'strengthen-imagery', label: 'Strengthen imagery', description: 'Replace vague language with sensory detail' },
  { type: 'reduce-cliches', label: 'Reduce clichés', description: 'Find fresher paths through familiar feeling' },
  { type: 'improve-ending', label: 'Improve ending', description: 'Tighten the final lines for greater impact' },
  { type: 'increase-musicality', label: 'Increase musicality', description: 'Reinforce sound patterns and rhythm' },
  { type: 'tighten-line-breaks', label: 'Tighten line breaks', description: 'Reconsider where the line turns' },
  { type: 'make-intimate', label: 'Make more intimate', description: 'Bring the voice closer to the reader' },
  { type: 'make-darker', label: 'Make darker', description: 'Deepen the shadow, withhold the resolution' },
  { type: 'make-restrained', label: 'Make more restrained', description: 'Trim excess — trust the silence' },
  { type: 'concretize-abstractions', label: 'Concretize abstractions', description: 'Name the unnamed — make it specific and embodied' },
]

interface RevisionControlsProps {
  onRevise: (type: RevisionActionType) => void
  isRevising: boolean
  disabled: boolean
}

export function RevisionControls({ onRevise, isRevising, disabled }: RevisionControlsProps) {
  return (
    <div className="space-y-2">
      {disabled && (
        <p className="text-xs text-muted-foreground/60 text-center py-2">
          Generate a draft first to enable revision.
        </p>
      )}
      <div className="grid grid-cols-1 gap-1.5">
        {REVISION_ACTIONS.map((action) => (
          <button
            key={action.type}
            onClick={() => onRevise(action.type)}
            disabled={disabled || isRevising}
            className={cn(
              'w-full text-left px-3 py-2.5 rounded-md border text-xs transition-all',
              disabled || isRevising
                ? 'border-border/20 text-muted-foreground/30 cursor-not-allowed'
                : 'border-border/40 text-muted-foreground hover:border-primary/40 hover:bg-accent/20 hover:text-foreground'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-medium text-foreground/80">{action.label}</span>
                <p className="text-muted-foreground/60 mt-0.5">{action.description}</p>
              </div>
              {isRevising && (
                <Loader2 className="w-3 h-3 animate-spin shrink-0 opacity-50" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
