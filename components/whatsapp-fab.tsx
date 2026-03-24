'use client'

import { MessageCircle } from 'lucide-react'

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/55929996552961?text=Olá! Vim pelo portfolio e gostaria de saber mais sobre seus serviços."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Falar no WhatsApp"
    >
      <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25d366] shadow-lg hover:scale-110 transition-transform duration-200">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-30" />
        <MessageCircle className="w-7 h-7 text-white relative z-10" />
      </div>
      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
        Falar no WhatsApp
      </div>
    </a>
  )
}
