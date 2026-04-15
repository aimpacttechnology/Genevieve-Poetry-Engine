'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { PoetryIdeaInput } from '@/types'

interface IdeaIntakeProps {
  value: PoetryIdeaInput
  onChange: (value: PoetryIdeaInput) => void
}

export function IdeaIntake({ value, onChange }: IdeaIntakeProps) {
  const update = (field: keyof PoetryIdeaInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => onChange({ ...value, [field]: e.target.value })

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="topic" className="text-xs uppercase tracking-widest text-muted-foreground">
          Topic
        </Label>
        <Input
          id="topic"
          placeholder="What is the poem about?"
          value={value.topic}
          onChange={update('topic')}
          className="bg-background/50"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="emotionalTone" className="text-xs uppercase tracking-widest text-muted-foreground">
          Emotional Tone
        </Label>
        <Input
          id="emotionalTone"
          placeholder="e.g. grief threaded with defiance, quiet wonder"
          value={value.emotionalTone}
          onChange={update('emotionalTone')}
          className="bg-background/50"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="centralImage" className="text-xs uppercase tracking-widest text-muted-foreground">
          Central Image
        </Label>
        <Input
          id="centralImage"
          placeholder="Begin with an image — something you can see"
          value={value.centralImage}
          onChange={update('centralImage')}
          className="bg-background/50"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="themeOrQuestion" className="text-xs uppercase tracking-widest text-muted-foreground">
          Theme or Question
        </Label>
        <Input
          id="themeOrQuestion"
          placeholder="What does the poem want to ask or understand?"
          value={value.themeOrQuestion}
          onChange={update('themeOrQuestion')}
          className="bg-background/50"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contextSeed" className="text-xs uppercase tracking-widest text-muted-foreground">
          Context or Story Seed <span className="normal-case text-muted-foreground/60">(optional)</span>
        </Label>
        <Textarea
          id="contextSeed"
          placeholder="Any additional context, memory, or story that informs the poem…"
          value={value.contextSeed || ''}
          onChange={update('contextSeed')}
          className="bg-background/50 min-h-[72px]"
        />
      </div>
    </div>
  )
}
