'use client'

import { useEffect, useRef } from 'react'
import { ArrowRight, MessageCircle, Star, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STATS = [
  { value: '50+', label: 'Projetos entregues' },
  { value: '100%', label: 'Clientes satisfeitos' },
  { value: '24/7', label: 'Suporte ativo' },
]

export function HeroSection() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16"
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 10%, oklch(0.74 0.17 200 / 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center gap-16">
        {/* Left: text */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">
              Disponível para novos projetos
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
            Automações que{' '}
            <span className="text-primary">vendem</span>
            {'. '}
            Bots que{' '}
            <span className="text-primary">atracam</span>
            {'. '}
            Sites que{' '}
            <span className="text-primary">convertem</span>.
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
            Desenvolvo soluções digitais de alto impacto: automações para WhatsApp,
            bots inteligentes e sites profissionais que transformam visitantes em
            clientes pagantes.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
            <Button
              size="lg"
              onClick={() => handleNav('#portfolio')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 cyan-glow font-semibold text-base px-8 group"
            >
              Ver Projetos
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                window.open('https://wa.me/5592996552961', '_blank')
              }
              className="border-border text-foreground hover:bg-secondary hover:border-primary/50 font-semibold text-base px-8 group"
            >
              <MessageCircle className="w-4 h-4 mr-2 text-[#25d366] group-hover:scale-110 transition-transform" />
              Falar no WhatsApp
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 justify-center lg:justify-start">
            {STATS.map((s, i) => (
              <div key={i} className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: floating preview card */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            {/* Main card */}
            <div className="glass rounded-2xl p-6 cyan-glow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center text-white text-lg font-bold">
                  W
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    WhatsApp Bot — Loja X
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#25d366] rounded-full" />
                    <span className="text-xs text-muted-foreground">Online agora</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <BotMessage
                  from="bot"
                  text="Olá! Bem-vindo à Loja X. Como posso ajudar você hoje?"
                />
                <BotMessage from="user" text="Quero saber sobre os planos" />
                <BotMessage
                  from="bot"
                  text="Ótimo! Temos 3 planos disponíveis. Qual categoria te interessa?"
                />
                <div className="flex gap-2 flex-wrap pt-1">
                  {['Básico', 'Pro', 'Enterprise'].map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full border border-primary/40 text-primary text-xs hover:bg-primary/10 cursor-pointer transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Resposta automatizada
                </span>
                <span className="flex items-center gap-1 text-xs text-primary">
                  <CheckCircle2 className="w-3 h-3" /> Ativo
                </span>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-medium text-foreground">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              5.0 · 30 avaliações
            </div>
            <div className="absolute -bottom-4 -left-4 glass rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-medium text-foreground">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Bot em tempo real
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
        <span className="text-xs text-muted-foreground">scroll</span>
        <div className="w-px h-8 bg-border animate-pulse" />
      </div>
    </section>
  )
}

function BotMessage({ from, text }: { from: 'bot' | 'user'; text: string }) {
  return (
    <div className={`flex ${from === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
          from === 'bot'
            ? 'bg-secondary text-foreground rounded-tl-sm'
            : 'bg-primary/20 text-primary border border-primary/30 rounded-tr-sm'
        }`}
      >
        {text}
      </div>
    </div>
  )
}
