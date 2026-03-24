'use client'

import { useState } from 'react'
import {
  ShoppingCart,
  Utensils,
  Stethoscope,
  Rocket,
  Scissors,
  BookOpen,
  Monitor,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type SiteDemo = {
  id: string
  label: string
  icon: React.ElementType
  accent: string
  badge: string
  device: 'desktop' | 'mobile'
  preview: React.FC
}

/* ─── Mini previews renderizadas como JSX ─── */

function EcommercePreview() {
  return (
    <div className="w-full h-full bg-white text-gray-900 font-sans text-[10px] overflow-hidden flex flex-col">
      {/* nav */}
      <div className="bg-orange-500 text-white px-3 py-1.5 flex items-center justify-between">
        <span className="font-bold text-xs">ShopMax</span>
        <div className="flex gap-2 items-center text-[9px]">
          <span>Início</span><span>Produtos</span><span>Ofertas</span>
          <div className="bg-white/20 rounded px-1.5 py-0.5">Carrinho (2)</div>
        </div>
      </div>
      {/* hero */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-3 flex items-center justify-between">
        <div>
          <div className="text-[8px] text-orange-500 font-semibold uppercase tracking-wide mb-0.5">Oferta do dia</div>
          <div className="font-black text-sm leading-tight text-gray-800">até 70%<br/>de desconto</div>
          <div className="mt-1.5 bg-orange-500 text-white text-[8px] px-2 py-0.5 rounded-full inline-block">Comprar agora</div>
        </div>
        <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-7 h-7 text-orange-400" />
        </div>
      </div>
      {/* products */}
      <div className="px-3 py-2 flex-1">
        <div className="text-[9px] font-bold text-gray-700 mb-1.5">Mais vendidos</div>
        <div className="grid grid-cols-3 gap-1.5">
          {['Tênis Pro', 'Camiseta', 'Mochila'].map((p, i) => (
            <div key={p} className="bg-gray-50 rounded-lg p-1.5 border border-gray-100">
              <div className="h-8 bg-gradient-to-br from-orange-100 to-amber-100 rounded mb-1 flex items-center justify-center text-sm">
                {['👟', '👕', '🎒'][i]}
              </div>
              <div className="text-[8px] font-semibold text-gray-700 truncate">{p}</div>
              <div className="text-[8px] text-orange-500 font-bold">R$ {[149, 59, 199][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RestaurantePreview() {
  return (
    <div className="w-full h-full bg-[#1a0a00] text-white font-sans text-[10px] overflow-hidden flex flex-col">
      <div className="bg-[#c0392b] px-3 py-1.5 flex items-center justify-between">
        <span className="font-black text-xs italic">La Bella</span>
        <div className="flex gap-2 text-[9px] text-red-200">
          <span>Cardápio</span><span>Reservas</span><span>Contato</span>
        </div>
      </div>
      <div className="relative h-20 bg-gradient-to-b from-[#c0392b]/40 to-transparent flex items-end px-3 pb-2">
        <div>
          <div className="font-black text-sm leading-tight">Sabores que<br/>encantam</div>
          <div className="text-[8px] text-red-300 mt-0.5">Reservas online disponíveis</div>
        </div>
        <div className="ml-auto text-3xl">🍝</div>
      </div>
      <div className="px-3 py-2 flex-1">
        <div className="text-[9px] text-red-400 font-bold mb-1.5">DESTAQUES DO DIA</div>
        <div className="space-y-1">
          {[
            { n: 'Fettuccine ao Funghi', p: 'R$ 58', e: '🍄' },
            { n: 'Filé à Parmigiana', p: 'R$ 72', e: '🥩' },
            { n: 'Tiramisù', p: 'R$ 28', e: '🍰' },
          ].map((i) => (
            <div key={i.n} className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
              <span className="text-base">{i.e}</span>
              <div className="flex-1">
                <div className="text-[9px] font-medium text-white">{i.n}</div>
              </div>
              <div className="text-[9px] text-red-400 font-bold">{i.p}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ClinicaPreview() {
  return (
    <div className="w-full h-full bg-white text-gray-900 font-sans text-[10px] overflow-hidden flex flex-col">
      <div className="bg-[#0284c7] px-3 py-1.5 flex items-center justify-between text-white">
        <span className="font-bold text-xs">Clínica Saúde+</span>
        <div className="bg-white/20 text-[9px] px-2 py-0.5 rounded">Agendar consulta</div>
      </div>
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-3 py-3">
        <div className="text-[9px] text-sky-600 font-semibold mb-0.5">Bem-vindo</div>
        <div className="font-black text-sm text-gray-800 leading-tight">Cuidamos da sua<br/>saúde com carinho</div>
        <div className="mt-2 flex gap-1.5">
          <div className="bg-sky-500 text-white text-[8px] px-2 py-0.5 rounded-full">Agendar</div>
          <div className="border border-sky-300 text-sky-600 text-[8px] px-2 py-0.5 rounded-full">Exames</div>
        </div>
      </div>
      <div className="px-3 py-2 flex-1">
        <div className="text-[9px] font-bold text-gray-500 mb-1.5">ESPECIALIDADES</div>
        <div className="grid grid-cols-3 gap-1">
          {[
            { n: 'Clínico Geral', e: '🩺' },
            { n: 'Pediatria', e: '👶' },
            { n: 'Cardiologia', e: '❤️' },
            { n: 'Ortopedia', e: '🦴' },
            { n: 'Nutrição', e: '🥗' },
            { n: 'Psicologia', e: '🧠' },
          ].map((s) => (
            <div key={s.n} className="bg-sky-50 rounded-lg px-1.5 py-1.5 text-center border border-sky-100">
              <div className="text-sm">{s.e}</div>
              <div className="text-[7px] text-gray-600 font-medium mt-0.5 leading-tight">{s.n}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LandingPreview() {
  return (
    <div className="w-full h-full bg-[#0f0c29] text-white font-sans text-[10px] overflow-hidden flex flex-col">
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-white/10">
        <span className="font-black text-[11px] text-purple-400">LaunchKit</span>
        <div className="bg-purple-500 text-white text-[8px] px-2 py-0.5 rounded-full">Começar grátis</div>
      </div>
      <div className="flex-1 px-3 py-3 flex flex-col items-center justify-center text-center">
        <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-2">
          <Rocket className="w-4 h-4 text-purple-400" />
        </div>
        <div className="font-black text-base leading-tight text-balance">
          Sua startup decola<br/>mais rápido
        </div>
        <div className="text-[8px] text-gray-400 mt-1 max-w-[120px] leading-tight">
          Landing pages que convertem 3x mais
        </div>
        <div className="mt-2 bg-purple-500 text-white text-[9px] px-3 py-1 rounded-full font-semibold">
          Ver demonstração
        </div>
        <div className="mt-3 flex gap-3 text-[8px] text-gray-400">
          <span>✓ Grátis por 14 dias</span>
          <span>✓ Sem cartão</span>
        </div>
      </div>
      <div className="px-3 py-2 border-t border-white/10">
        <div className="flex justify-around text-[8px] text-gray-500">
          <div className="text-center"><div className="text-purple-400 font-bold text-sm">2.4k</div><div>Clientes</div></div>
          <div className="text-center"><div className="text-purple-400 font-bold text-sm">98%</div><div>Satisfação</div></div>
          <div className="text-center"><div className="text-purple-400 font-bold text-sm">3x</div><div>Conversão</div></div>
        </div>
      </div>
    </div>
  )
}

function SalaoPreview() {
  return (
    <div className="w-full h-full bg-[#1a0033] text-white font-sans text-[10px] overflow-hidden flex flex-col">
      <div className="px-3 py-1.5 bg-pink-600 flex items-center justify-between">
        <span className="font-black text-xs italic text-white">Studio Pink</span>
        <div className="text-[9px] text-pink-200 flex gap-2">
          <span>Serviços</span><span>Galeria</span><span>Agendar</span>
        </div>
      </div>
      <div className="bg-gradient-to-b from-pink-900/40 to-transparent px-3 py-3">
        <div className="text-[8px] text-pink-400 font-semibold mb-0.5">Bem-vinda</div>
        <div className="font-black text-sm leading-tight">Beleza que<br/>transforma</div>
        <div className="mt-1.5 bg-pink-500 text-white text-[8px] px-2 py-0.5 rounded-full inline-block">Agendar agora</div>
      </div>
      <div className="px-3 py-2 flex-1">
        <div className="text-[9px] text-pink-400 font-bold mb-1.5">SERVIÇOS</div>
        <div className="space-y-1">
          {[
            { n: 'Corte Feminino', p: 'R$ 80', e: '✂️' },
            { n: 'Coloração', p: 'R$ 150+', e: '🎨' },
            { n: 'Manicure', p: 'R$ 35', e: '💅' },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1">
              <span>{s.e}</span>
              <span className="flex-1 text-[9px]">{s.n}</span>
              <span className="text-pink-400 font-bold text-[9px]">{s.p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CursoPreview() {
  return (
    <div className="w-full h-full bg-[#0a0a1a] text-white font-sans text-[10px] overflow-hidden flex flex-col">
      <div className="px-3 py-1.5 flex items-center justify-between border-b border-white/10">
        <span className="font-black text-xs text-yellow-400">EduPro</span>
        <div className="flex gap-2 text-[9px] text-gray-400">
          <span>Cursos</span><span>Trilhas</span>
          <div className="bg-yellow-500 text-black text-[8px] px-1.5 py-0.5 rounded font-bold">Entrar</div>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="text-[8px] text-yellow-500 font-semibold uppercase tracking-wide mb-0.5">Plataforma EAD</div>
        <div className="font-black text-sm leading-tight">Aprenda no seu<br/>ritmo</div>
      </div>
      <div className="px-3 py-2 flex-1">
        <div className="text-[9px] text-yellow-500 font-bold mb-1.5">CURSOS EM DESTAQUE</div>
        <div className="space-y-1">
          {[
            { n: 'Marketing Digital', e: '📱', p: '4.9', h: '24h' },
            { n: 'Design com Figma', e: '🎨', p: '4.8', h: '18h' },
            { n: 'Python do Zero', e: '🐍', p: '4.7', h: '32h' },
          ].map((c) => (
            <div key={c.n} className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5">
              <span className="text-base">{c.e}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-medium truncate">{c.n}</div>
                <div className="text-[7px] text-gray-500">{c.h} de conteúdo</div>
              </div>
              <div className="text-[8px] text-yellow-400">⭐ {c.p}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SITE_DEMOS: SiteDemo[] = [
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart, accent: '#f97316', badge: 'Vendas', device: 'desktop', preview: EcommercePreview },
  { id: 'restaurante', label: 'Restaurante', icon: Utensils, accent: '#c0392b', badge: 'Food', device: 'mobile', preview: RestaurantePreview },
  { id: 'clinica', label: 'Clínica / Saúde', icon: Stethoscope, accent: '#0284c7', badge: 'Saúde', device: 'desktop', preview: ClinicaPreview },
  { id: 'landing', label: 'Landing Page', icon: Rocket, accent: '#7c3aed', badge: 'Startup', device: 'mobile', preview: LandingPreview },
  { id: 'salao', label: 'Salão / Beleza', icon: Scissors, accent: '#ec4899', badge: 'Beleza', device: 'mobile', preview: SalaoPreview },
  { id: 'curso', label: 'Curso Online', icon: BookOpen, accent: '#eab308', badge: 'EAD', device: 'desktop', preview: CursoPreview },
]

export function SitesDemoSection() {
  const [activeId, setActiveId] = useState('ecommerce')
  const currentIndex = SITE_DEMOS.findIndex((s) => s.id === activeId)
  const active = SITE_DEMOS[currentIndex]
  const PreviewComponent = active.preview

  const prev = () => setActiveId(SITE_DEMOS[(currentIndex - 1 + SITE_DEMOS.length) % SITE_DEMOS.length].id)
  const next = () => setActiveId(SITE_DEMOS[(currentIndex + 1) % SITE_DEMOS.length].id)

  return (
    <section id="sites-demo" className="py-24 relative bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-medium mb-4">
            Demo de Sites
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-4">
            Sites para <span className="text-primary">todo tipo</span> de negócio
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Cada segmento tem uma necessidade diferente. Veja como entrego sites
            otimizados para converter visitantes em clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left — selector list */}
          <div className="space-y-2">
            {SITE_DEMOS.map((demo) => {
              const Icon = demo.icon
              const isActive = demo.id === activeId
              return (
                <button
                  key={demo.id}
                  onClick={() => setActiveId(demo.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-200 border ${
                    isActive
                      ? 'bg-card/80 border-primary/40 shadow-lg'
                      : 'bg-card/30 border-border/40 hover:border-border hover:bg-card/50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: isActive ? `${demo.accent}22` : 'transparent',
                      border: `2px solid ${isActive ? demo.accent + '66' : 'transparent'}`,
                      color: isActive ? demo.accent : 'var(--muted-foreground)',
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {demo.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Design moderno · Responsivo · Alta conversão
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium border flex-shrink-0"
                      style={{
                        background: `${demo.accent}15`,
                        color: demo.accent,
                        borderColor: `${demo.accent}40`,
                      }}
                    >
                      {demo.badge}
                    </span>
                    <div className="flex-shrink-0">
                      {demo.device === 'mobile'
                        ? <Smartphone className="w-3.5 h-3.5 text-muted-foreground/50" />
                        : <Monitor className="w-3.5 h-3.5 text-muted-foreground/50" />
                      }
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right — preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-between px-1">
              <button onClick={prev} className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-foreground">{active.label}</span>
              <button onClick={next} className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Device mockup */}
            {active.device === 'desktop' ? (
              /* Desktop mockup */
              <div className="w-full max-w-sm">
                <div className="glass rounded-2xl overflow-hidden border-2 border-border/60 shadow-2xl">
                  {/* browser bar */}
                  <div className="bg-secondary/80 px-3 py-2 flex items-center gap-2 border-b border-border/40">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                    </div>
                    <div className="flex-1 bg-background/60 rounded-md px-3 py-1 text-[10px] text-muted-foreground text-center">
                      seusite.com.br
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground/50" />
                  </div>
                  <div className="h-64 overflow-hidden">
                    <PreviewComponent />
                  </div>
                </div>
              </div>
            ) : (
              /* Mobile mockup */
              <div className="relative w-44 mx-auto">
                <div
                  className="rounded-[2rem] overflow-hidden border-4 shadow-2xl"
                  style={{ borderColor: `${active.accent}66`, boxShadow: `0 0 40px ${active.accent}22` }}
                >
                  {/* notch */}
                  <div className="bg-card/90 h-5 flex items-center justify-center">
                    <div className="w-12 h-1.5 rounded-full bg-border" />
                  </div>
                  <div className="h-72 overflow-hidden">
                    <PreviewComponent />
                  </div>
                  {/* home bar */}
                  <div className="bg-card/90 h-4 flex items-center justify-center">
                    <div className="w-16 h-1 rounded-full bg-border" />
                  </div>
                </div>
              </div>
            )}

            <Button
              className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 text-sm"
              variant="ghost"
              onClick={() => {
                const el = document.getElementById('contact')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Quero um site assim
              <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
