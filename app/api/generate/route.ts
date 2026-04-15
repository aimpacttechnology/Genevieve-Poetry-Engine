import { NextRequest, NextResponse } from 'next/server'
import { generateMockPoem, generateMockRevision } from '@/lib/mock/mockGenerator'
import { analyzeDraft } from '@/lib/analysis/analyzer'
import type { PoetryPrompt, PoemDraft } from '@/types'

// TO PLUG IN A REAL LLM:
// 1. Import Anthropic: import Anthropic from '@anthropic-ai/sdk'
// 2. Instantiate: const client = new Anthropic()
// 3. Replace generateMockPoem with a real API call using prompt.generatedPrompt
// 4. Replace generateMockRevision with a real API call using the revision type + current draft
// 5. Add ANTHROPIC_API_KEY to your .env.local

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Analyze existing draft
    if (body.analyze && body.draft) {
      const draft = body.draft as PoemDraft
      const analysis = analyzeDraft(draft)
      return NextResponse.json({ analysis })
    }

    // Revision pass
    if (body.revisionType && body.draft) {
      const draft = body.draft as PoemDraft
      const revised = await generateMockRevision(draft, body.revisionType)
      return NextResponse.json({ draft: revised })
    }

    // Initial generation
    if (body.prompt) {
      const prompt = body.prompt as PoetryPrompt
      const draft = await generateMockPoem(prompt)
      return NextResponse.json({ draft })
    }

    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  } catch (err) {
    console.error('[generate] error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
