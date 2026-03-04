'use client'

import { useState } from 'react'
import { AIProvider, AI_CONFIGS } from '@/types'
import { useAPIKeys } from '@/hooks/useAPIKeys'
import { cn } from '@/lib/cn'

const ALL_PROVIDERS: AIProvider[] = ['claude', 'gemini', 'kimi']

const PROVIDER_ICONS: Record<AIProvider, string> = {
  claude: '🤖',
  gemini: '✨',
  kimi: '🌙',
}

const PROVIDER_LINKS: Record<AIProvider, string> = {
  claude: 'https://console.anthropic.com/',
  gemini: 'https://aistudio.google.com/apikey',
  kimi: 'https://platform.moonshot.cn/',
}

type TestStatus = 'idle' | 'testing' | 'ok' | 'error'

export default function ConfiguracoesPage() {
  const { keys, setKey, clearKey, hasKey } = useAPIKeys()

  const [drafts, setDrafts] = useState<Record<AIProvider, string>>({
    claude: '',
    gemini: '',
    kimi: '',
  })

  const [showKeys, setShowKeys] = useState<Record<AIProvider, boolean>>({
    claude: false,
    gemini: false,
    kimi: false,
  })

  const [testStatus, setTestStatus] = useState<Record<AIProvider, TestStatus>>({
    claude: 'idle',
    gemini: 'idle',
    kimi: 'idle',
  })

  const [testErrors, setTestErrors] = useState<Record<AIProvider, string>>({
    claude: '',
    gemini: '',
    kimi: '',
  })

  const saveKey = (provider: AIProvider) => {
    const value = drafts[provider].trim()
    if (value) {
      setKey(provider, value)
      setDrafts((prev) => ({ ...prev, [provider]: '' }))
    }
  }

  const testKey = async (provider: AIProvider) => {
    const keyToTest = drafts[provider].trim() || keys[provider]
    if (!keyToTest) return

    setTestStatus((prev) => ({ ...prev, [provider]: 'testing' }))
    setTestErrors((prev) => ({ ...prev, [provider]: '' }))

    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey: keyToTest }),
      })
      const data = await res.json()
      if (data.ok) {
        setTestStatus((prev) => ({ ...prev, [provider]: 'ok' }))
        // Salvar automaticamente se o teste passou com o draft
        if (drafts[provider].trim()) {
          setKey(provider, drafts[provider].trim())
          setDrafts((prev) => ({ ...prev, [provider]: '' }))
        }
      } else {
        setTestStatus((prev) => ({ ...prev, [provider]: 'error' }))
        setTestErrors((prev) => ({ ...prev, [provider]: data.error || 'Chave inválida' }))
      }
    } catch {
      setTestStatus((prev) => ({ ...prev, [provider]: 'error' }))
      setTestErrors((prev) => ({ ...prev, [provider]: 'Erro de conexão' }))
    }

    setTimeout(() => {
      setTestStatus((prev) => ({ ...prev, [provider]: 'idle' }))
    }, 4000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-white/40 text-sm">
          Suas chaves de API são armazenadas <strong className="text-white/60">apenas no seu navegador</strong>{' '}
          (localStorage) e nunca enviadas a terceiros.
        </p>
      </div>

      <div className="space-y-4">
        {ALL_PROVIDERS.map((provider) => {
          const cfg = AI_CONFIGS[provider]
          const saved = hasKey(provider)
          const status = testStatus[provider]
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
          const bgColors: Record<AIProvider, string> = {
            claude: 'bg-amber-500/5',
            gemini: 'bg-blue-500/5',
            kimi: 'bg-violet-500/5',
          }

          return (
            <div
              key={provider}
              className={cn('rounded-xl border p-5', borderColors[provider], bgColors[provider])}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{PROVIDER_ICONS[provider]}</span>
                <div>
                  <p className={cn('font-bold', textColors[provider])}>{cfg.name}</p>
                  <p className="text-xs text-white/40">{cfg.description}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {saved && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                      ✓ Chave salva
                    </span>
                  )}
                  {status === 'ok' && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full animate-fade-in">
                      ✓ Válida!
                    </span>
                  )}
                  {status === 'error' && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full animate-fade-in">
                      ✗ Inválida
                    </span>
                  )}
                </div>
              </div>

              {/* Strengths */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {cfg.strengths.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full border border-white/10"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Saved key display */}
              {saved && (
                <div className="flex items-center gap-2 mb-3 bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-xs text-white/40 font-mono flex-1">
                    {showKeys[provider]
                      ? keys[provider]
                      : keys[provider].slice(0, 8) + '••••••••' + keys[provider].slice(-4)}
                  </span>
                  <button
                    onClick={() => setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }))}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showKeys[provider] ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button
                    onClick={() => clearKey(provider)}
                    className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    Remover
                  </button>
                </div>
              )}

              {/* New key input */}
              <div className="flex gap-2">
                <input
                  type="password"
                  value={drafts[provider]}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [provider]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && testKey(provider)}
                  placeholder={saved ? 'Nova chave para substituir...' : `Cole sua chave do ${cfg.name}...`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm focus:outline-none focus:border-white/25 transition-colors placeholder:text-white/20"
                />
                <button
                  onClick={() => testKey(provider)}
                  disabled={(!drafts[provider].trim() && !saved) || status === 'testing'}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all border',
                    status === 'testing' && 'border-white/20 text-white/40',
                    status !== 'testing' && 'border-white/20 text-white/60 hover:bg-white/10 hover:text-white',
                    (!drafts[provider].trim() && !saved) && 'opacity-30 cursor-not-allowed'
                  )}
                >
                  {status === 'testing' ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      Testando
                    </span>
                  ) : 'Testar'}
                </button>
                {drafts[provider].trim() && status !== 'testing' && (
                  <button
                    onClick={() => saveKey(provider)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      textColors[provider],
                      'bg-white/5 hover:bg-white/10 border border-white/10'
                    )}
                  >
                    Salvar
                  </button>
                )}
              </div>

              {testErrors[provider] && (
                <p className="text-xs text-red-400 mt-2">{testErrors[provider]}</p>
              )}

              {/* Link to get key */}
              <p className="text-xs text-white/25 mt-3">
                Obtenha sua chave em:{' '}
                <a
                  href={PROVIDER_LINKS[provider]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('hover:underline transition-colors', textColors[provider])}
                >
                  {PROVIDER_LINKS[provider]}
                </a>
              </p>
            </div>
          )
        })}
      </div>

      {/* Privacy note */}
      <div className="mt-8 bg-white/3 border border-white/8 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white/60 mb-2">🔐 Privacidade e segurança</h3>
        <ul className="text-xs text-white/35 space-y-1 list-disc list-inside">
          <li>As chaves são salvas no localStorage do seu navegador</li>
          <li>Nunca enviadas para nossos servidores permanentemente</li>
          <li>Enviadas apenas ao fazer requisições, diretamente às respectivas APIs</li>
          <li>Limpar os dados do navegador remove todas as chaves</li>
        </ul>
      </div>
    </div>
  )
}
