'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  RotateCcw,
  Terminal,
  Wifi,
  WifiOff,
  ChevronRight,
  Copy,
  Check,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ─────────────── BOT SCENARIOS ─────────────── */

type BotMessage = { from: 'bot' | 'user'; text: string; options?: string[] }

const SCENARIOS = [
  {
    id: 'preco',
    label: 'Consulta de Preços',
    category: 'Vendas',
    flow: [
      { from: 'bot', text: 'Olá! Bem-vindo. Como posso ajudar você hoje?', options: ['Preços', 'Suporte', 'Agendar'] },
      { from: 'user', text: 'Preços' },
      { from: 'bot', text: 'Temos 3 planos disponíveis:\n\n*Básico* — R$ 97/mês\n*Pro* — R$ 197/mês\n*Enterprise* — R$ 397/mês\n\nQual te interessa?', options: ['Básico', 'Pro', 'Enterprise'] },
      { from: 'user', text: 'Pro' },
      { from: 'bot', text: 'Ótima escolha! O Plano Pro inclui:\n✅ 5.000 mensagens/mês\n✅ Suporte prioritário\n✅ Dashboard completo\n✅ Integrações API\n\nDeseja assinar agora?', options: ['Sim, quero assinar!', 'Falar com especialista'] },
      { from: 'user', text: 'Sim, quero assinar!' },
      { from: 'bot', text: 'Perfeito! Link de pagamento enviado. Obrigado pela confiança! 🎉' },
    ] as BotMessage[],
  },
  {
    id: 'agendamento',
    label: 'Agendamento',
    category: 'Serviços',
    flow: [
      { from: 'bot', text: 'Olá! Para qual serviço deseja agendar?', options: ['Corte', 'Barba', 'Corte + Barba'] },
      { from: 'user', text: 'Corte + Barba' },
      { from: 'bot', text: 'Qual data prefere?', options: ['Hoje', 'Amanhã', 'Esta semana'] },
      { from: 'user', text: 'Amanhã' },
      { from: 'bot', text: 'Horários disponíveis amanhã:', options: ['09:00', '11:00', '14:00', '16:30'] },
      { from: 'user', text: '11:00' },
      { from: 'bot', text: 'Agendamento confirmado! ✅\n\n*Corte + Barba*\nAmanhã às 11:00\n\nEnviarei um lembrete 1h antes. Até lá!' },
    ] as BotMessage[],
  },
  {
    id: 'suporte',
    label: 'Suporte Técnico',
    category: 'Atendimento',
    flow: [
      { from: 'bot', text: 'Suporte ativado. Qual é o problema?', options: ['Não consigo acessar', 'Pagamento com erro', 'Outro'] },
      { from: 'user', text: 'Não consigo acessar' },
      { from: 'bot', text: 'Vamos resolver! Você já tentou:', options: ['Limpar cache', 'Trocar senha', 'Nenhuma das opções'] },
      { from: 'user', text: 'Nenhuma das opções' },
      { from: 'bot', text: 'Escalando para nossa equipe técnica. Qual seu email cadastrado?' },
      { from: 'user', text: 'meu@email.com' },
      { from: 'bot', text: 'Registrado! Técnico entrará em contato em até 30 min. Ticket #4821 aberto. 🎫' },
    ] as BotMessage[],
  },
  {
    id: 'pedido',
    label: 'Pedido de Comida',
    category: 'Food',
    flow: [
      { from: 'bot', text: 'Bem-vindo ao Restaurante Digital! O que deseja?', options: ['Ver cardápio', 'Promoções', 'Meu pedido'] },
      { from: 'user', text: 'Ver cardápio' },
      { from: 'bot', text: 'Nosso cardápio:\n\n🍔 X-Burguer — R$ 28\n🍕 Pizza P — R$ 45\n🌮 Combo Tacos — R$ 35\n\nQual deseja?', options: ['X-Burguer', 'Pizza P', 'Combo Tacos'] },
      { from: 'user', text: 'X-Burguer' },
      { from: 'bot', text: '1x X-Burguer (R$ 28)\n\nAdicionar algo mais?', options: ['Finalizar pedido', 'Adicionar bebida'] },
      { from: 'user', text: 'Finalizar pedido' },
      { from: 'bot', text: 'Pedido #792 confirmado! 🎉\n\nTotal: R$ 28,00\nPrevisão: 35-45 min\nPagamento via Pix ou cartão na entrega.' },
    ] as BotMessage[],
  },
] as const

type ScenarioId = typeof SCENARIOS[number]['id']

/* ─────────────── VPS CONSOLE ─────────────── */

type ConsoleLine = {
  type: 'input' | 'output' | 'error' | 'info' | 'success'
  text: string
}

const VPS_COMMANDS: Record<string, (args: string[], logs: ConsoleLine[], scenario: string | null) => ConsoleLine[]> = {
  help: () => [
    { type: 'output', text: 'Comandos disponíveis:' },
    { type: 'info',   text: '  status        — Ver status do bot' },
    { type: 'info',   text: '  logs          — Ver logs em tempo real' },
    { type: 'info',   text: '  scenarios     — Listar cenários configurados' },
    { type: 'info',   text: '  restart       — Reiniciar o serviço do bot' },
    { type: 'info',   text: '  config        — Ver configurações atuais' },
    { type: 'info',   text: '  metrics       — Ver métricas de atendimento' },
    { type: 'info',   text: '  deploy <env>  — Simular deploy (staging/prod)' },
    { type: 'info',   text: '  clear         — Limpar o terminal' },
  ],
  status: () => [
    { type: 'success', text: '[OK] bot-service      ● running (pid 4821)' },
    { type: 'success', text: '[OK] webhook-server   ● running (pid 4822)' },
    { type: 'success', text: '[OK] redis            ● running (pid 1337)' },
    { type: 'info',    text: '[--] Uptime: 7d 14h 32m' },
    { type: 'info',    text: '[--] CPU: 2.1%  |  RAM: 148 MB' },
    { type: 'info',    text: '[--] Mensagens hoje: 1.284' },
  ],
  logs: (_, __, scenario) => [
    { type: 'info',    text: '[2026-03-24 14:22:01] Bot iniciado com sucesso' },
    { type: 'output',  text: '[2026-03-24 14:22:45] Nova sessão: +55 92 9 9999-0001' },
    { type: 'output',  text: `[2026-03-24 14:22:46] Cenário ativo: ${scenario ?? 'nenhum selecionado'}` },
    { type: 'output',  text: '[2026-03-24 14:22:47] Mensagem recebida: "Olá"' },
    { type: 'success', text: '[2026-03-24 14:22:47] Resposta enviada em 43ms' },
    { type: 'output',  text: '[2026-03-24 14:23:01] Mensagem recebida: "Preços"' },
    { type: 'success', text: '[2026-03-24 14:23:01] Resposta enviada em 38ms' },
    { type: 'info',    text: '[2026-03-24 14:23:10] Sessão encerrada — duração: 48s' },
  ],
  scenarios: () => [
    { type: 'output', text: 'Cenários configurados:' },
    { type: 'success', text: '  [ativo] consulta-precos      → flow: 7 steps' },
    { type: 'success', text: '  [ativo] agendamento          → flow: 7 steps' },
    { type: 'success', text: '  [ativo] suporte-tecnico      → flow: 7 steps' },
    { type: 'success', text: '  [ativo] pedido-comida        → flow: 7 steps' },
    { type: 'info',    text: 'Total: 4 cenários | 28 interações mapeadas' },
  ],
  restart: () => [
    { type: 'info',    text: 'Parando bot-service...' },
    { type: 'info',    text: 'Limpando fila de mensagens...' },
    { type: 'success', text: 'Serviço reiniciado com sucesso!' },
    { type: 'success', text: '[OK] bot-service ● running (pid 5001)' },
  ],
  config: () => [
    { type: 'output', text: 'Configuração atual:' },
    { type: 'info',   text: '  PHONE_NUMBER      +55 92 9 9999-0001' },
    { type: 'info',   text: '  MAX_SESSIONS      50' },
    { type: 'info',   text: '  RESPONSE_DELAY    500ms' },
    { type: 'info',   text: '  TIMEOUT_IDLE      5 min' },
    { type: 'info',   text: '  WEBHOOK_URL       https://api.seubot.app/hook' },
    { type: 'info',   text: '  AI_ENABLED        true' },
    { type: 'info',   text: '  LOG_LEVEL         info' },
  ],
  metrics: () => [
    { type: 'output', text: 'Métricas dos últimos 7 dias:' },
    { type: 'success', text: '  Sessões totais       4.821' },
    { type: 'success', text: '  Mensagens enviadas   18.344' },
    { type: 'success', text: '  Taxa de resolução    87.3%' },
    { type: 'success', text: '  Tempo médio resp.    52ms' },
    { type: 'info',    text: '  Escalados p/ humano  12.7%' },
    { type: 'info',    text: '  Satisfação (NPS)     82' },
  ],
  deploy: (args) => {
    const env = args[0] ?? 'staging'
    if (!['staging', 'prod'].includes(env)) {
      return [{ type: 'error', text: `Ambiente inválido: "${env}". Use staging ou prod.` }]
    }
    return [
      { type: 'info',    text: `Iniciando deploy para ${env}...` },
      { type: 'info',    text: 'Compilando TypeScript...' },
      { type: 'info',    text: 'Executando testes (14/14 passed)...' },
      { type: 'info',    text: 'Enviando para servidor...' },
      { type: 'success', text: `Deploy para ${env} concluído! v2.4.1` },
      { type: 'success', text: `URL: https://${env}.seubot.app` },
    ]
  },
  clear: () => [{ type: 'info', text: '__CLEAR__' }],
}

function VpsConsole({ activeScenario }: { activeScenario: string | null }) {
  const [lines, setLines] = useState<ConsoleLine[]>([
    { type: 'info', text: 'ErickMachine Bot Console v2.4.1' },
    { type: 'info', text: 'Conectado ao servidor bot-demo.erickmachine.app' },
    { type: 'output', text: 'Digite "help" para ver os comandos disponíveis.' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [copied, setCopied] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const execCommand = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return
    const [cmd, ...args] = trimmed.split(' ')
    const newHistory = [trimmed, ...history.slice(0, 49)]
    setHistory(newHistory)
    setHistIdx(-1)

    const inputLine: ConsoleLine = { type: 'input', text: `$ ${trimmed}` }
    const handler = VPS_COMMANDS[cmd.toLowerCase()]
    let output: ConsoleLine[]
    if (handler) {
      output = handler(args, lines, activeScenario)
    } else {
      output = [{ type: 'error', text: `comando não encontrado: ${cmd}. Digite "help".` }]
    }

    if (output[0]?.text === '__CLEAR__') {
      setLines([])
      return
    }

    setLines((prev) => [...prev, inputLine, ...output])
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      execCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(idx)
      setInput(history[idx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInput(idx === -1 ? '' : history[idx])
    }
  }

  const lineColor: Record<ConsoleLine['type'], string> = {
    input:   'text-primary',
    output:  'text-foreground/90',
    error:   'text-red-400',
    info:    'text-muted-foreground',
    success: 'text-green-400',
  }

  const copyAll = () => {
    const text = lines.map((l) => l.text).join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden border border-border/60"
      style={{ background: 'oklch(0.05 0.015 255)' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#1a1f2e] border-b border-border/40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-1">bot-console — bash</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 text-[10px] ${activeScenario ? 'text-green-400' : 'text-muted-foreground'}`}>
            {activeScenario ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {activeScenario ? `cenário: ${activeScenario}` : 'sem cenário'}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); copyAll() }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Copiar log"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Output area */}
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className={lineColor[line.type]}>
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input line */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-border/40 bg-[#1a1f2e]/50 flex-shrink-0">
        <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Digite um comando..."
          className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none placeholder:text-muted-foreground/40"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}

/* ─────────────── BOT CHAT ─────────────── */

export function BotDemoSection() {
  const [scenarioId, setScenarioId] = useState<ScenarioId | null>(null)
  const [step, setStep] = useState(0)
  const [messages, setMessages] = useState<BotMessage[]>([])
  const [finished, setFinished] = useState(false)
  const [view, setView] = useState<'chat' | 'console'>('chat')

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)

  const startScenario = (id: ScenarioId) => {
    const sc = SCENARIOS.find((s) => s.id === id)!
    setScenarioId(id)
    setStep(0)
    setMessages([sc.flow[0] as BotMessage])
    setFinished(false)
  }

  const handleOption = (option: string) => {
    if (!scenario) return
    const userMsg: BotMessage = { from: 'user', text: option }
    const nextBotMsg = scenario.flow[step + 2] as BotMessage | undefined
    setMessages((m) => [...m, userMsg])
    setStep((s) => s + 2)
    if (nextBotMsg) {
      setTimeout(() => {
        setMessages((m) => [...m, nextBotMsg])
        if (!nextBotMsg.options) setFinished(true)
      }, 600)
    } else {
      setFinished(true)
    }
  }

  const reset = () => {
    setScenarioId(null)
    setMessages([])
    setStep(0)
    setFinished(false)
  }

  const lastMessage = messages[messages.length - 1]
  const showOptions = !finished && lastMessage?.from === 'bot' && lastMessage.options && lastMessage.options.length > 0

  return (
    <section id="demo" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-medium mb-4">
            Demonstração Interativa
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-4">
            Teste o bot <span className="text-primary">ao vivo</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Interaja com o bot em tempo real e veja o console VPS refletindo cada ação.
            Como em produção — só que ao vivo no navegador.
          </p>
        </div>

        {/* 3-column layout: scenarios | chat | console */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_1fr] gap-6 items-start">

          {/* Scenarios sidebar */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Cenários
            </p>
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => startScenario(sc.id)}
                className={`w-full text-left glass rounded-xl p-3 flex flex-col gap-1 transition-all hover:border-primary/40 ${
                  scenarioId === sc.id ? 'border-primary/60 bg-primary/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{sc.label}</span>
                  {scenarioId === sc.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{sc.category} · {sc.flow.length} steps</span>
              </button>
            ))}

            <div className="glass rounded-xl p-3 border-dashed mt-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary font-medium">Quer um bot próprio?</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Entre em contato e crio um fluxo exclusivo para o seu negócio.
              </p>
            </div>
          </div>

          {/* Chat window */}
          <div className="glass rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
            {/* WA header */}
            <div className="bg-[#075e54] px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center text-white font-bold text-sm">B</div>
              <div>
                <div className="text-white font-semibold text-sm">Bot Demo</div>
                <div className="text-green-200 text-[10px]">online agora</div>
              </div>
              <div className="ml-auto">
                <button
                  onClick={reset}
                  title="Reiniciar"
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 p-4 space-y-3 overflow-y-auto"
              style={{
                background: 'oklch(0.09 0.02 200 / 0.6)',
                backgroundImage: 'radial-gradient(circle at 20% 80%, oklch(0.74 0.17 200 / 0.04) 0%, transparent 60%)',
              }}
            >
              {!scenarioId && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25d366]/20 flex items-center justify-center">
                    <Send className="w-4 h-4 text-[#25d366]" />
                  </div>
                  <p className="text-sm text-muted-foreground">Selecione um cenário ao lado para iniciar a demonstração</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.from === 'bot'
                        ? 'bg-[#202c33] text-gray-100 rounded-tl-sm'
                        : 'bg-[#005c4b] text-white rounded-tr-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {showOptions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {lastMessage.options!.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOption(opt)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#005c4b]/60 text-[#25d366] border border-[#25d366]/40 hover:bg-[#25d366]/20 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {finished && (
                <div className="text-center text-xs text-muted-foreground pt-1">
                  Conversa finalizada — escolha outro cenário ao lado
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3 flex-shrink-0">
              <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-xs text-muted-foreground">
                {showOptions ? 'Toque em uma opção acima...' : 'Aguardando interação...'}
              </div>
              <div className="p-2 rounded-full bg-[#00a884]/20 text-[#00a884]">
                <Send className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* VPS Console */}
          <div className="flex flex-col gap-2" style={{ minHeight: '500px' }}>
            {/* Tab bar */}
            <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1 w-fit">
              <button
                onClick={() => setView('console')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  view === 'console'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Console VPS
              </button>
            </div>
            <div className="flex-1">
              <VpsConsole activeScenario={scenarioId} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
