'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { StyleConstraints, PointOfView, DictionRegister, ImageryDensity, PoemLength, ReadingExperience } from '@/types'

interface StyleBuilderProps {
  value: StyleConstraints
  onChange: (value: StyleConstraints) => void
}

function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs border transition-all',
              value === opt.value
                ? 'border-primary/60 bg-primary/10 text-foreground'
                : 'border-border/40 text-muted-foreground hover:border-border hover:text-foreground'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function BoolToggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description?: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        'w-full text-left px-3 py-2.5 rounded-md border text-xs transition-all',
        value
          ? 'border-primary/60 bg-primary/10 text-foreground'
          : 'border-border/40 text-muted-foreground hover:border-border'
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn('font-medium', value ? 'text-foreground' : 'text-muted-foreground')}>
          {label}
        </span>
        <span
          className={cn(
            'text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded',
            value ? 'text-primary' : 'text-muted-foreground/50'
          )}
        >
          {value ? 'On' : 'Off'}
        </span>
      </div>
      {description && <p className="mt-0.5 text-muted-foreground/70">{description}</p>}
    </button>
  )
}

const READING_EXPERIENCES: { value: ReadingExperience | ''; label: string }[] = [
  { value: '', label: 'None' },
  { value: 'haunting', label: 'Haunting' },
  { value: 'tender', label: 'Tender' },
  { value: 'sharp', label: 'Sharp' },
  { value: 'mystical', label: 'Mystical' },
  { value: 'mournful', label: 'Mournful' },
  { value: 'joyful', label: 'Joyful' },
  { value: 'fierce', label: 'Fierce' },
  { value: 'meditative', label: 'Meditative' },
  { value: 'unsettling', label: 'Unsettling' },
  { value: 'intimate', label: 'Intimate' },
]

export function StyleBuilder({ value, onChange }: StyleBuilderProps) {
  const set = <K extends keyof StyleConstraints>(key: K, val: StyleConstraints[K]) =>
    onChange({ ...value, [key]: val })

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="tone" className="text-xs uppercase tracking-widest text-muted-foreground">
          Tone
        </Label>
        <Input
          id="tone"
          placeholder="e.g. measured, urgent, elegiac, ironic…"
          value={value.tone}
          onChange={(e) => set('tone', e.target.value)}
          className="bg-background/50"
        />
      </div>

      <ToggleGroup<PointOfView>
        label="Point of View"
        options={[
          { value: 'first-person', label: 'First person (I)' },
          { value: 'second-person', label: 'Second person (You)' },
          { value: 'third-person', label: 'Third person' },
        ]}
        value={value.pointOfView}
        onChange={(v) => set('pointOfView', v)}
      />

      <ToggleGroup<StyleConstraints['lineLengthPreference']>
        label="Line Length"
        options={[
          { value: 'short', label: 'Short' },
          { value: 'medium', label: 'Medium' },
          { value: 'long', label: 'Long' },
          { value: 'varied', label: 'Varied' },
        ]}
        value={value.lineLengthPreference}
        onChange={(v) => set('lineLengthPreference', v)}
      />

      <ToggleGroup<ImageryDensity>
        label="Imagery Density"
        options={[
          { value: 'minimalist', label: 'Minimalist' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'dense', label: 'Dense' },
        ]}
        value={value.imageryDensity}
        onChange={(v) => set('imageryDensity', v)}
      />

      <ToggleGroup<DictionRegister>
        label="Diction"
        options={[
          { value: 'archaic', label: 'Archaic' },
          { value: 'classical', label: 'Classical' },
          { value: 'modern', label: 'Modern' },
          { value: 'colloquial', label: 'Colloquial' },
        ]}
        value={value.diction}
        onChange={(v) => set('diction', v)}
      />

      <ToggleGroup<PoemLength>
        label="Length"
        options={[
          { value: 'short', label: 'Short' },
          { value: 'medium', label: 'Medium' },
          { value: 'long', label: 'Long' },
        ]}
        value={value.poemLength}
        onChange={(v) => set('poemLength', v)}
      />

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Options</Label>
        <div className="space-y-2">
          <BoolToggle
            label="Use rhyme"
            description="Deliberate rhyme — do not force it"
            value={value.rhyme}
            onChange={(v) => set('rhyme', v)}
          />
          <BoolToggle
            label="Metaphor-heavy"
            description="Layer figurative language throughout"
            value={value.metaphorHeavy}
            onChange={(v) => set('metaphorHeavy', v)}
          />
          <BoolToggle
            label="Avoid clichés"
            description="Force unfamiliar paths through familiar feeling"
            value={value.avoidCliches}
            onChange={(v) => set('avoidCliches', v)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">
          Target Reading Experience
        </Label>
        <div className="flex flex-wrap gap-2">
          {READING_EXPERIENCES.map((exp) => (
            <button
              key={exp.value}
              onClick={() => set('targetExperience', exp.value)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs border transition-all',
                value.targetExperience === exp.value
                  ? 'border-primary/60 bg-primary/10 text-foreground'
                  : 'border-border/40 text-muted-foreground hover:border-border hover:text-foreground'
              )}
            >
              {exp.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
