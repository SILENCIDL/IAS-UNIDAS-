import Link from 'next/link'
import { AI_CONFIGS } from '@/types'

const PROVIDER_ICONS: Record<string, string> = {
  claude: '🤖',
  gemini: '✨',
  kimi: '🌙',
}

const PIPELINE_STEPS = [
  {
    emoji: '✏️',
    label: 'Você escreve a tarefa',
    description: 'Uma única descrição do que você precisa.',
    color: 'text-white/70',
    border: 'border-white/10',
    bg: 'bg-white/5',
  },
  {
    emoji: '✨',
    label: 'Gemini pesquisa',
    description: 'Busca aprofundada, contexto longo e dados atualizados.',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
  },
  {
    emoji: '🌙',
    label: 'Kimi resume',
    description: 'Lê o texto longo e extrai os pontos essenciais.',
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/5',
  },
  {
    emoji: '🤖',
    label: 'Claude cria',
    description: 'Gera o código, o texto ou a análise final com precisão.',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
  },
  {
    emoji: '🎯',
    label: 'Resultado na sua tela',
    description: 'Um output de qualidade muito superior ao de uma IA sozinha.',
    color: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/5',
  },
]

const PROBLEMS = [
  {
    icon: '😤',
    title: 'Usar só uma IA',
    items: [
      'Limitada ao que ela faz de melhor',
      'Código ruim quando pede pesquisa',
      'Pesquisa rasa quando pede código',
      'Contexto curto demais pra textos longos',
    ],
    accent: 'border-red-500/20 bg-red-500/5',
    label: '❌ Problema',
    labelColor: 'text-red-400',
  },
  {
    icon: '😵',
    title: 'Várias IAs do jeito errado',
    items: [
      'Copia e cola manualmente entre janelas',
      'Gasta créditos pedindo tudo pra todas',
      'Sem encadeamento de respostas',
      'Perde tempo e dinheiro',
    ],
    accent: 'border-orange-500/20 bg-orange-500/5',
    label: '❌ Ineficiente',
    labelColor: 'text-orange-400',
  },
  {
    icon: '🚀',
    title: 'IAs Unidas',
    items: [
      'Cada IA faz o que faz de melhor',
      'Output de uma alimenta a próxima',
      'Economia real de créditos',
      'Resultado superior, mais rápido',
    ],
    accent: 'border-green-500/30 bg-green-500/5',
    label: '✅ Solução',
    labelColor: 'text-green-400',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-blue-600/10 via-violet-600/8 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-32 left-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="absolute top-32 right-1/4 w-48 h-48 bg-violet-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/50 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Orquestrador de IAs — Beta
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Múltiplas IAs,{' '}
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              um único resultado
            </span>
          </h1>

          <p className="text-lg text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
            Para de usar uma IA pra tudo — ou pagar mais pra ter menos resultado.
            O <strong className="text-white/70">IAs Unidas</strong> divide sua tarefa entre
            Claude, Gemini e Kimi automaticamente, cada uma fazendo o que faz de melhor.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/configuracoes"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-blue-500 to-violet-500 text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg"
            >
              Começar agora →
            </Link>
            <a
              href="#como-funciona"
              className="px-6 py-3 rounded-xl border border-white/15 text-white/60 text-sm hover:border-white/30 hover:text-white/80 transition-all"
            >
              Ver como funciona ↓
            </a>
          </div>

          {/* AI icons preview */}
          <div className="flex items-center justify-center gap-4 mt-12 text-sm text-white/30">
            <span className="flex items-center gap-1.5">
              <span className="text-xl">🤖</span> Claude
            </span>
            <span className="text-white/10">+</span>
            <span className="flex items-center gap-1.5">
              <span className="text-xl">✨</span> Gemini
            </span>
            <span className="text-white/10">+</span>
            <span className="flex items-center gap-1.5">
              <span className="text-xl">🌙</span> Kimi
            </span>
          </div>
        </div>
      </section>

      {/* ── O PROBLEMA ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3">O problema</p>
            <h2 className="text-3xl font-bold text-white">
              Como todo mundo usa IA hoje
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className={`rounded-2xl border p-6 ${p.accent}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{p.icon}</span>
                  <div>
                    <span className={`text-xs font-medium ${p.labelColor}`}>{p.label}</span>
                    <p className="text-white font-semibold">{p.title}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="text-sm text-white/50 flex items-start gap-2">
                      <span className="text-white/20 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Como funciona</p>
            <h2 className="text-3xl font-bold text-white">
              Um pipeline inteligente
            </h2>
            <p className="text-white/40 mt-3 text-sm">
              Claude analisa sua tarefa e divide automaticamente entre as IAs ativas.
              Cada saída alimenta a próxima etapa.
            </p>
          </div>

          <div className="relative">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={i} className="flex items-stretch gap-4">
                {/* Connector line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg flex-shrink-0 ${step.border} ${step.bg}`}
                  >
                    {step.emoji}
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-white/8 my-1" />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-6 ${i === PIPELINE_STEPS.length - 1 ? 'pb-0' : ''}`}>
                  <p className={`font-semibold text-sm ${step.color}`}>{step.label}</p>
                  <p className="text-white/40 text-sm mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/app"
              className="inline-block px-6 py-3 rounded-xl bg-white/5 border border-white/15 text-white/70 text-sm hover:bg-white/10 hover:text-white transition-all"
            >
              Ver o pipeline em ação →
            </Link>
          </div>
        </div>
      </section>

      {/* ── AS IAs ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3">As IAs</p>
            <h2 className="text-3xl font-bold text-white">
              Cada uma no que é boa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['claude', 'gemini', 'kimi'] as const).map((provider) => {
              const cfg = AI_CONFIGS[provider]
              const borderColors: Record<string, string> = {
                claude: 'border-amber-500/30',
                gemini: 'border-blue-500/30',
                kimi: 'border-violet-500/30',
              }
              const bgColors: Record<string, string> = {
                claude: 'bg-amber-500/5',
                gemini: 'bg-blue-500/5',
                kimi: 'bg-violet-500/5',
              }
              const textColors: Record<string, string> = {
                claude: 'text-amber-400',
                gemini: 'text-blue-400',
                kimi: 'text-violet-400',
              }
              return (
                <div
                  key={provider}
                  className={`rounded-2xl border p-6 ${borderColors[provider]} ${bgColors[provider]}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{PROVIDER_ICONS[provider]}</span>
                    <div>
                      <p className={`font-bold ${textColors[provider]}`}>{cfg.name}</p>
                      <p className="text-xs text-white/35">{cfg.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {cfg.strengths.map((s) => (
                      <li key={s} className="text-sm text-white/55 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${textColors[provider]} opacity-60`}
                          style={{ backgroundColor: 'currentColor' }}
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {/* Glow */}
          <div className="absolute left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-white/40 mb-2">
              Cadastre suas chaves de API e comece a usar em minutos.
            </p>
            <p className="text-white/25 text-sm mb-8">
              🔐 Suas chaves ficam apenas no seu navegador — nunca enviadas a terceiros.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/configuracoes"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-blue-500 to-violet-500 text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-xl"
              >
                ⚙️ Configurar minhas chaves →
              </Link>
              <Link
                href="/app"
                className="px-8 py-3.5 rounded-xl border border-white/15 text-white/60 text-sm hover:border-white/30 hover:text-white/80 transition-all"
              >
                Ir direto para o pipeline
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-white/20 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-amber-500 via-blue-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
              IA
            </div>
            IAs Unidas
          </div>
          <p>🤖 Claude &nbsp;·&nbsp; ✨ Gemini &nbsp;·&nbsp; 🌙 Kimi</p>
        </div>
      </footer>
    </div>
  )
}
