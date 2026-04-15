import type { PoemDraft, AnalysisResult, PoetryDevice } from '@/types'
import { generateId } from '@/lib/utils'

// Rule-based pattern lists for MVP analysis
const IMAGERY_WORDS = [
  'light', 'dark', 'shadow', 'fire', 'water', 'stone', 'sky', 'earth', 'blood',
  'hands', 'eyes', 'mouth', 'bone', 'wind', 'rain', 'snow', 'sea', 'river',
  'door', 'window', 'road', 'field', 'garden', 'moon', 'sun', 'star', 'night',
  'silence', 'smoke', 'glass', 'mirror', 'thread', 'blade', 'flesh', 'dust',
]

const METAPHOR_MARKERS = ['is', 'are', 'was', 'were', 'like', 'as if', 'as though', 'becomes', 'became']

const ABSTRACT_WORDS = [
  'love', 'hope', 'grief', 'faith', 'truth', 'beauty', 'justice', 'freedom',
  'pain', 'memory', 'longing', 'desire', 'fear', 'death', 'time', 'life',
  'soul', 'spirit', 'eternity', 'meaning', 'loss', 'joy', 'sorrow',
]

const CLICHE_PHRASES = [
  'broken heart', 'at the end of the day', 'time heals', 'rose-colored',
  'silver lining', 'storm of emotions', 'walls closing in', 'ray of sunshine',
  'butterflies in my stomach', 'speaks volumes', 'crystal clear',
  'at a crossroads', 'light at the end', 'kindred spirit',
]

const SOUND_DEVICES = {
  alliteration: /\b(\w)\w*\s+\1\w*/gi,
  assonance: /([aeiou])[^aeiou]*\1/gi,
}

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/\b\w+\b/g) || []
}

function countImageryWords(tokens: string[]): number {
  return tokens.filter((t) => IMAGERY_WORDS.includes(t)).length
}

function findRepetition(lines: string[]): string[] {
  const notes: string[] = []
  const firstWords = lines.map((l) => l.trim().split(' ')[0]?.toLowerCase()).filter(Boolean)
  const repeated = firstWords.filter((w, i) => firstWords.indexOf(w) !== i && w.length > 2)
  if (repeated.length > 0) {
    notes.push(`Anaphora detected — lines beginning with "${[...new Set(repeated)].join('", "')}"`)
  }
  const allWords = tokenize(lines.join(' '))
  const freq: Record<string, number> = {}
  allWords.forEach((w) => { if (w.length > 4) freq[w] = (freq[w] || 0) + 1 })
  const heavyRepeats = Object.entries(freq).filter(([, c]) => c > 2).map(([w]) => w)
  if (heavyRepeats.length) {
    notes.push(`Repeated words: "${heavyRepeats.slice(0, 4).join('", "')}" — consider whether this is intentional.`)
  }
  return notes
}

function detectMetaphors(text: string, tokens: string[]): string[] {
  const found: string[] = []
  METAPHOR_MARKERS.forEach((marker) => {
    const re = new RegExp(`\\b\\w+\\s+${marker}\\s+\\w+`, 'gi')
    const matches = text.match(re)
    if (matches) found.push(...matches.slice(0, 2))
  })
  return found.slice(0, 4)
}

function detectDevices(text: string, lines: string[]): PoetryDevice[] {
  const devices: PoetryDevice[] = []

  // Alliteration
  const allitLines = lines.filter((l) => {
    const words = l.trim().split(/\s+/)
    const initials = words.map((w) => w[0]?.toLowerCase()).filter(Boolean)
    return initials.length >= 2 && initials[0] === initials[1]
  })
  if (allitLines.length > 0) {
    devices.push({
      name: 'Alliteration',
      examples: allitLines.slice(0, 2),
      explanation: 'Repetition of initial consonant sounds — creates musicality and emphasis.',
    })
  }

  // Simile
  const simileLines = lines.filter((l) => /\blike\b|\bas\s+\w+\s+as\b/i.test(l))
  if (simileLines.length > 0) {
    devices.push({
      name: 'Simile',
      examples: simileLines.slice(0, 2),
      explanation: 'Explicit comparison using "like" or "as" — makes the abstract tangible.',
    })
  }

  // Enjambment (approximate: lines that don't end in punctuation)
  const enjambedLines = lines.filter((l) => l.trim() && !/[.!?;,]$/.test(l.trim()))
  if (enjambedLines.length > lines.length * 0.5) {
    devices.push({
      name: 'Enjambment',
      examples: enjambedLines.slice(0, 2),
      explanation: 'Lines run into the next without terminal punctuation — creates forward momentum and surprise.',
    })
  }

  // Repetition / Anaphora
  const firstWords = lines.map((l) => l.trim().split(' ')[0]?.toLowerCase()).filter(Boolean)
  const repeatedFirstWords = [...new Set(firstWords.filter((w, i) => firstWords.indexOf(w) !== i && w.length > 2))]
  if (repeatedFirstWords.length > 0) {
    devices.push({
      name: 'Anaphora',
      examples: repeatedFirstWords.map((w) => `Lines beginning with "${w}"`),
      explanation: 'Repetition at the start of successive lines — creates emphasis and incantatory rhythm.',
    })
  }

  return devices
}

export function analyzeDraft(draft: PoemDraft): AnalysisResult {
  const lines = draft.content.split('\n').filter((l) => l.trim())
  const text = draft.content
  const tokens = tokenize(text)

  // Imagery density
  const imageryCount = countImageryWords(tokens)
  const imageryRatio = imageryCount / Math.max(tokens.length, 1)
  const imageryDensity: AnalysisResult['imageryDensity'] =
    imageryRatio > 0.15 ? 'rich' : imageryRatio > 0.07 ? 'moderate' : 'sparse'

  // Abstract vs concrete
  const abstractCount = tokens.filter((t) => ABSTRACT_WORDS.includes(t)).length
  const abstractVsConcrete =
    abstractCount > imageryCount
      ? 'Leans abstract — more concrete imagery could ground the emotion.'
      : abstractCount === 0 && imageryCount > 0
      ? 'Strongly concrete — the images carry the meaning.'
      : 'Balanced between abstract statement and concrete image.'

  // Tone
  const toneWords: Record<string, string[]> = {
    mournful: ['grief', 'loss', 'dead', 'gone', 'mourn', 'weep', 'cry', 'sorrow', 'ache', 'silent'],
    fierce: ['fire', 'burn', 'fury', 'rage', 'strike', 'cut', 'blade', 'war', 'demand'],
    tender: ['soft', 'gentle', 'quiet', 'hold', 'hands', 'slow', 'still', 'small'],
    mystical: ['beyond', 'eternal', 'spirit', 'unknown', 'dark', 'strange', 'dream'],
  }
  let likelyTone = 'Neutral or mixed'
  let maxToneCount = 0
  for (const [tone, words] of Object.entries(toneWords)) {
    const count = tokens.filter((t) => words.includes(t)).length
    if (count > maxToneCount) {
      maxToneCount = count
      likelyTone = tone.charAt(0).toUpperCase() + tone.slice(1)
    }
  }

  // Clichés
  const foundCliches = CLICHE_PHRASES.filter((phrase) =>
    text.toLowerCase().includes(phrase.toLowerCase())
  )

  // Line break observations
  const lineLengths = lines.map((l) => l.trim().split(/\s+/).length)
  const avgLen = lineLengths.reduce((a, b) => a + b, 0) / Math.max(lineLengths.length, 1)
  const linBreakObservations: string[] = []
  if (avgLen < 4) linBreakObservations.push('Very short lines — creates staccato rhythm. Intentional fragmentation.')
  else if (avgLen > 10) linBreakObservations.push('Long lines — creates a more flowing, discursive movement.')
  else linBreakObservations.push('Moderate line length — balanced breath and movement.')

  const variedLines = lineLengths.filter((l) => Math.abs(l - avgLen) > 3).length
  if (variedLines > lines.length * 0.3) {
    linBreakObservations.push('Line lengths vary significantly — adds visual and rhythmic interest.')
  }

  // Rhythm
  const endPunctLines = lines.filter((l) => /[.!?]$/.test(l.trim())).length
  const rhythmNotes =
    endPunctLines < lines.length * 0.3
      ? 'Light punctuation — enjambment drives the poem forward. Watch for unintended run-ons.'
      : endPunctLines > lines.length * 0.7
      ? 'Heavy end-stopping — each line lands with finality. Creates deliberate, measured pace.'
      : 'Mix of end-stopped and enjambed lines — good rhythmic variety.'

  // Devices
  const devicesFound = detectDevices(text, lines)

  // Suggestions
  const suggestions: string[] = []
  if (imageryDensity === 'sparse') suggestions.push('Add at least one more concrete sensory image.')
  if (abstractCount > 3) suggestions.push('Replace one abstract word with a specific image or action.')
  if (foundCliches.length > 0) suggestions.push(`Consider revising: "${foundCliches.slice(0, 2).join('", "')}" — these phrases carry less weight.')`)
  if (lines.length > 0 && lines[lines.length - 1].split(' ').length > 8) {
    suggestions.push('The final line is long — consider whether a shorter landing is more powerful.')
  }
  if (devicesFound.length === 0) suggestions.push('The poem uses few distinct sound or figure devices. Consider adding one intentional musical element.')

  return {
    draftId: draft.id,
    imageryDensity,
    repetitionNotes: findRepetition(lines),
    metaphorUsage: detectMetaphors(text, tokens),
    abstractVsConcrete,
    likelyTone,
    formCompliance: 'See form requirements — manual verification recommended for strict forms like sonnet or villanelle.',
    linBreakObservations,
    rhythmNotes,
    devicesFound,
    suggestions,
  }
}
