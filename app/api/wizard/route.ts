import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { PoetryForm, PoetryIdeaInput } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API,
})

interface WizardContext {
  form: PoetryForm | null
  idea: PoetryIdeaInput
}

function buildSystemPrompt(ctx: WizardContext): string {
  const sections: string[] = []

  sections.push(`You are Geneviève, a poetry mentor. You help people write their own poems through conversation. You do not write the poem for them — you ask questions, offer concrete possibilities, point to images, and respond to what they bring. You are encouraging but honest. You prefer the specific over the general.`)

  if (ctx.form) {
    sections.push(`The user is working on a ${ctx.form.name}. Form rules:\n${ctx.form.structureRules.map((r) => `- ${r}`).join('\n')}`)
  }

  if (ctx.idea.topic) {
    const ideaLines: string[] = [`Topic: ${ctx.idea.topic}`]
    if (ctx.idea.emotionalTone) ideaLines.push(`Emotional tone: ${ctx.idea.emotionalTone}`)
    if (ctx.idea.centralImage) ideaLines.push(`Central image: ${ctx.idea.centralImage}`)
    if (ctx.idea.themeOrQuestion) ideaLines.push(`Theme or question: ${ctx.idea.themeOrQuestion}`)
    sections.push(`What the user wants to write about:\n${ideaLines.join('\n')}`)
  }

  sections.push(`Your approach:
- Keep your responses short: 2–4 sentences. This is a conversation, not a lecture.
- When the user shares a line or draft, quote it back and say specifically what is working.
- Offer concrete word or line suggestions when they are stuck — not abstract advice.
- Ask one focused question at a time to move the poem forward.
- When the poem feels complete, say so clearly and encourage them to save it using the panel on the right.`)

  return sections.join('\n\n')
}

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json()

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 512,
      system: buildSystemPrompt(context as WizardContext),
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ message: text })
  } catch (err) {
    console.error('[wizard] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
