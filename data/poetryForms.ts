import type { PoetryForm } from '@/types'

export const POETRY_FORMS: PoetryForm[] = [
  {
    id: 'free-verse',
    name: 'Free Verse',
    description:
      'Poetry without a fixed meter or rhyme scheme. The form follows the natural cadences of speech and feeling.',
    origin: 'Formalized in 19th-century France (vers libre) and American modernism, particularly Walt Whitman.',
    bestFor: 'Contemporary emotional expression, personal narrative, experimental voice.',
    structureRules: [
      'No required meter or rhyme',
      'Line breaks are the poet\'s choice',
      'Length is entirely flexible',
      'Rhythm comes from syntax and breath',
    ],
    emotionalStrengths: [
      'Maximum flexibility for voice',
      'Ideal for raw or complex emotion',
      'No formal constraint between speaker and reader',
    ],
    difficulty: 'beginner',
    promptHints: [
      'Let the line breaks create pauses that matter',
      'Use white space as silence',
      'Build rhythm through repetition of syntax, not end rhyme',
    ],
    sampleTemplate: `[Opening image — place the reader immediately]

[Turn — the emotional or intellectual shift]

[Resolution or question — let the poem earn its end]`,
  },
  {
    id: 'sonnet',
    name: 'Sonnet',
    description:
      'A 14-line poem with a strict structure. The Shakespearean sonnet builds through three quatrains to a closing couplet. The Petrarchan turns at line 9.',
    origin: 'Italy, 13th century. Perfected by Petrarch, then transformed by Shakespeare and Milton.',
    bestFor: 'Arguments, meditations on love or death, intellectual tensions that need resolution.',
    structureRules: [
      '14 lines total',
      'Shakespearean: ABAB CDCD EFEF GG (iambic pentameter)',
      'Petrarchan: ABBAABBA CDECDE (or CDCDCD)',
      'The volta (turn) changes direction — often at line 9 or 13',
    ],
    emotionalStrengths: [
      'Compression creates intensity',
      'The volta delivers emotional punch',
      'Ideal for argument, meditation, devotion',
    ],
    difficulty: 'advanced',
    promptHints: [
      'Build an argument in the first 12 lines',
      'Let the couplet surprise or subvert',
      'The volta should shift perspective, not just summarize',
    ],
    sampleTemplate: `Quatrain 1 — establish the situation (ABAB)
Quatrain 2 — complicate or deepen it (CDCD)
Quatrain 3 — push to the limit (EFEF)
Couplet — turn, resolve, or devastate (GG)`,
  },
  {
    id: 'haiku',
    name: 'Haiku',
    description:
      'A three-line Japanese form capturing a single moment of perception. The traditional 5-7-5 syllable structure holds a season word (kigo) and a cutting word (kireji).',
    origin: 'Japan, 17th century. Master poets: Matsuo Bashō, Yosa Buson, Kobayashi Issa.',
    bestFor: 'Stillness, nature, sudden perception, the ephemeral.',
    structureRules: [
      'Three lines: 5 syllables / 7 syllables / 5 syllables',
      'A kireji (cutting word) creates a pause or juxtaposition',
      'A kigo (season word) grounds the poem in time',
      'Two images that create meaning through contrast or proximity',
    ],
    emotionalStrengths: [
      'Radical compression',
      'The gap between images does the emotional work',
      'Leaves room for the reader to complete the thought',
    ],
    difficulty: 'intermediate',
    promptHints: [
      'Put two contrasting images next to each other without explaining the connection',
      'The third line should surprise or recontextualize the first two',
      'Resist the urge to tell — show only',
    ],
    sampleTemplate: `[5] first image — a moment in nature or world
[7] second image or context — expand slightly
[5] the cut — shift, juxtapose, or land`,
  },
  {
    id: 'villanelle',
    name: 'Villanelle',
    description:
      'A 19-line poem built from two refrains and two rhymes. The repetition creates obsession, insistence, and mounting emotion.',
    origin: 'French, 16th century. Dylan Thomas\'s "Do Not Go Gentle" is its most famous modern example.',
    bestFor: 'Obsession, grief, longing, cyclical thought, anything that returns.',
    structureRules: [
      '19 lines: five tercets (3-line stanzas) and a closing quatrain',
      'Two refrains: A1 and A2 (first and third lines of first stanza)',
      'Rhyme scheme: ABA throughout, ending ABAA',
      'The refrains shift in meaning as the poem progresses',
    ],
    emotionalStrengths: [
      'Repetition enacts obsession',
      'Each return of the refrain lands differently',
      'The final quatrain is devastating when done well',
    ],
    difficulty: 'advanced',
    promptHints: [
      'Choose refrains that are slightly ambiguous — meaning should deepen over repetitions',
      'Each stanza should earn the return of the refrain',
      'The middle stanzas are where the real poem lives',
    ],
    sampleTemplate: `A1 (refrain 1) — aba
      — aba
A2 (refrain 2) — aba
      — aba
A1 — aba
      — aba
A2 — aba
      — aba
A1 — abaa
A2`,
  },
  {
    id: 'ballad',
    name: 'Ballad',
    description:
      'A narrative poem that tells a story, often of love, loss, or tragedy. Built in quatrains with a strong, musical rhythm.',
    origin: 'Medieval oral tradition across Europe. Later popularized by the Romantics.',
    bestFor: 'Storytelling, myth, tragedy, love gone wrong, moral tales.',
    structureRules: [
      'Quatrains (4-line stanzas)',
      'Typical meter: alternating 8 and 6 syllables (ballad meter)',
      'Rhyme scheme: ABCB or ABAB',
      'Often uses repetition and refrain',
      'Dialogue and action drive the narrative',
    ],
    emotionalStrengths: [
      'Musicality makes it memorable',
      'Story structure carries emotional weight naturally',
      'Refrain creates a hypnotic quality',
    ],
    difficulty: 'intermediate',
    promptHints: [
      'Open in the middle of the action — no lengthy setup',
      'Use dialogue to reveal character and tension',
      'The final stanza should deliver the emotional consequence',
    ],
    sampleTemplate: `[Stanza 1] — establish character and setting
[Stanza 2] — introduce the conflict or desire
[Stanzas 3–n] — complications, action, dialogue
[Final stanza] — consequence or elegy`,
  },
  {
    id: 'ode',
    name: 'Ode',
    description:
      'An elevated, meditative poem in praise of something — a person, idea, object, or experience. The form allows digression and apostrophe.',
    origin: 'Ancient Greece (Pindar, Horace). Revived by Keats, Shelley, and Neruda.',
    bestFor: 'Celebration, reverence, grief elevated to praise, cataloguing beauty.',
    structureRules: [
      'No fixed length or strict meter in modern odes',
      'Often addressed directly to the subject (apostrophe)',
      'Three traditional parts: strophe, antistrophe, epode',
      'Tone should be elevated but not pompous',
    ],
    emotionalStrengths: [
      'Permission to linger and celebrate',
      'Direct address creates intimacy',
      'Can contain contradictions — praise and grief coexist',
    ],
    difficulty: 'intermediate',
    promptHints: [
      'Address the subject directly at least once',
      'Allow the poem to circle and return, rather than march forward',
      'Earn the elevation — start grounded and rise',
    ],
    sampleTemplate: `[Opening invocation — address the subject]
[First meditation — a quality or memory]
[Complication — a shadow, a loss, a paradox]
[Return to praise — elevated, changed]`,
  },
  {
    id: 'elegy',
    name: 'Elegy',
    description:
      'A poem of mourning and meditation on loss, death, or the passage of time. The elegy typically moves from grief toward acceptance — or refuses to.',
    origin: 'Ancient Greece. Milton\'s "Lycidas," Gray\'s "Elegy," Tennyson\'s "In Memoriam."',
    bestFor: 'Grief, loss, memory, tribute, mortality.',
    structureRules: [
      'No fixed form — the elegy is defined by purpose, not structure',
      'Traditional arc: lament → praise → consolation',
      'Modern elegies often resist consolation',
      'Can be personal or public (elegy for a person, place, era)',
    ],
    emotionalStrengths: [
      'Permission to be slow and tender',
      'The form carries cultural weight — feels earned',
      'The refusal of comfort is itself a poetic gesture',
    ],
    difficulty: 'intermediate',
    promptHints: [
      'Resist easy consolation — let the grief breathe',
      'The subject should live in detail, not abstraction',
      'The ending does not need to arrive at peace',
    ],
    sampleTemplate: `[Opening — establish the loss]
[Body — specific memories, images, details]
[Turn — attempt at meaning or consolation]
[Closing — refusal, acceptance, or open wound]`,
  },
  {
    id: 'acrostic',
    name: 'Acrostic',
    description:
      'A poem in which the first letters of each line spell out a word, name, or phrase. The constraint becomes a secret structure.',
    origin: 'Ancient Hebrew poetry (Psalms), Greek, and Roman traditions.',
    bestFor: 'Dedication, wordplay, gifts, named subjects, secret messages.',
    structureRules: [
      'First letter of each line spells the hidden word vertically',
      'No required meter or length',
      'The constraint should feel invisible — lines should read naturally',
      'Variations: telestich (last letters), mesostich (middle letters)',
    ],
    emotionalStrengths: [
      'Structural surprise when the hidden word is revealed',
      'Personal and intimate when used for names',
      'Constraint forces unexpected word choices',
    ],
    difficulty: 'beginner',
    promptHints: [
      'Write the poem first, then retrofit the acrostic — it\'s easier',
      'The acrostic word should relate meaningfully to the poem\'s content',
      'Don\'t sacrifice the line for the letter — the poem must stand alone',
    ],
    sampleTemplate: `[First letter = first letter of word]
[First letter = second letter of word]
... and so on`,
  },
  {
    id: 'spoken-word',
    name: 'Spoken Word',
    description:
      'Poetry written for performance: the voice, body, and room are part of the instrument. Rhythm, repetition, and direct address dominate.',
    origin: 'African oral tradition, the Harlem Renaissance, the Beat poets, Slam poetry (1980s–present).',
    bestFor: 'Performance, political speech, personal testimony, communal experience.',
    structureRules: [
      'Written for the ear, not the page',
      'Repetition and anaphora (repeated opening phrases) drive momentum',
      'Line breaks may indicate pause or breath, not visual form',
      'Direct address to audience is common',
      'Rhythm is often syncopated, jazzy, or incantatory',
    ],
    emotionalStrengths: [
      'Immediate emotional impact',
      'Community and witness — the audience is part of the poem',
      'Political and personal can coexist at full volume',
    ],
    difficulty: 'intermediate',
    promptHints: [
      'Read every draft aloud — if it doesn\'t work in voice, revise',
      'Use repetition structurally, not decoratively',
      'The ending should land hard — a spoken word poem earns silence',
    ],
    sampleTemplate: `[Opening hook — grab the room]
[Rising refrain — build the argument or feeling]
[Turn — the most personal or political moment]
[Closing — the thing that leaves them still]`,
  },
  {
    id: 'prose-poem',
    name: 'Prose Poem',
    description:
      'Poetry written in continuous prose — no line breaks — but with the compression, imagery, and attention of verse. The paragraph is the unit of breath.',
    origin: 'France, mid-19th century. Baudelaire\'s "Le Spleen de Paris." Later: Russell Edson, Claudia Rankine.',
    bestFor: 'Dream logic, interior monologue, hybrid narrative, surrealism, sustained metaphor.',
    structureRules: [
      'Written in prose paragraphs, not verse lines',
      'Sentence rhythm replaces line breaks',
      'Density of imagery and language is poem-level, not prose-level',
      'Usually short — a few paragraphs at most',
    ],
    emotionalStrengths: [
      'The prose surface can mask or reveal the poem\'s inner logic',
      'Surrealism and dream-logic feel more natural in prose',
      'Can move between registers quickly',
    ],
    difficulty: 'intermediate',
    promptHints: [
      'Every sentence should earn its place — no filler',
      'Use the paragraph break as a structural moment',
      'Let the images be strange — the prose container makes strangeness readable',
    ],
    sampleTemplate: `[Opening paragraph — image or scene, no setup]
[Middle — complication, drift, or associative leap]
[Closing — a sentence that changes everything before it]`,
  },
]

export const POETRY_FORM_MAP = Object.fromEntries(
  POETRY_FORMS.map((f) => [f.id, f])
) as Record<string, PoetryForm>
