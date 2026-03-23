'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: form.password }),
      })
      if (res.ok) {
        router.push('/admin')
      } else {
        setError('Usuário ou senha incorretos.')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    }
    setLoading(false)
  }

  const inputCls =
    'w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-all'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-grid px-4">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, oklch(0.74 0.17 200 / 0.08) 0%, transparent 70%)',
        }}
      />
      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center cyan-glow">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">
              Erick<span className="text-primary">Machine</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Painel Administrativo</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Acesso restrito</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Usuário
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                placeholder="admin"
                className={inputCls}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className={`${inputCls} pr-12`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cyan-glow font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar no painel'
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Senha padrão:{' '}
            <code className="text-primary font-mono bg-primary/10 px-1 py-0.5 rounded">erick2024</code>
          </p>
        </div>
      </div>
    </div>
  )
}
