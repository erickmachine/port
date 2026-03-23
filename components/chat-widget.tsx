'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot } from 'lucide-react'

type Msg = { from: 'bot' | 'user'; text: string; time: string }

const getTime = () =>
  new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

const AUTO_GREET: Msg = {
  from: 'bot',
  text: 'Olá! Sou o assistente do Erick. Como posso ajudar?',
  time: getTime(),
}

const BOT_REPLIES: Record<string, string> = {
  preco: 'Os preços variam conforme o projeto. Para uma proposta personalizada, me fale mais sobre o que precisa!',
  prazo: 'O prazo médio é de 7 a 21 dias úteis, dependendo da complexidade. Me conte seu projeto.',
  whatsapp: 'Desenvolvo bots e automações completas para WhatsApp. Quer ver uma demonstração? Role até a seção Demo!',
  bot: 'Crio bots para WhatsApp, Telegram, Discord e muito mais. Gostaria de um orçamento?',
  site: 'Desenvolvo sites modernos, landing pages e e-commerces. Quer ver exemplos no portfólio?',
  ola: 'Olá! Tudo bem? Posso ajudar com informações sobre automações, bots ou criação de sites.',
  contato: 'Você pode me chamar pelo WhatsApp (92) 9965-2961 ou preencher o formulário na seção Contato!',
}

function getBotReply(text: string): string {
  const lower = text.toLowerCase()
  for (const [key, reply] of Object.entries(BOT_REPLIES)) {
    if (lower.includes(key)) return reply
  }
  return 'Entendido! Para uma resposta mais precisa, me chame pelo WhatsApp (92) 9965-2961 ou preencha o formulário de contato.'
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([AUTO_GREET])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(1)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const handleOpen = () => {
    setOpen(true)
    setUnread(0)
  }

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    const userMsg: Msg = { from: 'user', text, time: getTime() }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const reply: Msg = { from: 'bot', text: getBotReply(text), time: getTime() }
      setMessages((m) => [...m, reply])
      setTyping(false)
      if (!open) setUnread((n) => n + 1)
    }, 1000 + Math.random() * 500)
  }

  return (
    <>
      {/* Chat bubble */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform cyan-glow"
          aria-label="Abrir chat"
        >
          <MessageSquare className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden glass border border-primary/20 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-foreground">Assistente Virtual</div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#25d366] rounded-full" />
                <span className="text-xs text-muted-foreground">Online agora</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-72 min-h-40">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.from === 'bot' ? 'flex items-end gap-2' : ''}`}>
                  {msg.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mb-4">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <div>
                    <div
                      className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                        msg.from === 'bot'
                          ? 'bg-secondary text-foreground rounded-tl-sm'
                          : 'bg-primary/20 text-primary border border-primary/30 rounded-tr-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className={`text-[10px] text-muted-foreground mt-1 ${msg.from === 'user' ? 'text-right' : ''}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-2 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border px-3 py-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Digite uma mensagem..."
              className="flex-1 bg-secondary rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 border border-border"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
