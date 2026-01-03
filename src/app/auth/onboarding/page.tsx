"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trophy, Loader2, Check } from 'lucide-react'

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    country: 'US',
    currency: 'USD',
    isPublic: true,
    bankroll: 1000,
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (!searchParams.get('userId')) {
      router.push('/auth/login')
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const userId = searchParams.get('userId')
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear perfil')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-2xl bg-card border-card-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-accent">
              <Trophy className="w-10 h-10 text-background" />
            </div>
          </div>
          <CardTitle className="text-2xl">Configura tu Perfil</CardTitle>
          <CardDescription>
            Completa tu perfil para comenzar a usar Bet-Analytix
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-danger bg-danger/10 border border-danger/20 rounded-md">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">@Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="tipsterpro"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted">Solo letras, números y guiones bajos</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Nombre a mostrar</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (opcional)</Label>
              <Textarea
                id="bio"
                placeholder="Cuéntanos sobre ti y tu experiencia en apuestas..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                disabled={isLoading}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                  <SelectTrigger id="country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">Estados Unidos</SelectItem>
                    <SelectItem value="ES">España</SelectItem>
                    <SelectItem value="MX">México</SelectItem>
                    <SelectItem value="AR">Argentina</SelectItem>
                    <SelectItem value="CO">Colombia</SelectItem>
                    <SelectItem value="BR">Brasil</SelectItem>
                    <SelectItem value="GB">Reino Unido</SelectItem>
                    <SelectItem value="DE">Alemania</SelectItem>
                    <SelectItem value="FR">Francia</SelectItem>
                    <SelectItem value="IT">Italia</SelectItem>
                    <SelectItem value="PT">Portugal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Moneda</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="MXN">MXN ($)</SelectItem>
                    <SelectItem value="ARS">ARS ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankroll">Bankroll inicial (unidades)</Label>
                <Input
                  id="bankroll"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.bankroll}
                  onChange={(e) => setFormData({ ...formData, bankroll: parseFloat(e.target.value) })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isPublic">Visibilidad del perfil</Label>
                <Select value={formData.isPublic ? 'true' : 'false'} onValueChange={(value) => setFormData({ ...formData, isPublic: value === 'true' })}>
                  <SelectTrigger id="isPublic">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Público</SelectItem>
                    <SelectItem value="false">Privado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Configurando perfil...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Comenzar a Usar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}