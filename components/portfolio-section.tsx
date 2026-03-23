'use client'

import { useState } from 'react'
import { ExternalLink, Github, MessageSquare, Bot, Globe, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Layers },
  { id: 'whatsapp', label: 'WhatsApp Bot', icon: MessageSquare },
  { id: 'bot', label: 'Bots', icon: Bot },
  { id: 'site', label: 'Sites', icon: Globe },
]

const PROJECTS = [
  {
    id: 1,
    title: 'EricBot — Atendimento Automático',
    description: 'Bot completo para WhatsApp com cardápio digital, pedidos automáticos e pagamento via Pix integrado.',
    category: 'whatsapp',
    tags: ['WhatsApp API', 'Node.js', 'Baileys'],
    color: 'from-[#25d366]/20 to-[#128c7e]/20',
    accentColor: '#25d366',
    demo: '#demo',
    github: 'https://github.com/erickmachine',
  },
  {
    id: 2,
    title: 'Agenda Pro — Sistema de Agendamentos',
    description: 'Automação completa de agendamentos via WhatsApp para salões, clínicas e serviços profissionais.',
    category: 'whatsapp',
    tags: ['Automação', 'MySQL', 'API'],
    color: 'from-primary/20 to-cyan-500/10',
    accentColor: 'oklch(0.74 0.17 200)',
    demo: '#demo',
    github: 'https://github.com/erickmachine',
  },
  {
    id: 3,
    title: 'SaleBot IA — Vendas Automáticas',
    description: 'Chatbot com GPT integrado para vendas consultivas, qualificação de leads e follow-up automático.',
    category: 'bot',
    tags: ['GPT-4', 'React', 'Next.js'],
    color: 'from-violet-500/20 to-blue-500/10',
    accentColor: '#7c3aed',
    demo: '#demo',
    github: 'https://github.com/erickmachine',
  },
  {
    id: 4,
    title: 'Loja Elegante — E-commerce',
    description: 'Loja virtual moderna e de alta conversão com checkout otimizado, integração de pagamento e admin completo.',
    category: 'site',
    tags: ['Next.js', 'Stripe', 'PostgreSQL'],
    color: 'from-orange-500/20 to-amber-500/10',
    accentColor: '#f97316',
    demo: '#demo',
    github: 'https://github.com/erickmachine',
  },
  {
    id: 5,
    title: 'NotifyFlow — Sistema de Notificações',
    description: 'Plataforma de envio em massa para WhatsApp com segmentação, agendamento e relatórios detalhados.',
    category: 'bot',
    tags: ['WhatsApp', 'Bull Queue', 'Redis'],
    color: 'from-rose-500/20 to-pink-500/10',
    accentColor: '#f43f5e',
    demo: '#demo',
    github: 'https://github.com/erickmachine',
  },
  {
    id: 6,
    title: 'LandPro — Landing Page Converter',
    description: 'Template de landing page com taxa de conversão 40% acima da média, A/B testing e analytics.',
    category: 'site',
    tags: ['React', 'Tailwind', 'SEO'],
    color: 'from-teal-500/20 to-green-500/10',
    accentColor: '#14b8a6',
    demo: '#demo',
    github: 'https://github.com/erickmachine',
  },
]

export function PortfolioSection() {
  const [active, setActive] = useState('all')

  const filtered =
    active === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === active)

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-medium mb-4">
            Portfólio
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-4">
            Projetos <span className="text-primary">reais</span>, resultados reais
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Cada projeto foi desenvolvido com foco em performance e retorno sobre investimento.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active === cat.id
                    ? 'bg-primary text-primary-foreground cyan-glow'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="glass rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 group flex flex-col"
            >
              {/* Visual area */}
              <div className={`h-40 bg-gradient-to-br ${proj.color} relative flex items-center justify-center`}>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black"
                  style={{ background: `${proj.accentColor}22`, border: `2px solid ${proj.accentColor}44`, color: proj.accentColor }}
                >
                  {proj.title.charAt(0)}
                </div>
                {/* Category pill */}
                <span
                  className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: `${proj.accentColor}22`, color: proj.accentColor, border: `1px solid ${proj.accentColor}40` }}
                >
                  {CATEGORIES.find((c) => c.id === proj.category)?.label}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 gap-3">
                <h3 className="font-bold text-foreground text-base leading-snug">{proj.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{proj.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => { const el = document.querySelector(proj.demo); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}
                    className="flex-1 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 text-xs"
                    variant="ghost"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Ver Demo
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(proj.github, '_blank')}
                    className="px-3 bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground hover:text-foreground"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => window.open('https://github.com/erickmachine', '_blank')}
            className="border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
          >
            <Github className="w-4 h-4 mr-2" />
            Ver todos os projetos no GitHub
          </Button>
        </div>
      </div>
    </section>
  )
}
