import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { AICallRequest, AICallResponse } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const body: AICallRequest = await req.json()

    if (!body.apiKey) {
      return NextResponse.json<AICallResponse>(
        { result: '', error: 'Chave de API do Claude não informada.' },
        { status: 400 }
      )
    }

    if (!body.prompt) {
      return NextResponse.json<AICallResponse>(
        { result: '', error: 'Prompt não informado.' },
        { status: 400 }
      )
    }

    const client = new Anthropic({ apiKey: body.apiKey })

    const message = await client.messages.create({
      model: body.model || 'claude-opus-4-6',
      max_tokens: 8096,
      system: body.systemPrompt,
      messages: [
        {
          role: 'user',
          content: body.prompt,
        },
      ],
    })

    const result = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n')

    return NextResponse.json<AICallResponse>({ result })
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string }
    const msg = err?.message || 'Erro desconhecido'
    const status = err?.status || 500
    return NextResponse.json<AICallResponse>({ result: '', error: msg }, { status })
  }
}
