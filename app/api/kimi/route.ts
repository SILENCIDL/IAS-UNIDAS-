import { NextRequest, NextResponse } from 'next/server'
import { AICallRequest, AICallResponse } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 120

// Kimi usa API compatível com OpenAI (Moonshot AI)
const KIMI_BASE_URL = 'https://api.moonshot.cn/v1'

export async function POST(req: NextRequest) {
  try {
    const body: AICallRequest = await req.json()

    if (!body.apiKey) {
      return NextResponse.json<AICallResponse>(
        { result: '', error: 'Chave de API do Kimi não informada.' },
        { status: 400 }
      )
    }

    if (!body.prompt) {
      return NextResponse.json<AICallResponse>(
        { result: '', error: 'Prompt não informado.' },
        { status: 400 }
      )
    }

    const messages: Array<{ role: string; content: string }> = []

    if (body.systemPrompt) {
      messages.push({ role: 'system', content: body.systemPrompt })
    }

    messages.push({ role: 'user', content: body.prompt })

    const response = await fetch(`${KIMI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${body.apiKey}`,
      },
      body: JSON.stringify({
        model: body.model || 'moonshot-v1-32k',
        messages,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      const msg = (errData as { error?: { message?: string } })?.error?.message || `HTTP ${response.status}`
      return NextResponse.json<AICallResponse>({ result: '', error: msg }, { status: response.status })
    }

    const data = await response.json()
    const result = data?.choices?.[0]?.message?.content || ''

    return NextResponse.json<AICallResponse>({ result })
  } catch (error: unknown) {
    const err = error as { message?: string }
    return NextResponse.json<AICallResponse>(
      { result: '', error: err?.message || 'Erro desconhecido' },
      { status: 500 }
    )
  }
}
