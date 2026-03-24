'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const links = [
  { label: 'Início', href: '#inicio' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Demo', href: '#demo' },
  { label: 'Contato', href: '#contato' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNav('#inicio')}
          className="flex items-center gap-2 group"
          aria-label="Ir para o início"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center cyan-glow group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-foreground font-bold text-lg tracking-tight">
            9<span className="text-primary">Devs.</span>
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => handleNav(l.href)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex">
          <Button
            onClick={() => handleNav('#contato')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 cyan-glow font-semibold text-sm px-5"
          >
            Falar Agora
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border">
          <ul className="px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => handleNav(l.href)}
                  className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  {l.label}
                </button>
              </li>
            ))}
            <li className="pt-2">
              <Button
                onClick={() => handleNav('#contato')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                Falar Agora
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
