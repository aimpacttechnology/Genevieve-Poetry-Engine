import type { PoetryIdeaInput, PoetryForm, StyleConstraints, PoetryPrompt } from '@/types'
import { generateId } from '@/lib/utils'

const POV_LABELS: Record<string, string> = {
  'first-person': 'first person ("I")',
  'second-person': 'second person ("you")',
  'third-person': 'third person ("she/he/they")',
}

const DICTION_LABELS: Record<string, string> = {
  archaic: 'archaic, elevated diction — old forms and inversions welcome',
  classical: 'classical and formal — clear, measured, unhurried',
  modern: 'contemporary — accessible but precise',
  colloquial: 'colloquial and intimate — close to speech',
}

const EXPERIENCE_LABELS: Record<string, string> = {
  haunting: 'leave a haunting residue in the reader',
  tender: 'arrive with tenderness and vulnerability',
  sharp: 'cut cleanly — no excess',
  mystical: 'open into the numinous or strange',
  mournful: 'carry a weight of mourning',
  joyful: 'hold genuine, unsentimental joy',
  fierce: 'press with urgency and heat',
  meditative: 'slow the reader to stillness',
  unsettling: 'leave the reader slightly off-balance',
  intimate: 'feel spoken directly to one person',
}

export function buildPoetryPrompt(
  idea: PoetryIdeaInput,
  form: PoetryForm,
  constraints: StyleConstraints
): PoetryPrompt {
  const sections: string[] = []

  // Form and structure instruction
  sections.push(
    `Write a ${form.name.toLowerCase()} poem.` +
      (form.structureRules.length
        ? ` Follow these structural requirements: ${form.structureRules.join('; ')}.`
        : '')
  )

  // Core subject
  sections.push(
    `The poem is about: ${idea.topic}.` +
      (idea.themeOrQuestion ? ` The central question or theme is: ${idea.themeOrQuestion}.` : '')
  )

  // Emotional tone
  sections.push(`The emotional tone should be: ${idea.emotionalTone}.`)

  // Imagery
  if (idea.centralImage) {
    sections.push(
      `Build around this central image or symbol: "${idea.centralImage}". Let it carry meaning without over-explaining it.`
    )
  }

  // Context / story seed
  if (idea.contextSeed) {
    sections.push(`Additional context: ${idea.contextSeed}`)
  }

  // Style constraints
  const styleNotes: string[] = []

  styleNotes.push(`Write in ${POV_LABELS[constraints.pointOfView] || constraints.pointOfView}.`)
  styleNotes.push(DICTION_LABELS[constraints.diction] || `Diction: ${constraints.diction}.`)

  if (constraints.rhyme) {
    styleNotes.push('Use rhyme deliberately — do not force it.')
  } else {
    styleNotes.push('Do not use rhyme. Let the language work without it.')
  }

  const imageryMap: Record<string, string> = {
    minimalist: 'Use imagery sparingly — every image must earn its place.',
    moderate: 'Balance imagery and statement.',
    dense: 'Layer the imagery richly — metaphor upon metaphor.',
  }
  styleNotes.push(imageryMap[constraints.imageryDensity] || '')

  styleNotes.push(
    constraints.metaphorHeavy
      ? 'Lean heavily on metaphor and figurative language.'
      : 'Favor directness over metaphor — let clarity do the work.'
  )

  const lengthMap: Record<string, string> = {
    short: 'Keep the poem short — under 12 lines.',
    medium: 'Aim for 15–25 lines.',
    long: 'Allow the poem to breathe — 30 lines or more is appropriate.',
  }
  styleNotes.push(lengthMap[constraints.poemLength] || '')

  if (constraints.avoidCliches) {
    styleNotes.push(
      'Actively avoid clichés — if a phrase feels familiar, find another way. Surprise is preferable to comfort.'
    )
  }

  if (constraints.tone) {
    styleNotes.push(`Overall tone: ${constraints.tone}.`)
  }

  sections.push(styleNotes.join(' '))

  // Reader experience
  if (constraints.targetExperience) {
    const experienceNote = EXPERIENCE_LABELS[constraints.targetExperience]
    if (experienceNote) {
      sections.push(`The poem should ${experienceNote}.`)
    }
  }

  // Craft note from form hints
  if (form.promptHints.length) {
    sections.push(`Craft guidance: ${form.promptHints.join(' ')}`)
  }

  const generatedPrompt = sections.filter(Boolean).join('\n\n')

  return {
    id: generateId(),
    ideaInput: idea,
    form: form.id,
    constraints,
    generatedPrompt,
    createdAt: new Date(),
  }
}
