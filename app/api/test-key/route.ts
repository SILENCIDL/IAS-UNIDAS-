import { NextRequest, NextResponse } from 'next/server'
import { AIProvider } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const { provider, apiKey }: { provider: AIProvider; apiKey: string } = await req.json()

  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'Chave vazia.' })
  }

  const host = req.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    const res = await fetch(`${baseUrl}/api/${provider}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Responda apenas: OK',
        systemPrompt: 'Você é um assistente de teste. Responda apenas a palavra OK.',
        apiKey,
      }),
    })

    const data = await res.json()

    if (data.error) {
      return NextResponse.json({ ok: false, error: data.error })
    }

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const err = error as { message?: string }
    return NextResponse.json({ ok: false, error: err?.message || 'Erro de conexão' })
  }
}
