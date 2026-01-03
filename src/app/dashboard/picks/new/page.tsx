"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPickPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    eventId: '',
    sportId: '',
    leagueId: '',
    marketType: 'MONEYLINE',
    selectionText: '',
    line: '',
    oddsDecimal: '',
    stakeUnits: '',
    bookId: '',
    note: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const payload = {
        ...formData,
        line: formData.line ? parseFloat(formData.line) : undefined,
        oddsDecimal: parseFloat(formData.oddsDecimal),
        stakeUnits: parseFloat(formData.stakeUnits),
      }

      const res = await fetch('/api/picks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear pick')
      }

      router.push('/dashboard/picks')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Nueva Pick</h1>
            <p className="text-muted">Registra una nueva apuesta</p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-card border-card-border">
          <CardHeader>
            <CardTitle>Detalles de la Pick</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-danger bg-danger/10 border border-danger/20 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sportId">Deporte *</Label>
                  <Select
                    value={formData.sportId}
                    onValueChange={(value) => setFormData({ ...formData, sportId: value })}
                    required
                  >
                    <SelectTrigger id="sportId">
                      <SelectValue placeholder="Seleccionar deporte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sport-1">Football</SelectItem>
                      <SelectItem value="sport-2">Basketball</SelectItem>
                      <SelectItem value="sport-3">Tennis</SelectItem>
                      <SelectItem value="sport-4">Soccer</SelectItem>
                      <SelectItem value="sport-5">Baseball</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leagueId">Liga *</Label>
                  <Select
                    value={formData.leagueId}
                    onValueChange={(value) => setFormData({ ...formData, leagueId: value })}
                    required
                  >
                    <SelectTrigger id="leagueId">
                      <SelectValue placeholder="Seleccionar liga" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="league-1">NFL</SelectItem>
                      <SelectItem value="league-2">NBA</SelectItem>
                      <SelectItem value="league-3">Premier League</SelectItem>
                      <SelectItem value="league-4">La Liga</SelectItem>
                      <SelectItem value="league-5">MLB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="marketType">Tipo de Mercado *</Label>
                  <Select
                    value={formData.marketType}
                    onValueChange={(value) => setFormData({ ...formData, marketType: value })}
                    required
                  >
                    <SelectTrigger id="marketType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONEYLINE">Moneyline</SelectItem>
                      <SelectItem value="SPREAD">Spread</SelectItem>
                      <SelectItem value="TOTAL">Total</SelectItem>
                      <SelectItem value="PROP">Prop</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bookId">Bookmaker</Label>
                  <Select
                    value={formData.bookId}
                    onValueChange={(value) => setFormData({ ...formData, bookId: value })}
                  >
                    <SelectTrigger id="bookId">
                      <SelectValue placeholder="Seleccionar bookmaker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book-1">Bet365</SelectItem>
                      <SelectItem value="book-2">Pinnacle</SelectItem>
                      <SelectItem value="book-3">Betway</SelectItem>
                      <SelectItem value="book-4">William Hill</SelectItem>
                      <SelectItem value="book-5">FanDuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="selectionText">Selección *</Label>
                <Input
                  id="selectionText"
                  placeholder="Ej: Kansas City Chiefs, Over 52.5, etc."
                  value={formData.selectionText}
                  onChange={(e) => setFormData({ ...formData, selectionText: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="line">Línea</Label>
                  <Input
                    id="line"
                    type="number"
                    step="0.5"
                    placeholder="Ej: -3.5, 52.5"
                    value={formData.line}
                    onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted">Solo para spreads y totals</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oddsDecimal">Cuota Decimal *</Label>
                  <Input
                    id="oddsDecimal"
                    type="number"
                    step="0.01"
                    min="1.01"
                    placeholder="Ej: 1.85, 2.10"
                    value={formData.oddsDecimal}
                    onChange={(e) => setFormData({ ...formData, oddsDecimal: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stakeUnits">Stake (Unidades) *</Label>
                  <Input
                    id="stakeUnits"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Ej: 1, 2, 3"
                    value={formData.stakeUnits}
                    onChange={(e) => setFormData({ ...formData, stakeUnits: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Notas (opcional)</Label>
                <Textarea
                  id="note"
                  placeholder="Análisis, razonamiento, notas adicionales..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" size="lg" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando pick...
                    </>
                  ) : (
                    'Crear Pick'
                  )}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline" size="lg">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}