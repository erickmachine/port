import type { Metadata } from 'next'
import { Space_Grotesk, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Erick Machine | Automações WhatsApp, Bots & Sites',
  description:
    'Desenvolvimento de automações para WhatsApp, bots inteligentes e sites profissionais. Soluções tecnológicas de alto impacto para o seu negócio.',
  keywords: [
    'automação whatsapp',
    'bot whatsapp',
    'desenvolvimento de sites',
    'bot personalizado',
    'chatbot',
    'manaus',
  ],
  authors: [{ name: 'Erick Machine', url: 'https://github.com/erickmachine' }],
  openGraph: {
    title: 'Erick Machine | Automações & Desenvolvimento',
    description: 'Automações WhatsApp, bots e sites de alta conversão.',
    type: 'website',
  },
  themeColor: '#00c8e8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
