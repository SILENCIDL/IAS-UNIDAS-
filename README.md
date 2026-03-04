# IAs Unidas — Orquestrador de Múltiplas IAs

Sistema web que permite usar **Claude, Gemini e Kimi** em conjunto de forma inteligente. Cada IA faz o que faz de melhor, e as respostas se encadeiam automaticamente.

## Como funciona

1. Usuário cadastra suas próprias chaves de API (Claude, Gemini, Kimi)
2. Ativa as IAs que quer usar
3. Escreve a tarefa uma única vez
4. O sistema divide e encadeia automaticamente:
   - **Gemini** → pesquisa aprofundada
   - **Kimi** → leitura e resumo de textos longos
   - **Claude** → geração de código e análise estruturada
5. Resultado final combinado exibido na tela

## Deploy na Vercel (recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"Add New Project"**
3. Importe o repositório `IAS-UNIDAS-`
4. Clique em **Deploy**
5. Pronto — URL pública em ~2 minutos

> Não é necessário configurar nenhuma variável de ambiente.
> Cada usuário cadastra suas próprias chaves diretamente na interface.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## Rotas

| URL | Descrição |
|---|---|
| `/` | Landing page |
| `/app` | Pipeline principal |
| `/configuracoes` | Gerenciar chaves de API |

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **TypeScript**
- **@anthropic-ai/sdk** — Claude
- **@google/generative-ai** — Gemini
- **Moonshot AI** — Kimi (API compatível com OpenAI)

## Segurança

As chaves de API ficam apenas no **localStorage do navegador** do usuário — nunca enviadas a servidor permanentemente.
