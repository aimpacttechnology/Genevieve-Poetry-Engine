// Core data models for the Geneviève Poetry Engine

export interface PoetryIdeaInput {
  topic: string
  emotionalTone: string
  centralImage: string
  themeOrQuestion: string
  contextSeed?: string
}

export type PoetryFormId =
  | 'free-verse'
  | 'sonnet'
  | 'haiku'
  | 'villanelle'
  | 'ballad'
  | 'ode'
  | 'elegy'
  | 'acrostic'
  | 'spoken-word'
  | 'prose-poem'

export interface PoetryForm {
  id: PoetryFormId
  name: string
  description: string
  origin: string
  bestFor: string
  structureRules: string[]
  emotionalStrengths: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  promptHints: string[]
  sampleTemplate: string
}

export type DictionRegister = 'archaic' | 'classical' | 'modern' | 'colloquial'
export type ImageryDensity = 'minimalist' | 'moderate' | 'dense'
export type PoemLength = 'short' | 'medium' | 'long'
export type PointOfView = 'first-person' | 'second-person' | 'third-person'
export type ReadingExperience =
  | 'haunting'
  | 'tender'
  | 'sharp'
  | 'mystical'
  | 'mournful'
  | 'joyful'
  | 'fierce'
  | 'meditative'
  | 'unsettling'
  | 'intimate'

export interface StyleConstraints {
  tone: string
  pointOfView: PointOfView
  lineLengthPreference: 'short' | 'medium' | 'long' | 'varied'
  rhyme: boolean
  imageryDensity: ImageryDensity
  diction: DictionRegister
  metaphorHeavy: boolean
  poemLength: PoemLength
  avoidCliches: boolean
  targetExperience: ReadingExperience | ''
}

export interface PoetryPrompt {
  id: string
  ideaInput: PoetryIdeaInput
  form: PoetryFormId
  constraints: StyleConstraints
  generatedPrompt: string
  createdAt: Date
}

export interface PoemDraft {
  id: string
  promptId: string
  content: string
  title?: string
  revisionHistory: RevisionAction[]
  createdAt: Date
}

export type RevisionActionType =
  | 'strengthen-imagery'
  | 'reduce-cliches'
  | 'improve-ending'
  | 'increase-musicality'
  | 'tighten-line-breaks'
  | 'make-intimate'
  | 'make-darker'
  | 'make-restrained'
  | 'concretize-abstractions'

export interface RevisionAction {
  type: RevisionActionType
  label: string
  description: string
  appliedAt?: Date
}

export interface PoetryDevice {
  name: string
  examples: string[]
  explanation: string
}

export interface AnalysisResult {
  draftId: string
  imageryDensity: 'sparse' | 'moderate' | 'rich'
  repetitionNotes: string[]
  metaphorUsage: string[]
  abstractVsConcrete: string
  likelyTone: string
  formCompliance: string
  linBreakObservations: string[]
  rhythmNotes: string
  devicesFound: PoetryDevice[]
  suggestions: string[]
}

// Session state (for future persistence layer)
export interface CompositionSession {
  id: string
  ideaInput: PoetryIdeaInput
  selectedForm: PoetryFormId | null
  styleConstraints: StyleConstraints
  generatedPrompt: PoetryPrompt | null
  drafts: PoemDraft[]
  currentDraftId: string | null
  analysis: AnalysisResult | null
  createdAt: Date
  updatedAt: Date
}
