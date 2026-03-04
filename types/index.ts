export type AIProvider = 'claude' | 'gemini' | 'kimi'

export interface AIConfig {
  provider: AIProvider
  name: string
  color: string
  bgColor: string
  borderColor: string
  textColor: string
  description: string
  strengths: string[]
}

export const AI_CONFIGS: Record<AIProvider, AIConfig> = {
  claude: {
    provider: 'claude',
    name: 'Claude',
    color: '#D97706',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-500',
    description: 'Anthropic · Raciocínio e código',
    strengths: ['Geração de código', 'Raciocínio estruturado', 'Escrita técnica', 'Análise detalhada'],
  },
  gemini: {
    provider: 'gemini',
    name: 'Gemini',
    color: '#4285F4',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-500',
    description: 'Google · Pesquisa e contexto longo',
    strengths: ['Pesquisa aprofundada', 'Contexto muito longo', 'Informações atualizadas', 'Multimodalidade'],
  },
  kimi: {
    provider: 'kimi',
    name: 'Kimi',
    color: '#8B5CF6',
    bgColor: 'bg-violet-500',
    borderColor: 'border-violet-500',
    textColor: 'text-violet-500',
    description: 'Moonshot AI · Textos longos',
    strengths: ['Leitura de textos longos', 'Sumarização', 'Extração de informações', 'Análise de documentos'],
  },
}

export type PipelineStepStatus = 'pending' | 'running' | 'done' | 'error'

export interface PipelineStep {
  id: string
  provider: AIProvider
  task: string
  status: PipelineStepStatus
  result?: string
  error?: string
  startedAt?: number
  completedAt?: number
}

export interface Pipeline {
  id: string
  steps: PipelineStep[]
  userPrompt: string
  finalResult?: string
  status: 'idle' | 'planning' | 'running' | 'done' | 'error'
  createdAt: number
}

export interface OrchestrateRequest {
  userPrompt: string
  activeAIs: AIProvider[]
  apiKeys: Record<AIProvider, string>
  mode: 'auto' | 'manual'
  manualPipeline?: Array<{ provider: AIProvider; task: string }>
}

export interface OrchestrateResponse {
  pipeline: Pipeline
  error?: string
}

export interface AICallRequest {
  prompt: string
  systemPrompt?: string
  apiKey: string
  model?: string
}

export interface AICallResponse {
  result: string
  error?: string
}

export interface StoredAPIKeys {
  claude: string
  gemini: string
  kimi: string
}
