'use client'

import { useState } from 'react'
import { Send, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Message = { from: 'bot' | 'user'; text: string; options?: string[] }

const SCENARIOS: {
  id: string
  label: string
  emoji: string
  flow: Message[]
}[] = [
  {
    id: 'preco',
    label: 'Consulta de Preços',
    emoji: '💰',
    flow: [
      { from: 'bot', text: 'Olá! Bem-vindo. Como posso ajudar você hoje?', options: ['Preços', 'Suporte', 'Agendar'] },
      { from: 'user', text: 'Preços' },
      { from: 'bot', text: 'Temos 3 planos disponíveis:\n\n*Básico* — R$ 97/mês\n*Pro* — R$ 197/mês\n*Enterprise* — R$ 397/mês\n\nQual plano te interessa?', options: ['Básico', 'Pro', 'Enterprise'] },
      { from: 'user', text: 'Pro' },
      { from: 'bot', text: 'Ótima escolha! O Plano Pro inclui:\n✅ Até 5.000 mensagens/mês\n✅ Suporte prioritário\n✅ Dashboard completo\n✅ Integrações API\n\nDeseja assinar agora?', options: ['Sim, quero assinar!', 'Falar com especialista'] },
      { from: 'user', text: 'Sim, quero assinar!' },
      { from: 'bot', text: 'Perfeito! Vou transferir você para o checkout seguro. Um link de pagamento será enviado em instantes. Obrigado pela confiança!' },
    ],
  },
  {
    id: 'agendamento',
    label: 'Agendamento',
    emoji: '📅',
    flow: [
      { from: 'bot', text: 'Olá! Para qual serviço deseja agendar?', options: ['Corte', 'Barba', 'Corte + Barba'] },
      { from: 'user', text: 'Corte + Barba' },
      { from: 'bot', text: 'Perfeito! Qual data prefere?', options: ['Hoje', 'Amanhã', 'Esta semana'] },
      { from: 'user', text: 'Amanhã' },
      { from: 'bot', text: 'Amanhã temos os seguintes horários disponíveis:', options: ['09:00', '11:00', '14:00', '16:30'] },
      { from: 'user', text: '11:00' },
      { from: 'bot', text: 'Agendamento confirmado! ✅\n\n*Corte + Barba*\nAmanhã às 11:00\n\nVou te enviar um lembrete 1 hora antes. Até lá!' },
    ],
  },
  {
    id: 'suporte',
    label: 'Suporte Técnico',
    emoji: '🛠',
    flow: [
      { from: 'bot', text: 'Suporte técnico ativado. Qual é o seu problema?', options: ['Não consigo acessar', 'Pagamento com erro', 'Outro'] },
      { from: 'user', text: 'Não consigo acessar' },
      { from: 'bot', text: 'Entendido. Vamos resolver isso. Você já tentou:', options: ['Limpar cache', 'Trocar senha', 'Nenhuma das opções'] },
      { from: 'user', text: 'Nenhuma das opções' },
      { from: 'bot', text: 'Tudo bem! Vou escalar para nossa equipe técnica. Qual seu email cadastrado?' },
      { from: 'user', text: 'meu@email.com' },
      { from: 'bot', text: 'Registrado! Um técnico entrará em contato em até 30 minutos pelo seu email meu@email.com. Ticket #4821 aberto. 🎫' },
    ],
  },
]

export function BotDemoSection() {
  const [scenarioId, setScenarioId] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [finished, setFinished] = useState(false)

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)

  const startScenario = (id: string) => {
    const sc = SCENARIOS.find((s) => s.id === id)!
    setScenarioId(id)
    setStep(0)
    setMessages([sc.flow[0]])
    setFinished(false)
  }

  const handleOption = (option: string) => {
    if (!scenario) return
    const userMsg: Message = { from: 'user', text: option }
    const nextBotMsg = scenario.flow[step + 2]
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setStep(step + 2)

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
  const showOptions =
    !finished && lastMessage?.from === 'bot' && lastMessage.options && lastMessage.options.length > 0

  return (
    <section id="demo" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-medium mb-4">
            Demonstração Interativa
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-4">
            Teste um bot <span className="text-primary">ao vivo</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Experimente como seus clientes interagem com um bot personalizado.
            Escolha um cenário abaixo e veja na prática.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Scenario selector */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Escolha um cenário
            </h3>
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => startScenario(sc.id)}
                className={`w-full text-left glass rounded-xl p-4 flex items-center gap-4 transition-all hover:border-primary/40 ${
                  scenarioId === sc.id ? 'border-primary/60 bg-primary/10' : ''
                }`}
              >
                <span className="text-2xl">{sc.emoji}</span>
                <div>
                  <div className="font-semibold text-foreground text-sm">{sc.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {sc.flow.length} interações simuladas
                  </div>
                </div>
                {scenarioId === sc.id && (
                  <span className="ml-auto text-xs text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                    Ativo
                  </span>
                )}
              </button>
            ))}

            <div className="glass rounded-xl p-4 border-dashed">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Quer um bot personalizado?</span>
                {' '}Entre em contato e desenvolvemos uma solução exclusiva para o seu negócio.
              </p>
            </div>
          </div>

          {/* Chat window */}
          <div className="glass rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: '480px' }}>
            {/* Chat header */}
            <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#25d366] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                B
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">Bot Demonstração</div>
                <div className="text-green-200 text-xs">online</div>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 p-4 space-y-3 overflow-y-auto"
              style={{
                background: 'oklch(0.09 0.02 200 / 0.6)',
                backgroundImage:
                  'radial-gradient(circle at 20% 80%, oklch(0.74 0.17 200 / 0.04) 0%, transparent 60%)',
              }}
            >
              {!scenarioId && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Selecione um cenário para iniciar a demonstração
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

              {/* Options */}
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
                <div className="text-center pt-2">
                  <span className="text-xs text-muted-foreground">
                    Conversa finalizada.
                  </span>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
              <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-sm text-muted-foreground">
                {showOptions ? 'Escolha uma opção acima...' : 'Responda tocando nas opções'}
              </div>
              <div className="flex gap-2">
                {scenarioId && (
                  <button
                    onClick={reset}
                    className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                    title="Reiniciar"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <div className="p-2 rounded-full bg-[#00a884]/20 text-[#00a884]">
                  <Send className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
