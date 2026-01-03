"use client"

import { useEffect, useState } from 'react'
import AppLayout from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search, Filter, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'

interface Pick {
  id: string
  status: string
  marketType: string
  selectionText: string
  line: number | null
  oddsDecimal: number
  stakeUnits: number
  profitUnits: number
  placedAt: string
  event: {
    homeTeam: { name: string }
    awayTeam: { name: string }
  } | null
  sport: { name: string }
  league: { name: string }
  book: { name: string } | null
}

export default function PicksPage() {
  const [picks, setPicks] = useState<Pick[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    fetchPicks()
  }, [statusFilter])

  const fetchPicks = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)

      const res = await fetch(`/api/picks?${params}`)
      const data = await res.json()

      if (res.ok) {
        setPicks(data.picks)
      }
    } catch (error) {
      console.error('Error fetching picks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPicks = picks.filter(pick =>
    pick.selectionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pick.event?.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pick.event?.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: { variant: 'outline' as const, label: 'Pending' },
      WON: { variant: 'success' as const, label: 'Won' },
      LOST: { variant: 'destructive' as const, label: 'Lost' },
      PUSH: { variant: 'secondary' as const, label: 'Push' },
      VOID: { variant: 'secondary' as const, label: 'Void' },
      CASHOUT: { variant: 'warning' as const, label: 'Cashout' },
    }
    const config = variants[status] || variants.PENDING
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mis Picks</h1>
            <p className="text-muted">Historial completo de tus apuestas</p>
          </div>
          <Link href="/dashboard/picks/new">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Nueva Pick
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="bg-card border-card-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                <Input
                  type="text"
                  placeholder="Buscar picks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('ALL')}
                >
                  Todas
                </Button>
                <Button
                  variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('PENDING')}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'WON' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('WON')}
                >
                  Won
                </Button>
                <Button
                  variant={statusFilter === 'LOST' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('LOST')}
                >
                  Lost
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Picks List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-muted">Cargando picks...</p>
          </div>
        ) : filteredPicks.length === 0 ? (
          <Card className="bg-card border-card-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted mb-4">No hay picks para mostrar</p>
              <Link href="/dashboard/picks/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primera pick
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPicks.map((pick) => (
              <PickCard key={pick.id} pick={pick} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

function PickCard({ pick }: { pick: Pick }) {
  return (
    <Card className="bg-card border-card-border hover:border-accent/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{pick.sport.name}</Badge>
              <Badge variant="outline">{pick.league.name}</Badge>
              {getStatusBadge(pick.status)}
            </div>

            {pick.event && (
              <h3 className="font-semibold text-lg mb-2">
                {pick.event.homeTeam.name} vs {pick.event.awayTeam.name}
              </h3>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted">Mercado</p>
                <p className="font-medium">{pick.marketType}</p>
              </div>
              <div>
                <p className="text-muted">Selección</p>
                <p className="font-medium">{pick.selectionText}</p>
                {pick.line && <p className="text-xs text-muted">{pick.line}</p>}
              </div>
              <div>
                <p className="text-muted">Cuota / Stake</p>
                <p className="font-medium">
                  {pick.oddsDecimal.toFixed(2)} @ {pick.stakeUnits.toFixed(2)}u
                </p>
              </div>
              <div>
                <p className="text-muted">Resultado</p>
                <p className={`font-medium ${pick.profitUnits >= 0 ? 'text-accent' : 'text-danger'}`}>
                  {pick.profitUnits >= 0 ? '+' : ''}{pick.profitUnits.toFixed(2)}u
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-muted">
              <span>Colocada: {formatDateTime(pick.placedAt)}</span>
              {pick.book && <span>Book: {pick.book.name}</span>}
            </div>
          </div>

          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}