import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { analyzeDraft } from '@/lib/analysis/analyzer'
import { generateId } from '@/lib/utils'
import type { PoetryPrompt, PoemDraft, RevisionActionType } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API,
})

const REVISION_INSTRUCTIONS: Record<RevisionActionType, string> = {
  'strengthen-imagery': 'Strengthen the imagery. Replace weak or vague images with specific, sensory, concrete ones. Do not change the poem\'s subject or emotional core.',
  'reduce-cliches': 'Identify and revise any clichéd phrases or predictable language. Find fresher, more precise alternatives that carry the same meaning.',
  'improve-ending': 'Improve the ending. The final lines should land with more weight, surprise, or resonance. The conclusion should feel earned.',
  'increase-musicality': 'Increase the musicality of the poem. Attend to sound — consider assonance, consonance, rhythm, and the breath of the lines. Do not force rhyme unless it is already present.',
  'tighten-line-breaks': 'Tighten the line breaks. Each line should break with intention — at a moment of tension, surprise, or breath. Remove any lines that are doing nothing.',
  'make-intimate': 'Make the poem more intimate. Bring the voice closer — more personal, more direct, as if spoken to one person.',
  'make-darker': 'Deepen the darkness of the poem. Let shadow, grief, weight, or unease come forward without becoming melodramatic.',
  'make-restrained': 'Make the poem more restrained. Cut excess. Let silence and white space do more work. Resist the urge to explain.',
  'concretize-abstractions': 'Identify abstract statements and replace them with concrete images or actions that imply the same meaning. Show, do not name.',
}

async function generatePoem(prompt: PoetryPrompt): Promise<PoemDraft> {
  const systemPrompt = `You are a skilled, serious poet and poetry editor. You write with craft, precision, and restraint. You do not produce generic AI-sounding verse. Every word is deliberate. You avoid sentimentality, cliché, and vague abstraction. You write poems that surprise.

When given a composition prompt, produce only the poem itself — no preamble, no explanation, no title unless one feels essential. If you include a title, put it on the first line followed by a blank line.`

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: prompt.generatedPrompt,
      },
    ],
  })

  const content = message.content[0]
  const text = content.type === 'text' ? content.text.trim() : ''

  // Split off title if present (first line followed by blank line)
  const lines = text.split('\n')
  let title: string | undefined
  let body = text

  if (lines.length > 2 && lines[1].trim() === '') {
    title = lines[0].trim()
    body = lines.slice(2).join('\n').trim()
  }

  return {
    id: generateId(),
    promptId: prompt.id,
    title,
    content: body,
    revisionHistory: [],
    createdAt: new Date(),
  }
}

async function revisePoem(draft: PoemDraft, revisionType: RevisionActionType): Promise<PoemDraft> {
  const instruction = REVISION_INSTRUCTIONS[revisionType]

  const systemPrompt = `You are a skilled poetry editor. You revise poems with precision and care. You make only the changes the instruction calls for. You preserve the poet's voice and the poem's core subject. You return only the revised poem — no explanation, no commentary.`

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Here is the poem:\n\n${draft.title ? `${draft.title}\n\n` : ''}${draft.content}\n\n---\n\nRevision instruction: ${instruction}`,
      },
    ],
  })

  const content = message.content[0]
  const text = content.type === 'text' ? content.text.trim() : draft.content

  // Re-parse title
  const lines = text.split('\n')
  let title = draft.title
  let body = text

  if (lines.length > 2 && lines[1].trim() === '') {
    title = lines[0].trim()
    body = lines.slice(2).join('\n').trim()
  }

  return {
    ...draft,
    title,
    content: body,
    revisionHistory: [
      ...draft.revisionHistory,
      {
        type: revisionType,
        label: revisionType,
        description: instruction,
        appliedAt: new Date(),
      },
    ],
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Analyze existing draft (rule-based, no LLM needed)
    if (body.analyze && body.draft) {
      const draft = body.draft as PoemDraft
      const analysis = analyzeDraft(draft)
      return NextResponse.json({ analysis })
    }

    // Revision pass
    if (body.revisionType && body.draft) {
      const draft = body.draft as PoemDraft
      const revised = await revisePoem(draft, body.revisionType as RevisionActionType)
      return NextResponse.json({ draft: revised })
    }

    // Initial generation
    if (body.prompt) {
      const prompt = body.prompt as PoetryPrompt
      const draft = await generatePoem(prompt)
      return NextResponse.json({ draft })
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  } catch (err) {
    console.error('[generate] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
