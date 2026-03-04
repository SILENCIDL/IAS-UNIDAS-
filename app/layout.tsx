import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'IAs Unidas — Orquestrador de IAs',
  description: 'Use múltiplas IAs de forma inteligente. Cada IA faz o que faz de melhor.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0A0A0F] text-white">
        <Navbar />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  )
}
