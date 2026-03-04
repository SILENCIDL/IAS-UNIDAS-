'use client'

import { useState, useCallback } from 'react'
import { AIProvider, Pipeline, AI_CONFIGS, OrchestrateRequest } from '@/types'
import { useAPIKeys } from '@/hooks/useAPIKeys'
import { AIToggle } from '@/components/AIToggle'
import { PipelineView } from '@/components/PipelineView'
import { FinalResult } from '@/components/FinalResult'
import { ManualPipelineEditor } from '@/components/ManualPipelineEditor'
import Link from 'next/link'

const ALL_PROVIDERS: AIProvider[] = ['claude', 'gemini', 'kimi']

export default function HomePage() {
  const { keys, hasKey, loaded } = useAPIKeys()

  const [activeAIs, setActiveAIs] = useState<AIProvider[]>([])
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<'auto' | 'manual'>('auto')
  const [manualPipeline, setManualPipeline] = useState<Array<{ provider: AIProvider; task: string }>>([])

  const [pipeline, setPipeline] = useState<Pipeline | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleAI = useCallback(
    (provider: AIProvider) => {
      setActiveAIs((prev) =>
        prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider]
      )
    },
    []
  )

  const hasAnyKey = ALL_PROVIDERS.some((p) => hasKey(p))
  const canRun = activeAIs.length > 0 && prompt.trim().length > 0 && !loading

  const run = async () => {
    if (!canRun) return
    setError(null)
    setLoading(true)

    // Pipeline "fantasma" para mostrar progresso visual imediato
    const fakePipeline: Pipeline = {
      id: Date.now().toString(),
      steps: activeAIs.map((ai, i) => ({
        id: `fake-${i}`,
        provider: ai,
        task: mode === 'manual' && manualPipeline[i]?.task ? manualPipeline[i].task : '...',
        status: 'pending',
      })),
      userPrompt: prompt,
      status: 'planning',
      createdAt: Date.now(),
    }
    setPipeline(fakePipeline)

    const body: OrchestrateRequest = {
      userPrompt: prompt,
      activeAIs,
      apiKeys: keys,
      mode,
      manualPipeline: mode === 'manual' ? manualPipeline : undefined,
    }

    try {
      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setPipeline(null)
      } else {
        setPipeline(data.pipeline as Pipeline)
      }
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err?.message || 'Erro de conexão. Verifique sua internet.')
      setPipeline(null)
    } finally {
      setLoading(false)
    }
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-white/30 text-sm">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/50 mb-4">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Orquestrador de IAs
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          IAs Trabalhando{' '}
          <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            Juntas
          </span>
        </h1>
        <p className="text-white/40 max-w-xl mx-auto">
          Ative as IAs que deseja usar, escreva sua tarefa, e o sistema divide o trabalho
          automaticamente — cada IA faz o que faz de melhor.
        </p>
      </div>

      {/* Sem chaves cadastradas */}
      {!hasAnyKey && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-center">
          <p className="text-amber-300 text-sm mb-2">
            Nenhuma chave de API cadastrada ainda.
          </p>
          <Link
            href="/configuracoes"
            className="inline-block text-sm bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            ⚙️ Configurar chaves
          </Link>
        </div>
      )}

      {/* AI Toggles */}
      <div className="mb-6">
        <p className="text-xs text-white/30 uppercase tracking-wide mb-3">
          1. Ative as IAs que deseja usar
        </p>
        <div className="grid grid-cols-3 gap-3">
          {ALL_PROVIDERS.map((provider) => (
            <AIToggle
              key={provider}
              provider={provider}
              active={activeAIs.includes(provider)}
              hasKey={hasKey(provider)}
              onToggle={toggleAI}
            />
          ))}
        </div>
      </div>

      {/* Mode selector */}
      {activeAIs.length > 1 && (
        <div className="mb-6">
          <p className="text-xs text-white/30 uppercase tracking-wide mb-3">
            2. Modo do pipeline
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('auto')}
              className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                mode === 'auto'
                  ? 'bg-white/10 border-white/30 text-white font-medium'
                  : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
              }`}
            >
              ✨ Automático
              <span className="ml-2 text-xs text-white/30">
                {mode === 'auto' && '(Claude planeja o pipeline)'}
              </span>
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                mode === 'manual'
                  ? 'bg-white/10 border-white/30 text-white font-medium'
                  : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
              }`}
            >
              ⚙️ Manual
              <span className="ml-2 text-xs text-white/30">
                {mode === 'manual' && '(você define cada etapa)'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Manual pipeline editor */}
      {mode === 'manual' && activeAIs.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-white/30 uppercase tracking-wide mb-3">
            3. Configure as etapas
          </p>
          <ManualPipelineEditor
            activeAIs={activeAIs}
            onChange={setManualPipeline}
          />
        </div>
      )}

      {/* Prompt input */}
      <div className="mb-6">
        <p className="text-xs text-white/30 uppercase tracking-wide mb-3">
          {mode === 'manual' ? '4.' : activeAIs.length > 1 ? '3.' : '2.'} Escreva sua tarefa
        </p>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) run()
            }}
            placeholder={
              activeAIs.length === 0
                ? 'Ative pelo menos uma IA acima...'
                : activeAIs.length === 1
                ? `O que deseja que o ${AI_CONFIGS[activeAIs[0]].name} faça?`
                : 'Descreva sua tarefa completa. O pipeline vai dividir o trabalho entre as IAs ativas...'
            }
            disabled={activeAIs.length === 0 || loading}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pr-32 text-white/80 text-sm resize-none focus:outline-none focus:border-white/25 transition-colors placeholder:text-white/20 min-h-[120px] disabled:opacity-40"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="text-xs text-white/20">Ctrl+Enter</span>
            <button
              onClick={run}
              disabled={!canRun}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-gradient-to-r from-amber-500 via-blue-500 to-violet-500 text-white hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Executando...
                </span>
              ) : (
                '▶ Executar'
              )}
            </button>
          </div>
        </div>
        {activeAIs.length > 0 && (
          <p className="text-xs text-white/25 mt-2">
            IAs ativas:{' '}
            {activeAIs.map((ai) => AI_CONFIGS[ai].name).join(' → ')}
            {mode === 'auto' && activeAIs.length > 1 && ' (ordem definida automaticamente)'}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 animate-fade-in">
          <p className="text-red-300 text-sm">{error}</p>
          {error.includes('configuracoes') && (
            <Link href="/configuracoes" className="text-red-400 underline text-sm mt-1 block">
              Ir para Configurações →
            </Link>
          )}
        </div>
      )}

      {/* Pipeline result */}
      {pipeline && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-wide mb-3">Pipeline</p>
            <PipelineView pipeline={pipeline} />
          </div>

          {pipeline.finalResult && (
            <div>
              <p className="text-xs text-white/30 uppercase tracking-wide mb-3">Resultado</p>
              <FinalResult
                result={pipeline.finalResult}
                hasError={pipeline.status === 'error'}
              />
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!pipeline && !error && (
        <div className="text-center py-16 text-white/15">
          <div className="text-5xl mb-4">🔗</div>
          <p className="text-sm">Ative as IAs, escreva uma tarefa e clique em Executar</p>
        </div>
      )}
    </div>
  )
}
