'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { IdeaIntake } from './IdeaIntake'
import { FormSelector } from './FormSelector'
import { SaveExportActions } from './SaveExportActions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import type { PoetryIdeaInput, PoetryFormId, WizardMessage } from '@/types'
import { POETRY_FORM_MAP } from '@/data/poetryForms'
import { generateId } from '@/lib/utils'
import { ChevronRight, Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_IDEA: PoetryIdeaInput = {
  topic: '',
  emotionalTone: '',
  centralImage: '',
  themeOrQuestion: '',
  contextSeed: '',
}

export function PoemWizard() {
  const [idea, setIdea] = useState<PoetryIdeaInput>(DEFAULT_IDEA)
  const [selectedForm, setSelectedForm] = useState<PoetryFormId | null>(null)
  const [contextReady, setContextReady] = useState(false)
  const [messages, setMessages] = useState<WizardMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [draftPoem, setDraftPoem] = useState('')
  const [poemTitle, setPoemTitle] = useState('')
  const [contextOpen, setContextOpen] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendToWizard = useCallback(
    async (userContent: string | null, history: WizardMessage[]) => {
      setIsSending(true)

      const context = {
        form: selectedForm ? POETRY_FORM_MAP[selectedForm] : null,
        idea,
      }

      const apiMessages = userContent
        ? [...history, { id: generateId(), role: 'user' as const, content: userContent }]
        : history

      try {
        const res = await fetch('/api/wizard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMessages.map((m) => ({ role: m.role, content: m.content })),
            context,
          }),
        })
        const data = await res.json()
        if (data.message) {
          const assistantMsg: WizardMessage = {
            id: generateId(),
            role: 'assistant',
            content: data.message,
          }
          setMessages((prev) => {
            const withUser = userContent
              ? [...prev, { id: generateId(), role: 'user' as const, content: userContent }]
              : prev
            return [...withUser, assistantMsg]
          })
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: generateId(), role: 'assistant', content: 'Something went wrong. Please try again.' },
        ])
      } finally {
        setIsSending(false)
      }
    },
    [idea, selectedForm]
  )

  const handleBegin = async () => {
    if (!idea.topic) return
    setContextReady(true)
    setContextOpen(false)
    setMessages([])

    const opening = selectedForm
      ? `I want to write a ${POETRY_FORM_MAP[selectedForm]?.name ?? selectedForm} poem about ${idea.topic}.${idea.centralImage ? ` The central image is: ${idea.centralImage}.` : ''}`
      : `I want to write a poem about ${idea.topic}.${idea.centralImage ? ` The central image is: ${idea.centralImage}.` : ''}`

    await sendToWizard(null, [{ id: generateId(), role: 'user', content: opening }])
    setMessages([{ id: generateId(), role: 'user', content: opening }])
  }

  const handleSend = async () => {
    if (!input.trim() || isSending) return
    const userText = input.trim()
    setInput('')
    await sendToWizard(userText, messages)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col lg:flex-row lg:h-full lg:overflow-hidden">

      {/* ── Left — context + working draft ── */}
      <div className="w-full lg:w-[340px] shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-border/30 bg-card/20">

        {/* Context panel */}
        <div className="border-b border-border/20">
          <button
            onClick={() => setContextOpen((o) => !o)}
            className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="uppercase tracking-widest text-[10px]">Context</span>
            <ChevronRight className={cn('w-3.5 h-3.5 transition-transform', contextOpen && 'rotate-90')} />
          </button>
          {contextOpen && (
            <div className="px-5 pb-5 space-y-4">
              <IdeaIntake value={idea} onChange={setIdea} />
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Form (optional)</p>
                <FormSelector selected={selectedForm} onSelect={setSelectedForm} />
              </div>
              <Button
                onClick={handleBegin}
                disabled={!idea.topic || isSending}
                size="sm"
                className="w-full text-xs"
              >
                {contextReady ? 'Restart with this context' : 'Begin the conversation'}
                <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Working draft */}
        <div className="flex-1 flex flex-col p-5 space-y-3 min-h-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 shrink-0">
            Working Draft
          </p>
          <p className="text-[11px] text-muted-foreground/50 leading-snug shrink-0">
            Paste or type your lines here as the conversation progresses.
          </p>
          <div className="space-y-1.5 shrink-0">
            <Label className="text-xs text-muted-foreground/70">Title (optional)</Label>
            <Input
              value={poemTitle}
              onChange={(e) => setPoemTitle(e.target.value)}
              placeholder="Untitled"
              className="bg-background/50 h-8 text-xs"
            />
          </div>
          <Textarea
            value={draftPoem}
            onChange={(e) => setDraftPoem(e.target.value)}
            placeholder="Your poem will take shape here…"
            className="flex-1 bg-background/50 font-serif text-sm leading-7 resize-none min-h-[160px]"
          />
          <SaveExportActions
            title={poemTitle || 'Untitled'}
            content={draftPoem}
            form={selectedForm}
            source="wizard"
            size="xs"
            className="shrink-0"
          />
        </div>
      </div>

      {/* ── Right — chat ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:overflow-hidden">

        {!contextReady ? (
          <div className="flex-1 flex items-center justify-center text-center px-8">
            <div className="space-y-3 max-w-sm">
              <p className="font-serif text-base text-foreground/70">
                Set your topic and begin the conversation.
              </p>
              <p className="text-xs text-muted-foreground/60 leading-relaxed">
                Geneviève will guide you through writing your own poem — line by line, image by image. Paste your lines into the Working Draft panel as you go.
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'max-w-[85%] space-y-1',
                      msg.role === 'user' ? 'ml-auto' : 'mr-auto'
                    )}
                  >
                    <p className={cn(
                      'text-[10px] uppercase tracking-widest',
                      msg.role === 'user' ? 'text-right text-muted-foreground/50' : 'text-primary/50'
                    )}>
                      {msg.role === 'user' ? 'You' : 'Geneviève'}
                    </p>
                    <div className={cn(
                      'rounded-lg px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-primary/10 border border-primary/20 text-foreground'
                        : 'bg-card/60 border border-border/40 text-foreground/90'
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="max-w-[85%] mr-auto space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-primary/50">Geneviève</p>
                    <div className="rounded-lg px-4 py-3 bg-card/60 border border-border/40">
                      <Loader2 className="w-4 h-4 animate-spin opacity-40" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-border/20 p-4">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Share a line, ask for help, or describe what you're stuck on…"
                  className="flex-1 min-h-[44px] max-h-[120px] resize-none bg-background/50 text-sm"
                  rows={1}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isSending}
                  size="sm"
                  className="shrink-0 h-11 px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground/40 mt-2">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </>
        )}
      </div>

    </div>
  )
}
