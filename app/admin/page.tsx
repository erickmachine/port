'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  LogOut,
  Zap,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Trash2,
  Plus,
  X,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type Contact = {
  id: number
  name: string
  email: string
  phone: string
  service: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

type Section = 'dashboard' | 'messages' | 'projects'

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-primary/10 text-primary border-primary/30',
  read: 'bg-secondary text-muted-foreground border-border',
  replied: 'bg-[#25d366]/10 text-[#25d366] border-[#25d366]/30',
}
const STATUS_LABELS: Record<string, string> = {
  new: 'Novo',
  read: 'Lido',
  replied: 'Respondido',
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Agora há pouco'
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

export default function AdminPage() {
  const router = useRouter()
  const [section, setSection] = useState<Section>('dashboard')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selected, setSelected] = useState<Contact | null>(null)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [loadingContacts, setLoadingContacts] = useState(true)

  const fetchContacts = useCallback(async () => {
    setLoadingContacts(true)
    try {
      const res = await fetch('/api/admin/contacts')
      if (res.status === 401) { router.push('/admin/login'); return }
      const data = await res.json()
      setContacts(data)
    } catch (e) {
      console.error('[admin] fetch contacts error', e)
    } finally {
      setLoadingContacts(false)
    }
  }, [router])

  useEffect(() => { fetchContacts() }, [fetchContacts])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const markStatus = async (id: number, status: Contact['status']) => {
    await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    if (selected?.id === id) setSelected((c) => c ? { ...c, status } : c)
  }

  const deleteContact = async (id: number) => {
    await fetch('/api/admin/contacts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setContacts((prev) => prev.filter((c) => c.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const stats = {
    total: contacts.length,
    new: contacts.filter((c) => c.status === 'new').length,
    replied: contacts.filter((c) => c.status === 'replied').length,
  }

  const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare, badge: stats.new },
    { id: 'projects', label: 'Projetos', icon: FolderOpen },
  ] as const

  const SidebarContent = () => (
    <nav className="flex flex-col gap-1 flex-1">
      {NAV.map(({ id, label, icon: Icon, badge }) => (
        <button
          key={id}
          onClick={() => { setSection(id); setMobileSidebar(false) }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            section === id
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left">{label}</span>
          {badge !== undefined && (badge as number) > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
              {badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen flex bg-background">
      {mobileSidebar && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-sidebar border-r border-sidebar-border flex flex-col p-4 transition-transform duration-300 ${
          mobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2 mb-8 px-1">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center cyan-glow">
            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm text-foreground">
            Erick<span className="text-primary">Machine</span>
          </span>
          <button
            onClick={() => setMobileSidebar(false)}
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <SidebarContent />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all mt-auto"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebar(true)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-foreground text-sm">
            {NAV.find((n) => n.id === section)?.label}
          </h1>
          <a href="/" target="_blank" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Ver site
          </a>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {/* ===== DASHBOARD ===== */}
          {section === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total de contatos', value: stats.total, icon: Users, color: 'text-primary' },
                  { label: 'Novas mensagens', value: stats.new, icon: MessageSquare, color: 'text-yellow-400' },
                  { label: 'Respondidos', value: stats.replied, icon: CheckCircle2, color: 'text-[#25d366]' },
                  { label: 'Taxa de resposta', value: stats.total > 0 ? `${Math.round((stats.replied / stats.total) * 100)}%` : '—', icon: TrendingUp, color: 'text-primary' },
                ].map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={i} className="glass rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted-foreground">{s.label}</span>
                        <Icon className={`w-4 h-4 ${s.color}`} />
                      </div>
                      <div className="text-2xl font-bold text-foreground">{s.value}</div>
                    </div>
                  )
                })}
              </div>

              <div className="glass rounded-xl p-5">
                <h2 className="font-semibold text-foreground text-sm mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Últimas mensagens
                </h2>
                {loadingContacts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhuma mensagem ainda.</p>
                ) : (
                  <div className="space-y-3">
                    {contacts.slice(0, 4).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setSection('messages'); setSelected(c) }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground truncate">{c.name}</span>
                            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{timeAgo(c.created_at)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{c.message}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLES[c.status]}`}>
                          {STATUS_LABELS[c.status]}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== MESSAGES ===== */}
          {section === 'messages' && (
            <div className="flex gap-4 h-[calc(100vh-8rem)]">
              <div className={`glass rounded-xl overflow-hidden flex flex-col ${selected ? 'hidden sm:flex w-72 flex-shrink-0' : 'flex flex-1'}`}>
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-foreground text-sm">Contatos ({contacts.length})</h2>
                  <button onClick={fetchContacts} className="text-muted-foreground hover:text-primary transition-colors" title="Atualizar">
                    <Loader2 className={`w-3.5 h-3.5 ${loadingContacts ? 'animate-spin text-primary' : ''}`} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-border">
                  {loadingContacts && (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    </div>
                  )}
                  {!loadingContacts && contacts.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground text-sm">Nenhuma mensagem ainda.</div>
                  )}
                  {contacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={`w-full flex items-start gap-3 p-4 text-left hover:bg-secondary/50 transition-colors ${selected?.id === c.id ? 'bg-secondary/70' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 mt-0.5">
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-medium text-foreground truncate">{c.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLES[c.status]}`}>
                            {STATUS_LABELS[c.status]}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{c.service}</p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">{timeAgo(c.created_at)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selected && (
                <div className="flex-1 glass rounded-xl flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                    <button onClick={() => setSelected(null)} className="sm:hidden text-muted-foreground hover:text-foreground">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {selected.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground text-sm">{selected.name}</div>
                      <div className="text-xs text-muted-foreground">{selected.service}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markStatus(selected.id, 'replied')}
                        className="text-xs border-border hover:border-[#25d366]/50 hover:text-[#25d366]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Respondido
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteContact(selected.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InfoCard icon={Mail} label="E-mail" value={selected.email} />
                      <InfoCard icon={Phone} label="Telefone" value={selected.phone || '—'} />
                    </div>
                    <div className="glass rounded-xl p-4">
                      <div className="text-xs text-muted-foreground font-medium mb-2">Mensagem</div>
                      <p className="text-sm text-foreground leading-relaxed">{selected.message}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-muted-foreground">Alterar status:</span>
                      {(['new', 'read', 'replied'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => markStatus(selected.id, s)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                            selected.status === s ? STATUS_STYLES[s] + ' font-medium' : 'border-border text-muted-foreground hover:bg-secondary'
                          }`}
                        >
                          {STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/${(selected.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${selected.name}! Vi sua mensagem sobre ${selected.service}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" className="bg-[#25d366]/10 text-[#25d366] hover:bg-[#25d366]/20 border border-[#25d366]/30 text-xs">
                          Responder no WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== PROJECTS ===== */}
          {section === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Gerenciar Projetos</h2>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Novo projeto
                </Button>
              </div>
              <div className="glass rounded-xl p-5 text-center py-16 text-muted-foreground">
                <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Gerencie os projetos do portfólio aqui.</p>
                <p className="text-xs mt-1 opacity-70">Em breve: adicionar e editar projetos diretamente pelo painel.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3 flex items-center gap-3">
      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground font-medium">{value}</div>
      </div>
    </div>
  )
}
