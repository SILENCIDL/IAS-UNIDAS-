'use client'

import { AIProvider, AI_CONFIGS } from '@/types'
import { cn } from '@/lib/cn'

interface AIToggleProps {
  provider: AIProvider
  active: boolean
  hasKey: boolean
  onToggle: (provider: AIProvider) => void
}

const PROVIDER_ICONS: Record<AIProvider, string> = {
  claude: '🤖',
  gemini: '✨',
  kimi: '🌙',
}

export function AIToggle({ provider, active, hasKey, onToggle }: AIToggleProps) {
  const cfg = AI_CONFIGS[provider]

  const borderColors: Record<AIProvider, string> = {
    claude: 'border-amber-500',
    gemini: 'border-blue-500',
    kimi: 'border-violet-500',
  }

  const activeGradients: Record<AIProvider, string> = {
    claude: 'from-amber-500/20 to-amber-600/10 border-amber-500',
    gemini: 'from-blue-500/20 to-blue-600/10 border-blue-500',
    kimi: 'from-violet-500/20 to-violet-600/10 border-violet-500',
  }

  const dotColors: Record<AIProvider, string> = {
    claude: 'bg-amber-400',
    gemini: 'bg-blue-400',
    kimi: 'bg-violet-400',
  }

  return (
    <button
      onClick={() => onToggle(provider)}
      disabled={!hasKey}
      className={cn(
        'relative flex flex-col gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-left w-full',
        'hover:scale-105 active:scale-95',
        active && hasKey
          ? `bg-gradient-to-br ${activeGradients[provider]} shadow-lg`
          : 'bg-white/5 border-white/10 hover:border-white/20',
        !hasKey && 'opacity-40 cursor-not-allowed'
      )}
      title={!hasKey ? `Configure a chave do ${cfg.name} em /configuracoes` : undefined}
    >
      {/* Status indicator */}
      <div className="flex items-center justify-between">
        <span className="text-2xl">{PROVIDER_ICONS[provider]}</span>
        <div
          className={cn(
            'w-3 h-3 rounded-full transition-all',
            active && hasKey ? cn(dotColors[provider], 'shadow-sm') : 'bg-white/20'
          )}
        />
      </div>

      {/* Name */}
      <div>
        <p
          className={cn(
            'font-bold text-base transition-colors',
            active && hasKey ? cfg.textColor : 'text-white/70'
          )}
        >
          {cfg.name}
        </p>
        <p className="text-xs text-white/40 mt-0.5">{cfg.description}</p>
      </div>

      {/* Key status */}
      {!hasKey && (
        <p className="text-xs text-white/30 italic">Sem chave cadastrada</p>
      )}

      {/* Active badge */}
      {active && hasKey && (
        <span
          className={cn(
            'absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium',
            `${cfg.textColor} bg-current/10`
          )}
          style={{ backgroundColor: `${cfg.color}20` }}
        >
          Ativo
        </span>
      )}

      {/* Strengths on hover (hidden on small) */}
      <div className="hidden sm:block mt-1">
        <p className="text-xs text-white/30 line-clamp-1">
          {cfg.strengths[0]}, {cfg.strengths[1]}
        </p>
      </div>
    </button>
  )
}
