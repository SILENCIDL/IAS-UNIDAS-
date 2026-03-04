import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { AICallRequest, AICallResponse } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const body: AICallRequest = await req.json()

    if (!body.apiKey) {
      return NextResponse.json<AICallResponse>(
        { result: '', error: 'Chave de API do Gemini não informada.' },
        { status: 400 }
      )
    }

    if (!body.prompt) {
      return NextResponse.json<AICallResponse>(
        { result: '', error: 'Prompt não informado.' },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(body.apiKey)
    const model = genAI.getGenerativeModel({
      model: body.model || 'gemini-1.5-pro',
      systemInstruction: body.systemPrompt,
    })

    const result = await model.generateContent(body.prompt)
    const text = result.response.text()

    return NextResponse.json<AICallResponse>({ result: text })
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string }
    const msg = err?.message || 'Erro desconhecido'
    return NextResponse.json<AICallResponse>({ result: '', error: msg }, { status: 500 })
  }
}
