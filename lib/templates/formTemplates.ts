import type { PoetryFormId } from '@/types'

export interface TemplateLine {
  id: string
  label: string
  hint: string
  type: 'input' | 'textarea'
  placeholder?: string
  refrainOf?: string // mirrors the value of another line (villanelle refrains)
}

export interface TemplateGroup {
  heading?: string
  lines: TemplateLine[]
}

export interface FormTemplate {
  formId: PoetryFormId
  intro: string
  groups: TemplateGroup[]
  isAcrostic?: true
  assemble: (values: Record<string, string>) => string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const inp = (id: string, label: string, hint: string, placeholder = ''): TemplateLine => ({
  id, label, hint, type: 'input', placeholder,
})
const box = (id: string, label: string, hint: string, placeholder = ''): TemplateLine => ({
  id, label, hint, type: 'textarea', placeholder,
})
const ref = (id: string, label: string, refrainOf: string): TemplateLine => ({
  id, label, hint: 'Refrain — repeats from stanza 1', type: 'input', refrainOf,
})

const val = (v: Record<string, string>, id: string) => v[id] || ''

// ─── Templates ──────────────────────────────────────────────────────────────

export const FORM_TEMPLATES: Record<PoetryFormId, FormTemplate> = {

  haiku: {
    formId: 'haiku',
    intro: 'Three lines. Two images in juxtaposition. A moment that stops time.',
    groups: [
      {
        lines: [
          inp('l1', 'Line 1 — 5 syllables', 'A concrete image — something visible, audible, tangible', 'old pond…'),
          inp('l2', 'Line 2 — 7 syllables', 'Expand the scene or introduce a second element', 'a frog leaps into the water'),
          inp('l3', 'Line 3 — 5 syllables', 'The cut — surprise, juxtapose, leave space', 'sound of silence'),
        ],
      },
    ],
    assemble: (v) => [val(v,'l1'), val(v,'l2'), val(v,'l3')].join('\n'),
  },

  sonnet: {
    formId: 'sonnet',
    intro: 'Fourteen lines, four groups. Build the argument, then turn it in the final couplet.',
    groups: [
      {
        heading: 'Quatrain 1 — ABAB — Introduce the subject',
        lines: [
          inp('q1l1', 'Line 1 (A)', 'Open the poem — place the reader in the situation'),
          inp('q1l2', 'Line 2 (B)', 'Develop or contrast'),
          inp('q1l3', 'Line 3 (A)', 'Rhymes with line 1'),
          inp('q1l4', 'Line 4 (B)', 'Rhymes with line 2 — close the quatrain'),
        ],
      },
      {
        heading: 'Quatrain 2 — CDCD — Complicate or deepen',
        lines: [
          inp('q2l1', 'Line 5 (C)', 'New angle, new image'),
          inp('q2l2', 'Line 6 (D)', ''),
          inp('q2l3', 'Line 7 (C)', 'Rhymes with line 5'),
          inp('q2l4', 'Line 8 (D)', 'Rhymes with line 6'),
        ],
      },
      {
        heading: 'Quatrain 3 — EFEF — Push toward the turn',
        lines: [
          inp('q3l1', 'Line 9 (E)', 'The volta begins here — start shifting'),
          inp('q3l2', 'Line 10 (F)', ''),
          inp('q3l3', 'Line 11 (E)', 'Rhymes with line 9'),
          inp('q3l4', 'Line 12 (F)', 'Rhymes with line 10'),
        ],
      },
      {
        heading: 'Couplet — GG — The turn',
        lines: [
          inp('cl1', 'Line 13 (G)', 'Surprise, subvert, or resolve'),
          inp('cl2', 'Line 14 (G)', 'Rhymes with line 13 — land it'),
        ],
      },
    ],
    assemble: (v) => [
      val(v,'q1l1'), val(v,'q1l2'), val(v,'q1l3'), val(v,'q1l4'), '',
      val(v,'q2l1'), val(v,'q2l2'), val(v,'q2l3'), val(v,'q2l4'), '',
      val(v,'q3l1'), val(v,'q3l2'), val(v,'q3l3'), val(v,'q3l4'), '',
      val(v,'cl1'),  val(v,'cl2'),
    ].join('\n'),
  },

  villanelle: {
    formId: 'villanelle',
    intro: 'Nineteen lines, two refrains. Repetition enacts obsession. Write A1 and A2 in stanza 1 — they return throughout.',
    groups: [
      {
        heading: 'Stanza 1 — Establish your two refrains',
        lines: [
          inp('a1', 'Line 1 — Refrain A1', 'This line will repeat. Make it ambiguous enough to change meaning each time.'),
          inp('s1b',  'Line 2 (b)',          'Interior line — rhymes with all b-lines'),
          inp('a2', 'Line 3 — Refrain A2', 'This line will also repeat. Pair with A1 — together they close the poem.'),
        ],
      },
      {
        heading: 'Stanza 2',
        lines: [
          inp('s2a',  'Line 4 (a)', 'Rhymes with A1/A2'),
          inp('s2b',  'Line 5 (b)', 'Rhymes with line 2'),
          ref('s2a1', 'Line 6 — Refrain A1 (repeats)', 'a1'),
        ],
      },
      {
        heading: 'Stanza 3',
        lines: [
          inp('s3a',  'Line 7 (a)', 'Rhymes with A1/A2'),
          inp('s3b',  'Line 8 (b)', 'Rhymes with line 2'),
          ref('s3a2', 'Line 9 — Refrain A2 (repeats)', 'a2'),
        ],
      },
      {
        heading: 'Stanza 4',
        lines: [
          inp('s4a',  'Line 10 (a)', 'Rhymes with A1/A2'),
          inp('s4b',  'Line 11 (b)', 'Rhymes with line 2'),
          ref('s4a1', 'Line 12 — Refrain A1 (repeats)', 'a1'),
        ],
      },
      {
        heading: 'Stanza 5',
        lines: [
          inp('s5a',  'Line 13 (a)', 'Rhymes with A1/A2'),
          inp('s5b',  'Line 14 (b)', 'Rhymes with line 2'),
          ref('s5a2', 'Line 15 — Refrain A2 (repeats)', 'a2'),
        ],
      },
      {
        heading: 'Closing Quatrain',
        lines: [
          inp('s6a',  'Line 16 (a)', 'Rhymes with A1/A2'),
          inp('s6b',  'Line 17 (b)', 'Rhymes with line 2'),
          ref('s6a1', 'Line 18 — Refrain A1 (repeats)', 'a1'),
          ref('s6a2', 'Line 19 — Refrain A2 (repeats)', 'a2'),
        ],
      },
    ],
    assemble: (v) => [
      val(v,'a1'), val(v,'s1b'), val(v,'a2'), '',
      val(v,'s2a'), val(v,'s2b'), val(v,'a1'), '',
      val(v,'s3a'), val(v,'s3b'), val(v,'a2'), '',
      val(v,'s4a'), val(v,'s4b'), val(v,'a1'), '',
      val(v,'s5a'), val(v,'s5b'), val(v,'a2'), '',
      val(v,'s6a'), val(v,'s6b'), val(v,'a1'), val(v,'a2'),
    ].join('\n'),
  },

  ballad: {
    formId: 'ballad',
    intro: 'A story told in quatrains. Open in the action. Let dialogue and consequence do the work.',
    groups: [
      {
        heading: 'Stanza 1 — Establish character and setting',
        lines: [
          inp('s1l1', 'Line 1 (A)', 'Open in the middle of things — no preamble', 'She rode through the darkening wood,'),
          inp('s1l2', 'Line 2 (B)', ''),
          inp('s1l3', 'Line 3 (C)', 'Rhyme optional — ABCB or ABAB'),
          inp('s1l4', 'Line 4 (B)', 'Rhymes with line 2'),
        ],
      },
      {
        heading: 'Stanza 2 — Introduce the conflict or desire',
        lines: [
          inp('s2l1', 'Line 1', ''),
          inp('s2l2', 'Line 2', ''),
          inp('s2l3', 'Line 3', ''),
          inp('s2l4', 'Line 4', 'Rhymes with line 2'),
        ],
      },
      {
        heading: 'Stanza 3 — Complication or turning point',
        lines: [
          inp('s3l1', 'Line 1', ''),
          inp('s3l2', 'Line 2', ''),
          inp('s3l3', 'Line 3', ''),
          inp('s3l4', 'Line 4', 'Rhymes with line 2'),
        ],
      },
      {
        heading: 'Final Stanza — Consequence or elegy',
        lines: [
          inp('s4l1', 'Line 1', ''),
          inp('s4l2', 'Line 2', ''),
          inp('s4l3', 'Line 3', ''),
          inp('s4l4', 'Line 4', 'Land the poem here'),
        ],
      },
    ],
    assemble: (v) => [
      val(v,'s1l1'), val(v,'s1l2'), val(v,'s1l3'), val(v,'s1l4'), '',
      val(v,'s2l1'), val(v,'s2l2'), val(v,'s2l3'), val(v,'s2l4'), '',
      val(v,'s3l1'), val(v,'s3l2'), val(v,'s3l3'), val(v,'s3l4'), '',
      val(v,'s4l1'), val(v,'s4l2'), val(v,'s4l3'), val(v,'s4l4'),
    ].join('\n'),
  },

  'free-verse': {
    formId: 'free-verse',
    intro: 'No required meter or rhyme. Each decision — the line break, the pause, the image — is yours.',
    groups: [
      {
        heading: 'Opening — place the reader immediately',
        lines: [box('open', 'Opening stanza', 'Begin with an image, not a declaration. Something concrete.', 'The window still has her fingerprints on it.')],
      },
      {
        heading: 'Development — expand or complicate',
        lines: [box('dev', 'Middle stanza', 'Deepen the image, introduce tension or contrast.')],
      },
      {
        heading: 'Turn — shift something',
        lines: [box('turn', 'Turn stanza', 'A change in perspective, time, tone, or scale.')],
      },
      {
        heading: 'Closing — let the poem find its end',
        lines: [box('close', 'Closing stanza', 'Earn the ending. It does not need to resolve — it needs to land.')],
      },
    ],
    assemble: (v) => [val(v,'open'), val(v,'dev'), val(v,'turn'), val(v,'close')].filter(Boolean).join('\n\n'),
  },

  ode: {
    formId: 'ode',
    intro: 'A poem of praise and meditation. Address the subject directly. Allow the poem to circle, not march.',
    groups: [
      {
        heading: 'Invocation — address the subject',
        lines: [box('inv', 'Opening', 'Speak directly to what you are praising. Name it, call to it.', 'O kettle, keeper of slow mornings,')],
      },
      {
        heading: 'First Meditation — a quality or memory',
        lines: [box('med1', 'First meditation', 'Describe one thing about the subject with full attention.')],
      },
      {
        heading: 'Complication — a shadow or paradox',
        lines: [box('comp', 'Complication', 'What does this subject cost, conceal, or contradict?')],
      },
      {
        heading: 'Return to Praise — elevated and changed',
        lines: [box('ret', 'Return', 'Come back to praise, but transformed by what came before.')],
      },
    ],
    assemble: (v) => [val(v,'inv'), val(v,'med1'), val(v,'comp'), val(v,'ret')].filter(Boolean).join('\n\n'),
  },

  elegy: {
    formId: 'elegy',
    intro: 'A poem of mourning. Let the loss be specific. Resist easy consolation.',
    groups: [
      {
        heading: 'Lament — establish the loss',
        lines: [box('lam', 'Lament', 'Name the loss without flinching. Don\'t soften it yet.', 'Three weeks now and I still set two cups.')],
      },
      {
        heading: 'Memory — specific images',
        lines: [box('mem', 'Memory', 'One or two precise sensory memories — details only you would know.')],
      },
      {
        heading: 'Turn — attempt at meaning or acceptance',
        lines: [box('turn', 'Turn', 'What do you reach for? What do you find there?')],
      },
      {
        heading: 'Closing — acceptance, refusal, or open wound',
        lines: [box('close', 'Closing', 'The poem doesn\'t have to arrive at peace. It has to be honest.')],
      },
    ],
    assemble: (v) => [val(v,'lam'), val(v,'mem'), val(v,'turn'), val(v,'close')].filter(Boolean).join('\n\n'),
  },

  acrostic: {
    formId: 'acrostic',
    isAcrostic: true,
    intro: 'Each line begins with the next letter of your chosen word. The constraint should feel invisible — the lines must stand alone.',
    groups: [],
    assemble: (v) => {
      const word = (v.__word ?? '').toUpperCase()
      return word.split('').map((_, i) => val(v, `acl${i}`)).join('\n')
    },
  },

  'spoken-word': {
    formId: 'spoken-word',
    intro: 'Written for the voice. Read every draft aloud. Repetition is structure, not decoration.',
    groups: [
      {
        heading: 'Hook — grab the room',
        lines: [box('hook', 'Opening hook', 'Start with something that demands attention. A question, a declaration, an image that cuts.', 'They tell us our bodies are not our own.')],
      },
      {
        heading: 'Rising argument or feeling',
        lines: [box('rise', 'Rising section', 'Build. Use repetition. Let the breath and rhythm do work.')],
      },
      {
        heading: 'Turn — the most personal moment',
        lines: [box('turn', 'Turn', 'This is where the poem becomes most specific and most vulnerable.')],
      },
      {
        heading: 'Closing — what leaves them still',
        lines: [box('close', 'Closing', 'Land hard. The final lines should leave the room quiet or alive.')],
      },
    ],
    assemble: (v) => [val(v,'hook'), val(v,'rise'), val(v,'turn'), val(v,'close')].filter(Boolean).join('\n\n'),
  },

  'prose-poem': {
    formId: 'prose-poem',
    intro: 'Prose paragraphs with poem-level density. No line breaks. Every sentence earns its place.',
    groups: [
      {
        heading: 'Opening paragraph — image or scene, no setup',
        lines: [box('p1', 'Opening', 'Begin in the middle. No context, no explanation — just the thing itself.', 'The taxidermist\'s daughter grew up knowing the names for absence.')],
      },
      {
        heading: 'Middle — complication or associative leap',
        lines: [box('p2', 'Middle', 'Let the logic drift. The prose poem earns strangeness. Follow the image wherever it leads.')],
      },
      {
        heading: 'Closing — the sentence that changes everything',
        lines: [box('p3', 'Closing', 'The final sentence should reframe or detonate what came before.')],
      },
    ],
    assemble: (v) => [val(v,'p1'), val(v,'p2'), val(v,'p3')].filter(Boolean).join('\n\n'),
  },
}
