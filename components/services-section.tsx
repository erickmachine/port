'use client'

import { MessageSquare, Bot, Globe, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SERVICES = [
  {
    icon: MessageSquare,
    title: 'Automação WhatsApp',
    description:
      'Transforme seu WhatsApp em uma máquina de vendas e atendimento automático 24h por dia.',
    features: [
      'Respostas automáticas inteligentes',
      'Fluxos de atendimento personalizados',
      'Catálogo de produtos automatizado',
      'Integração com CRM e sistemas',
      'Relatórios e métricas completas',
    ],
    price: 'A partir de R$ 497',
    color: '#25d366',
    badge: 'Mais popular',
  },
  {
    icon: Bot,
    title: 'Desenvolvimento de Bots',
    description:
      'Bots personalizados com inteligência artificial para qualquer plataforma e necessidade.',
    features: [
      'Chatbots com IA (GPT integrado)',
      'Bots para Telegram, Discord, Slack',
      'Integração com APIs externas',
      'Dashboard de controle completo',
      'Suporte e manutenção inclusos',
    ],
    price: 'A partir de R$ 797',
    color: 'oklch(0.74 0.17 200)',
    badge: 'Tecnologia de ponta',
  },
  {
    icon: Globe,
    title: 'Criação de Sites',
    description:
      'Sites modernos, rápidos e otimizados para gerar resultados reais para o seu negócio.',
    features: [
      'Landing pages de alta conversão',
      'Sites institucionais completos',
      'Lojas virtuais (e-commerce)',
      'Design responsivo e moderno',
      'SEO e performance otimizados',
    ],
    price: 'A partir de R$ 697',
    color: 'oklch(0.7 0.18 260)',
    badge: 'Alta conversão',
  },
]

export function ServicesSection() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="servicos" className="py-24 relative">
      {/* Subtle divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, oklch(0.74 0.17 200 / 0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-medium mb-4">
            O que eu faço
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-4">
            Soluções que{' '}
            <span className="text-primary">geram resultados</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Cada serviço é desenvolvido sob medida para o seu negócio,
            com foco em resultados mensuráveis e retorno sobre investimento.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon
            return (
              <div
                key={i}
                className="glass rounded-2xl p-6 flex flex-col gap-5 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: `${svc.color}22`, border: `1px solid ${svc.color}44` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: svc.color }} />
                  </div>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      background: `${svc.color}18`,
                      color: svc.color,
                      border: `1px solid ${svc.color}40`,
                    }}
                  >
                    {svc.badge}
                  </span>
                </div>

                {/* Title + description */}
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1">
                  {svc.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: svc.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-3">{svc.price}</div>
                  <Button
                    onClick={() => handleNav('#contato')}
                    variant="ghost"
                    className="w-full justify-between hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/40 group/btn"
                  >
                    <span>Solicitar orçamento</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
