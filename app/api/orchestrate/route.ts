import { NextRequest, NextResponse } from 'next/server'
import {
  AIProvider,
  OrchestrateRequest,
  Pipeline,
  PipelineStep,
  AI_CONFIGS,
} from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 300

// Chama internamente uma das rotas de IA
async function callAI(
  provider: AIProvider,
  prompt: string,
  systemPrompt: string,
  apiKey: string,
  baseUrl: string
): Promise<string> {
  const res = await fetch(`${baseUrl}/api/${provider}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemPrompt, apiKey }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result as string
}

// Usa Claude para gerar o pipeline de forma inteligente
async function planPipeline(
  userPrompt: string,
  activeAIs: AIProvider[],
  claudeKey: string,
  baseUrl: string
): Promise<Array<{ provider: AIProvider; task: string }>> {
  const aiDescriptions = activeAIs
    .map((ai) => {
      const cfg = AI_CONFIGS[ai]
      return `- ${cfg.name}: ${cfg.strengths.join(', ')}`
    })
    .join('\n')

  const planningPrompt = `Você é um orquestrador de IAs. Analise a tarefa do usuário e crie um pipeline de execução usando as IAs disponíveis.

IAs disponíveis:
${aiDescriptions}

Tarefa do usuário: "${userPrompt}"

Crie um pipeline onde cada IA faz o que ela faz melhor. A saída de uma IA alimenta a entrada da próxima.
Use a notação {{resultado_anterior}} no prompt de uma etapa para referenciar o output da etapa anterior.

Responda SOMENTE com JSON válido, sem markdown, no formato:
{
  "pipeline": [
    { "provider": "gemini", "task": "..." },
    { "provider": "kimi", "task": "... {{resultado_anterior}} ..." },
    { "provider": "claude", "task": "... {{resultado_anterior}} ..." }
  ]
}

Regras:
- Use apenas as IAs listadas acima
- Crie entre 1 e ${activeAIs.length} etapas
- Cada etapa deve ter uma tarefa clara e focada
- Se há apenas 1 IA, crie 1 etapa com a tarefa completa
- O pipeline deve fazer sentido lógico (pesquisa → análise → código, por exemplo)`

  try {
    const result = await callAI('claude', planningPrompt, '', claudeKey, baseUrl)
    const parsed = JSON.parse(result.trim()) as { pipeline: Array<{ provider: AIProvider; task: string }> }
    return parsed.pipeline
  } catch {
    // Fallback: cada IA recebe o prompt original
    return activeAIs.map((ai) => ({ provider: ai, task: userPrompt }))
  }
}

export async function POST(req: NextRequest) {
  const body: OrchestrateRequest = await req.json()
  const { userPrompt, activeAIs, apiKeys, mode, manualPipeline } = body

  // Determinar base URL para chamadas internas
  const host = req.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const pipelineId = Date.now().toString()

  // Validações
  if (!userPrompt) {
    return NextResponse.json({ error: 'Prompt vazio.' }, { status: 400 })
  }

  if (activeAIs.length === 0) {
    return NextResponse.json({ error: 'Nenhuma IA ativa.' }, { status: 400 })
  }

  for (const ai of activeAIs) {
    if (!apiKeys[ai]) {
      return NextResponse.json(
        { error: `Chave de API do ${AI_CONFIGS[ai].name} não cadastrada. Acesse /configuracoes.` },
        { status: 400 }
      )
    }
  }

  // Determinar os steps do pipeline
  let rawSteps: Array<{ provider: AIProvider; task: string }>

  if (mode === 'manual' && manualPipeline && manualPipeline.length > 0) {
    rawSteps = manualPipeline
  } else if (activeAIs.length === 1) {
    rawSteps = [{ provider: activeAIs[0], task: userPrompt }]
  } else {
    // Modo automático: precisa de Claude para planejar
    if (!apiKeys.claude) {
      // Sem Claude, distribuir manualmente
      rawSteps = activeAIs.map((ai) => ({ provider: ai, task: userPrompt }))
    } else {
      rawSteps = await planPipeline(userPrompt, activeAIs, apiKeys.claude, baseUrl)
    }
  }

  // Montar pipeline inicial
  const steps: PipelineStep[] = rawSteps.map((s, i) => ({
    id: `${pipelineId}-step-${i}`,
    provider: s.provider,
    task: s.task,
    status: 'pending',
  }))

  const pipeline: Pipeline = {
    id: pipelineId,
    steps,
    userPrompt,
    status: 'running',
    createdAt: Date.now(),
  }

  // Executar steps sequencialmente
  let previousResult = ''

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    step.status = 'running'
    step.startedAt = Date.now()

    // Injetar resultado anterior no prompt
    const resolvedTask = previousResult
      ? step.task.replace(/\{\{resultado_anterior\}\}/gi, previousResult)
      : step.task

    const systemPrompt = `Você é ${AI_CONFIGS[step.provider].name}, especializado em: ${AI_CONFIGS[step.provider].strengths.join(', ')}.
Execute a tarefa com excelência e foco. Responda sempre em português do Brasil (a menos que seja código).`

    try {
      const result = await callAI(step.provider, resolvedTask, systemPrompt, apiKeys[step.provider], baseUrl)
      step.result = result
      step.status = 'done'
      step.completedAt = Date.now()
      previousResult = result
    } catch (error: unknown) {
      const err = error as { message?: string }
      step.error = err?.message || 'Erro desconhecido'
      step.status = 'error'
      step.completedAt = Date.now()
      // Continuar com resultado vazio para não quebrar o pipeline
      previousResult = `[Erro na etapa ${i + 1}: ${step.error}]`
    }
  }

  pipeline.finalResult = previousResult
  pipeline.status = steps.some((s) => s.status === 'error') ? 'error' : 'done'

  return NextResponse.json({ pipeline })
}
