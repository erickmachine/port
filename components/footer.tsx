'use client'

import { Zap, Github, Linkedin, Instagram, ArrowUp } from 'lucide-react'

const LINKS = {
  nav: [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Portfólio', href: '#portfolio' },
    { label: 'Demo', href: '#demo' },
    { label: 'Contato', href: '#contato' },
  ],
  social: [
    { icon: Github, label: 'GitHub', href: 'https://github.com/erickmachine' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
  ],
}

export function Footer() {
  const handleNav = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center cyan-glow">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-foreground font-bold text-lg">
                Erick<span className="text-primary">Machine</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Automações WhatsApp, bots inteligentes e sites profissionais que
              fazem o seu negócio crescer no digital.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Navegação
            </h3>
            <ul className="space-y-2">
              {LINKS.nav.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => handleNav(l.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Redes sociais
            </h3>
            <div className="flex gap-3">
              {LINKS.social.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ErickMachine. Todos os direitos reservados.
          </p>
          <button
            onClick={scrollTop}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Voltar ao topo
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  )
}
