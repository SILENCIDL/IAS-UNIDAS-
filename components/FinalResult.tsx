'use client'

import { useState } from 'react'

interface FinalResultProps {
  result: string
  hasError?: boolean
}

export function FinalResult({ result, hasError }: FinalResultProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Detectar se parece código
  const looksLikeCode =
    result.includes('```') ||
    result.includes('function ') ||
    result.includes('const ') ||
    result.includes('<html') ||
    result.includes('import ')

  return (
    <div
      className={`rounded-xl border-2 p-5 animate-slide-up ${
        hasError ? 'border-orange-500/50 bg-orange-500/5' : 'border-green-500/50 bg-green-500/5'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{hasError ? '⚠️' : '🎯'}</span>
          <h3 className="font-bold text-white">
            {hasError ? 'Resultado (com avisos)' : 'Resultado Final'}
          </h3>
        </div>
        <button
          onClick={copy}
          className="text-xs px-3 py-1.5 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all"
        >
          {copied ? '✓ Copiado!' : 'Copiar'}
        </button>
      </div>

      <div className={`max-h-[500px] overflow-y-auto rounded-lg p-4 ${looksLikeCode ? 'bg-black/40' : 'bg-white/5'}`}>
        <pre className="text-sm text-white/85 whitespace-pre-wrap font-mono leading-relaxed">
          {result}
        </pre>
      </div>
    </div>
  )
}
