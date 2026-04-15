'use client'

import { useState, useCallback } from 'react'
import { IdeaIntake } from './IdeaIntake'
import { FormSelector } from './FormSelector'
import { StyleBuilder } from './StyleBuilder'
import { PromptPreview } from './PromptPreview'
import { DraftOutput } from './DraftOutput'
import { RevisionControls } from './RevisionControls'
import { AnalysisPanel } from './AnalysisPanel'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type {
  PoetryIdeaInput,
  PoetryFormId,
  StyleConstraints,
  PoetryPrompt,
  PoemDraft,
  AnalysisResult,
  RevisionActionType,
} from '@/types'
import { buildPoetryPrompt } from '@/lib/prompting/promptBuilder'
import { POETRY_FORM_MAP } from '@/data/poetryForms'
import { ChevronRight, Feather, Wand2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_IDEA: PoetryIdeaInput = {
  topic: '',
  emotionalTone: '',
  centralImage: '',
  themeOrQuestion: '',
  contextSeed: '',
}

const DEFAULT_STYLE: StyleConstraints = {
  tone: '',
  pointOfView: 'first-person',
  lineLengthPreference: 'medium',
  rhyme: false,
  imageryDensity: 'moderate',
  diction: 'modern',
  metaphorHeavy: false,
  poemLength: 'medium',
  avoidCliches: true,
  targetExperience: '',
}

type StepId = 'idea' | 'form' | 'style'

const STEPS: { id: StepId; label: string; hint: string }[] = [
  { id: 'idea', label: 'Idea', hint: 'Begin with what the poem knows.' },
  { id: 'form', label: 'Form', hint: 'Choose the vessel for the poem.' },
  { id: 'style', label: 'Style', hint: 'Refine the pressure and music of the lines.' },
]

export function CompositionStudio() {
  const [activeStep, setActiveStep] = useState<StepId>('idea')
  const [idea, setIdea] = useState<PoetryIdeaInput>(DEFAULT_IDEA)
  const [selectedForm, setSelectedForm] = useState<PoetryFormId | null>(null)
  const [style, setStyle] = useState<StyleConstraints>(DEFAULT_STYLE)
  const [prompt, setPrompt] = useState<PoetryPrompt | null>(null)
  const [draft, setDraft] = useState<PoemDraft | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRevising, setIsRevising] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [outputTab, setOutputTab] = useState<'draft' | 'analysis'>('draft')

  const buildPrompt = useCallback(() => {
    if (!selectedForm) return
    const form = POETRY_FORM_MAP[selectedForm]
    if (!form) return
    const built = buildPoetryPrompt(idea, form, style)
    setPrompt(built)
  }, [idea, selectedForm, style])

  const canGenerate = !!(idea.topic && selectedForm && prompt)

  const handleGenerate = async () => {
    if (!prompt) return
    setIsGenerating(true)
    setDraft(null)
    setAnalysis(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setDraft(data.draft)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRevise = async (type: RevisionActionType) => {
    if (!draft) return
    setIsRevising(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft, revisionType: type }),
      })
      const data = await res.json()
      setDraft(data.draft)
      setAnalysis(null)
    } finally {
      setIsRevising(false)
    }
  }

  const handleAnalyze = async () => {
    if (!draft) return
    setIsAnalyzing(true)
    setOutputTab('analysis')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft, analyze: true }),
      })
      const data = await res.json()
      setAnalysis(data.analysis)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setIdea(DEFAULT_IDEA)
    setSelectedForm(null)
    setStyle(DEFAULT_STYLE)
    setPrompt(null)
    setDraft(null)
    setAnalysis(null)
    setActiveStep('idea')
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-0 overflow-hidden">
      {/* Left panel — composition controls */}
      <div className="w-full lg:w-[400px] xl:w-[440px] shrink-0 flex flex-col border-r border-border/30 bg-card/20">
        {/* Step nav */}
        <div className="flex items-center gap-1 px-5 py-3 border-b border-border/20">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-1">
              <button
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  'px-3 py-1 rounded text-xs font-medium transition-all',
                  activeStep === step.id
                    ? 'bg-primary/15 text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {step.label}
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
              )}
            </div>
          ))}
        </div>

        {/* Step hint */}
        <div className="px-5 py-2 border-b border-border/10">
          <p className="text-xs text-muted-foreground/60 italic">
            {STEPS.find((s) => s.id === activeStep)?.hint}
          </p>
        </div>

        {/* Step content */}
        <ScrollArea className="flex-1">
          <div className="p-5">
            {activeStep === 'idea' && <IdeaIntake value={idea} onChange={setIdea} />}
            {activeStep === 'form' && (
              <FormSelector selected={selectedForm} onSelect={setSelectedForm} />
            )}
            {activeStep === 'style' && <StyleBuilder value={style} onChange={setStyle} />}
          </div>
        </ScrollArea>

        {/* Bottom controls */}
        <div className="p-4 border-t border-border/20 space-y-2">
          <Button
            onClick={buildPrompt}
            disabled={!idea.topic || !selectedForm}
            variant="outline"
            className="w-full text-xs"
            size="sm"
          >
            <Feather className="w-3.5 h-3.5 mr-2" />
            Build Composition Prompt
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="w-full text-xs"
            size="sm"
          >
            <Wand2 className="w-3.5 h-3.5 mr-2" />
            {isGenerating ? 'Generating…' : 'Generate Draft'}
          </Button>
        </div>
      </div>

      {/* Right panel — output */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Prompt preview strip */}
        {prompt && (
          <div className="border-b border-border/20 bg-card/10">
            <div className="px-6 py-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-2">
                Composition Prompt
              </p>
              <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-3">
                {prompt.generatedPrompt}
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Draft + analysis */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3 border-b border-border/20">
              <Tabs value={outputTab} onValueChange={(v) => setOutputTab(v as 'draft' | 'analysis')}>
                <TabsList className="h-7 bg-muted/30">
                  <TabsTrigger value="draft" className="text-xs h-6 px-3">Draft</TabsTrigger>
                  <TabsTrigger value="analysis" className="text-xs h-6 px-3">Analysis</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex gap-2">
                {draft && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="text-xs h-7 px-3"
                  >
                    {isAnalyzing ? 'Reading…' : 'Analyse'}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  className="text-xs h-7 px-3 text-muted-foreground"
                >
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {outputTab === 'draft' ? (
                <DraftOutput draft={draft} isGenerating={isGenerating} />
              ) : (
                <AnalysisPanel analysis={analysis} isAnalyzing={isAnalyzing} />
              )}
            </div>
          </div>

          {/* Revision sidebar */}
          <div className="w-full lg:w-64 xl:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-border/20 bg-card/10">
            <div className="px-4 py-3 border-b border-border/20">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                Shape the Draft
              </p>
            </div>
            <ScrollArea className="h-full max-h-[calc(100vh-200px)]">
              <div className="p-4">
                <RevisionControls
                  onRevise={handleRevise}
                  isRevising={isRevising}
                  disabled={!draft}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
