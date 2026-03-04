'use client'

import { useState } from 'react'
import { AIProvider, AI_CONFIGS } from '@/types'
import { cn } from '@/lib/cn'

interface ManualStep {
  provider: AIProvider
  task: string
}

interface ManualPipelineEditorProps {
  activeAIs: AIProvider[]
  onChange: (steps: ManualStep[]) => void
}

const PROVIDER_ICONS: Record<AIProvider, string> = {
  claude: '🤖',
  gemini: '✨',
  kimi: '🌙',
}

export function ManualPipelineEditor({ activeAIs, onChange }: ManualPipelineEditorProps) {
  const [steps, setSteps] = useState<ManualStep[]>(
    activeAIs.map((ai) => ({ provider: ai, task: '' }))
  )

  const updateStep = (index: number, field: keyof ManualStep, value: string) => {
    const updated = steps.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    )
    setSteps(updated)
    onChange(updated)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const updated = [...steps]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    setSteps(updated)
    onChange(updated)
  }

  const moveDown = (index: number) => {
    if (index === steps.length - 1) return
    const updated = [...steps]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    setSteps(updated)
    onChange(updated)
  }

  const removeStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index)
    setSteps(updated)
    onChange(updated)
  }

  const addStep = (provider: AIProvider) => {
    const updated = [...steps, { provider, task: '' }]
    setSteps(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-white/50">
          Configure manualmente o que cada IA vai fazer.
          Use <code className="text-violet-400 bg-violet-400/10 px-1 rounded">{'{{resultado_anterior}}'}</code> para
          referenciar o output da etapa anterior.
        </p>
      </div>

      {steps.map((step, i) => {
        const cfg = AI_CONFIGS[step.provider]
        const textColors: Record<AIProvider, string> = {
          claude: 'text-amber-400',
          gemini: 'text-blue-400',
          kimi: 'text-violet-400',
        }
        const borderColors: Record<AIProvider, string> = {
          claude: 'border-amber-500/30',
          gemini: 'border-blue-500/30',
          kimi: 'border-violet-500/30',
        }

        return (
          <div key={i} className={cn('bg-white/5 rounded-xl border p-4', borderColors[step.provider])}>
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('flex items-center gap-2 font-semibold', textColors[step.provider])}>
                <span>{PROVIDER_ICONS[step.provider]}</span>
                <span>Etapa {i + 1}: {cfg.name}</span>
              </div>
              <div className="ml-auto flex gap-1">
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="p-1 text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
                  title="Mover para cima"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === steps.length - 1}
                  className="p-1 text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
                  title="Mover para baixo"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeStep(i)}
                  className="p-1 text-white/30 hover:text-red-400 transition-colors"
                  title="Remover etapa"
                >
                  ✕
                </button>
              </div>
            </div>
            <textarea
              value={step.task}
              onChange={(e) => updateStep(i, 'task', e.target.value)}
              placeholder={`Descreva o que o ${cfg.name} deve fazer nesta etapa...${i > 0 ? "\n\nEx: Com base em {{resultado_anterior}}, ..." : ''}`}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white/80 text-sm resize-none focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20 min-h-[80px]"
            />
          </div>
        )
      })}

      {/* Add step buttons */}
      <div className="flex gap-2 flex-wrap">
        <p className="text-xs text-white/30 w-full">Adicionar etapa:</p>
        {activeAIs.map((ai) => {
          const cfg = AI_CONFIGS[ai]
          const btnColors: Record<AIProvider, string> = {
            claude: 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10',
            gemini: 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10',
            kimi: 'border-violet-500/30 text-violet-400 hover:bg-violet-500/10',
          }
          return (
            <button
              key={ai}
              onClick={() => addStep(ai)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-lg border transition-colors',
                btnColors[ai]
              )}
            >
              + {PROVIDER_ICONS[ai]} {cfg.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
