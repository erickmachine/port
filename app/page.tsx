import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/hero-section'
import { ServicesSection } from '@/components/services-section'
import { PortfolioSection } from '@/components/portfolio-section'
import { BotDemoSection } from '@/components/bot-demo-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'
import { WhatsAppFab } from '@/components/whatsapp-fab'
import { ChatWidget } from '@/components/chat-widget'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <BotDemoSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFab />
      <ChatWidget />
    </>
  )
}
