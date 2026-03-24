'use client'

import { useState } from 'react'
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const SERVICE_TYPES = [
  'Automação WhatsApp',
  'Bot personalizado',
  'Site / Landing page',
  'E-commerce',
  'Consultoria',
  'Outro',
]

export function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', service: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputCls =
    'w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-all'

  return (
    <section id="contato" className="py-24 relative">
      {/* Glow separator */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, oklch(0.74 0.17 200 / 0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-medium mb-4">
            Contato
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-4">
            Vamos criar algo <span className="text-primary">incrível</span> juntos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Descreva seu projeto e receba uma proposta personalizada em até 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: contact info */}
          <div className="lg:col-span-2 space-y-5">
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/+5592999652961?text=Olá! Vim pelo site e gostaria de saber mais sobre seus serviços."
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-[#25d366]/50 transition-all group block"
            >
              <div className="w-12 h-12 rounded-xl bg-[#25d366]/10 border border-[#25d366]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6 text-[#25d366]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">WhatsApp</div>
                <div className="text-muted-foreground text-sm">(92) 9965-2961</div>
                <div className="text-xs text-[#25d366] mt-0.5">Clique para conversar agora</div>
              </div>
            </a>

            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">E-mail</div>
                <div className="text-muted-foreground text-sm">contato@erickmachine.dev</div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Localização</div>
                <div className="text-muted-foreground text-sm">Manaus, AM — Brasil</div>
                <div className="text-xs text-muted-foreground">Atendimento online para todo o Brasil</div>
              </div>
            </div>

            {/* Response time note */}
            <div className="glass rounded-2xl p-4 border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#25d366] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-foreground">Tempo de resposta</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Respondo em até <strong className="text-foreground">2 horas</strong> durante o horário comercial.
                Para urgências, use o WhatsApp.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-6 sm:p-8">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center cyan-glow">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Mensagem enviada!</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Recebi sua mensagem e retornarei em breve. Enquanto isso, fique à vontade para me chamar no WhatsApp.
                  </p>
                  <Button
                    onClick={() => setStatus('idle')}
                    variant="outline"
                    className="mt-2 border-border hover:border-primary/50"
                  >
                    Enviar outra mensagem
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Nome completo *
                      </label>
                      <input
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        WhatsApp / Telefone
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      E-mail *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Tipo de serviço
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      <option value="">Selecione um serviço...</option>
                      {SERVICE_TYPES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      Conte sobre seu projeto *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Descreva o que você precisa, qual problema quer resolver e qualquer detalhe relevante..."
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-destructive text-xs">
                      Erro ao enviar. Tente novamente ou use o WhatsApp.
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cyan-glow font-semibold py-3 text-base"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar mensagem
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Ao enviar, você concorda com a nossa política de privacidade.
                    Seus dados nunca serão compartilhados.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
