'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookMarked, Download, Check } from 'lucide-react'
import { savePoem } from '@/lib/storage/poems'
import { exportPoemAsText } from '@/lib/export/exportPoem'
import type { PoetryFormId } from '@/types'
import { cn } from '@/lib/utils'

interface SaveExportActionsProps {
  title: string
  content: string
  form: PoetryFormId | null
  source: 'ai' | 'wizard' | 'template'
  className?: string
  size?: 'sm' | 'xs'
}

export function SaveExportActions({
  title,
  content,
  form,
  source,
  className,
  size = 'sm',
}: SaveExportActionsProps) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    savePoem({ title: title || 'Untitled', content, form, source })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExport = () => {
    exportPoemAsText({ title: title || 'poem', content })
  }

  const btnClass = size === 'xs' ? 'text-[11px] h-7 px-2.5' : 'text-xs h-8 px-3'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        size="sm"
        variant="outline"
        onClick={handleSave}
        disabled={!content || saved}
        className={cn(btnClass, saved && 'text-primary border-primary/40')}
      >
        {saved ? (
          <>
            <Check className="w-3 h-3 mr-1.5" />
            Saved
          </>
        ) : (
          <>
            <BookMarked className="w-3 h-3 mr-1.5" />
            Save to Notebook
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleExport}
        disabled={!content}
        className={btnClass}
      >
        <Download className="w-3 h-3 mr-1.5" />
        Export .txt
      </Button>
    </div>
  )
}
