import type { PoetryPrompt, PoemDraft } from '@/types'
import { generateId } from '@/lib/utils'

// Mock poems keyed by form — demonstrable immediately, replaceable with live API
const MOCK_POEMS: Record<string, { title: string; content: string }[]> = {
  'free-verse': [
    {
      title: 'The Weight of What Remains',
      content: `I keep the window open in winter
not for the cold
but for the sound of the street below —
the way voices carry
without meaning to,
the way you still speak
in verb tenses that assume you are here.

There is no ceremony for this.
Only the drawer you opened every morning
and what it holds now —
the ordinary made
unbearable
by repetition.

I do not close the window.
I let the cold do what it will.`,
    },
    {
      title: 'Cartography',
      content: `She drew maps of the places she had not been —
coastlines invented from desire,
mountains named after silences
she had not yet learned to carry.

The legend was incomplete.
It always is.
What we lose cannot be indexed.
What we want cannot be
accurately scaled.

Still she drew.
Still the pen moved
across the white expanse
as if destination were a kind of faith.`,
    },
  ],
  sonnet: [
    {
      title: 'After the Season',
      content: `The orchard stands stripped bare of all its weight,
each branch a line drawn clean against the grey.
We walked here once when summer held its state
and everything we meant was left to say.

The apples fell before we thought to keep them,
the sweetness left to waste along the ground.
I should have known that silence meant to steep them
in something more than words that don't compound.

Now winter asks what summer made so easy:
the skin of things, the warmth we took for true.
The reckoning is slow and somewhat queasy —
what's left when nothing ordinary's new?

  A stripped tree still stands clean against the sky.
  What held us once does not require goodbye.`,
    },
  ],
  haiku: [
    {
      title: '',
      content: `first snow of the year —
the dog still looks for the cat
in the empty chair`,
    },
    {
      title: '',
      content: `she leaves no note
the kitchen still smells of her
coffee, cooling now`,
    },
  ],
  villanelle: [
    {
      title: 'What the Body Knows',
      content: `The body keeps what the mind lets go.
We carry our losses in muscle and bone.
There is no forgetting what the body knows.

The hands remember the weight of the snow,
the throat the particular pitch of a moan.
The body keeps what the mind lets go.

The years revise what we think we know —
the names, the faces, the places we've grown —
but there is no forgetting what the body knows.

What left without asking still undertows:
the way she laughed, the angle of sunlight thrown.
The body keeps what the mind lets go.

We do not choose what persists below
the story we tell of what we have known.
There is no forgetting what the body knows.

So grieve if you must, let the damage show,
let the long thing out before you atone.
The body keeps what the mind lets go.
There is no forgetting what the body knows.`,
    },
  ],
  ballad: [
    {
      title: 'The River Road',
      content: `He left on a Tuesday, before the light,
with nothing but a bag and a name.
He told no one where he meant to go
and no one asked when he came.

The river road winds south of town,
past the mill and the broken gate.
He walked it once and did not look back.
He walked it early and walked it late.

They said he had a reason going.
They said he had a wound.
But all they saw was the empty chair
and the silence in the room.

The river still runs, the road still holds
the shape of a man's long stride.
Some journeys are not departures at all —
just somewhere good to hide.`,
    },
  ],
  ode: [
    {
      title: 'Ode to the Unfinished Thing',
      content: `You sit on the desk, half-said,
your last line trailed off somewhere
between intention and the hour
it became too late to continue.

You are not failure.
You are evidence of the attempt —
the reaching for a shape
not yet in the language.

I do not throw you out.
I leave you where you rest,
a promissory note
against the morning
when I will know
what it was you were becoming.

Most things worth making
spend some time like this —
half-formed, unclaimed,
waiting for the second thought
that is really the first one
held long enough
to become real.`,
    },
  ],
  elegy: [
    {
      title: 'For the Places We Did Not Return To',
      content: `There are rooms I will not walk through again,
not because they are locked
but because I have come to understand
what it means to let something remain
exactly as it was
in the last moment I was careless enough
to take it for granted.

The window faced south.
The light was the color of weak tea.
You complained about the draughts
and we did nothing about it.

This is not regret exactly.
This is something that has no word yet —
the specific weight
of a room you cannot go back to
not because it no longer exists
but because you do not.

I mean: because you have changed
into someone the room would not recognize.

I mean: because the draughts are still there
and there is no one left to complain.`,
    },
  ],
  acrostic: [
    {
      title: 'North',
      content: `Nothing moves in this cold like intention —
Over the ice, a bird finds its line.
Reason is what we call it afterward.
The truth is we go because we are called.
Home is whatever we make of arrival.`,
    },
  ],
  'spoken-word': [
    {
      title: 'What I Mean When I Say Fine',
      content: `Fine means I slept.
Fine means I ate.
Fine means the thing I wanted to say
went back down before it reached my mouth.

Fine is a word I've been using
since I was old enough to know
that rooms fill differently
depending on what you bring into them —

and I have brought enough already.

Say I'm fine and the room stays level.
Say I'm fine and no one has to
rearrange their afternoon.
Say I'm fine and we can go on
talking about whatever comes next
without the particular weight
of what came before.

I am learning that fine is a door, not a wall.
I am learning that the difference matters.
I am learning — still learning —
when to let you in.`,
    },
  ],
  'prose-poem': [
    {
      title: 'The Room Where We Kept the Extra Chairs',
      content: `There was a room in the house we rented for three years that we called the extra room and filled with chairs. Not all at once. First the folding chair from the kitchen we stopped using. Then the wooden chair from the office when we moved the desk to the bedroom. Then the small chair from the porch. By the end there were seven chairs in that room and we never spoke of it. When people came to visit we would take the chairs out and no one asked why they lived in there together in the dark. I think we understood something about the chairs that we couldn't say about ourselves. They needed a room where nothing was required of them. So did we. So did we.`,
    },
  ],
}

const DEFAULT_MOCK: { title: string; content: string } = {
  title: 'Draft',
  content: `Begin with an image —
something you can see.

Let it carry weight
without being asked.

The rest will come.

This is a placeholder draft.
Connect a language model
to generate real poems
from your prompt.`,
}

export async function generateMockPoem(prompt: PoetryPrompt): Promise<PoemDraft> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const formPoems = MOCK_POEMS[prompt.form] || []
  const poem = formPoems[Math.floor(Math.random() * formPoems.length)] || DEFAULT_MOCK

  return {
    id: generateId(),
    promptId: prompt.id,
    title: poem.title,
    content: poem.content,
    revisionHistory: [],
    createdAt: new Date(),
  }
}

export async function generateMockRevision(
  draft: PoemDraft,
  revisionType: string
): Promise<PoemDraft> {
  await new Promise((resolve) => setTimeout(resolve, 900))

  // Simple mock revision: append a note showing what would change
  const revisionNotes: Record<string, string> = {
    'strengthen-imagery': '— [imagery strengthened: abstractions replaced with sensory detail]',
    'reduce-cliches': '— [clichés reduced: common phrases replaced with fresher language]',
    'improve-ending': '— [ending revised: final lines tightened for impact]',
    'increase-musicality': '— [musicality increased: sound patterns reinforced]',
    'tighten-line-breaks': '— [line breaks tightened: enjambments reconsidered]',
    'make-intimate': '— [voice made more intimate: closer second-person address]',
    'make-darker': '— [tone darkened: shadows deepened, resolution withheld]',
    'make-restrained': '— [language made more restrained: excess trimmed]',
    'concretize-abstractions': '— [abstractions made concrete: named, specific, embodied]',
  }

  const note = revisionNotes[revisionType] || '— [revision applied]'

  return {
    ...draft,
    id: generateId(),
    content: draft.content + `\n\n${note}\n(Connect a real LLM to generate live revisions.)`,
    revisionHistory: [
      ...draft.revisionHistory,
      {
        type: revisionType as PoemDraft['revisionHistory'][number]['type'],
        label: revisionType,
        description: note,
        appliedAt: new Date(),
      },
    ],
  }
}
