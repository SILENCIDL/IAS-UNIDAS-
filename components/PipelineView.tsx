'use client'

import { Pipeline, PipelineStep, AI_CONFIGS, AIProvider } from '@/types'
import { cn } from '@/lib/cn'

interface PipelineViewProps {
  pipeline: Pipeline
}

const STATUS_LABELS = {
  pending: 'Aguardando...',
  running: 'Processando...',
  done: 'Concluído',
  error: 'Erro',
}

const PROVIDER_ICONS: Record<AIProvider, string> = {
  claude: '🤖',
  gemini: '✨',
  kimi: '🌙',
}

function StepCard({ step, index }: { step: PipelineStep; index: number }) {
  const cfg = AI_CONFIGS[step.provider]

  const borderColors: Record<AIProvider, string> = {
    claude: 'border-amber-500',
    gemini: 'border-blue-500',
    kimi: 'border-violet-500',
  }

  const textColors: Record<AIProvider, string> = {
    claude: 'text-amber-400',
    gemini: 'text-blue-400',
    kimi: 'text-violet-400',
  }

  const bgColors: Record<AIProvider, string> = {
    claude: 'bg-amber-500/10',
    gemini: 'bg-blue-500/10',
    kimi: 'bg-violet-500/10',
  }

  const elapsed =
    step.startedAt && step.completedAt
      ? ((step.completedAt - step.startedAt) / 1000).toFixed(1)
      : null

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4 transition-all duration-300 animate-fade-in',
        step.status === 'running' && `${borderColors[step.provider]} shadow-lg`,
        step.status === 'done' && `border-green-500/50 bg-green-500/5`,
        step.status === 'error' && 'border-red-500/50 bg-red-500/5',
        step.status === 'pending' && 'border-white/10 bg-white/5 opacity-60'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
            bgColors[step.provider],
            textColors[step.provider]
          )}
        >
          {index + 1}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">{PROVIDER_ICONS[step.provider]}</span>
          <span className={cn('font-semibold', textColors[step.provider])}>{cfg.name}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {step.status === 'running' && (
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          )}
          {step.status === 'done' && <span className="text-green-400 text-sm">✓ {elapsed}s</span>}
          {step.status === 'error' && <span className="text-red-400 text-sm">✗ Erro</span>}
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              step.status === 'running' && `${bgColors[step.provider]} ${textColors[step.provider]}`,
              step.status === 'done' && 'bg-green-500/20 text-green-400',
              step.status === 'error' && 'bg-red-500/20 text-red-400',
              step.status === 'pending' && 'bg-white/10 text-white/40'
            )}
          >
            {STATUS_LABELS[step.status]}
          </span>
        </div>
      </div>

      {/* Task */}
      <div className="mb-3">
        <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Tarefa</p>
        <p className="text-sm text-white/70 line-clamp-3">{step.task}</p>
      </div>

      {/* Result */}
      {step.result && (
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Resultado</p>
          <div className="bg-white/5 rounded-lg p-3 max-h-48 overflow-y-auto">
            <pre className="text-sm text-white/80 whitespace-pre-wrap font-sans">{step.result}</pre>
          </div>
        </div>
      )}

      {/* Error */}
      {step.error && (
        <div>
          <p className="text-xs text-red-400 uppercase tracking-wide mb-1">Erro</p>
          <p className="text-sm text-red-300">{step.error}</p>
        </div>
      )}
    </div>
  )
}

export function PipelineView({ pipeline }: PipelineViewProps) {
  return (
    <div className="space-y-3">
      {/* Status header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            pipeline.status === 'running' || pipeline.status === 'planning'
              ? 'bg-blue-400 animate-pulse'
              : pipeline.status === 'done'
              ? 'bg-green-400'
              : pipeline.status === 'error'
              ? 'bg-red-400'
              : 'bg-white/30'
          )}
        />
        <p className="text-sm text-white/50">
          {pipeline.status === 'planning' && 'Planejando pipeline...'}
          {pipeline.status === 'running' && `Executando ${pipeline.steps.length} etapas...`}
          {pipeline.status === 'done' && `Pipeline concluído — ${pipeline.steps.length} etapas`}
          {pipeline.status === 'error' && 'Pipeline concluído com erros'}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {pipeline.steps.map((step, i) => (
          <div key={step.id}>
            <StepCard step={step} index={i} />
            {i < pipeline.steps.length - 1 && (
              <div className="flex justify-center my-1">
                <span className="text-white/20 text-lg">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
