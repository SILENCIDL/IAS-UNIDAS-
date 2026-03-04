'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0A0A0F]/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-blue-500 to-violet-500 flex items-center justify-center text-sm font-bold text-white group-hover:scale-110 transition-transform">
            IA
          </div>
          <span className="font-bold text-white/90 group-hover:text-white transition-colors">
            IAs-Unidas
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          <Link
            href="/app"
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm transition-all',
              pathname === '/app'
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            )}
          >
            Pipeline
          </Link>
          <Link
            href="/configuracoes"
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm transition-all',
              pathname === '/configuracoes'
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            )}
          >
            ⚙️ Configurações
          </Link>
        </div>
      </div>
    </nav>
  )
}
