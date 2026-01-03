import AppLayout from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, TrendingUp, TrendingDown, DollarSign, Target, Activity, BarChart3 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted">Resumen de tu rendimiento</p>
          </div>
          <Link href="/dashboard/picks/new">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Nueva Pick
            </Button>
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="ROI"
            value="+12.5%"
            trend="+2.3%"
            positive
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <KPICard
            title="Ganancia Neta"
            value="+1,250u"
            trend="+450u"
            positive
            icon={<DollarSign className="h-5 w-5" />}
          />
          <KPICard
            title="Win Rate"
            value="58.3%"
            trend="-1.2%"
            positive={false}
            icon={<Target className="h-5 w-5" />}
          />
          <KPICard
            title="Picks Totales"
            value="156"
            trend="+12 este mes"
            positive
            icon={<Activity className="h-5 w-5" />}
          />
        </div>

        {/* Charts and Details */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Equity Curve */}
          <Card className="col-span-2 bg-card border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                Equity Curve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-card-lighter rounded-lg border border-card-border">
                <p className="text-muted">Gráfica de equity curve (Próximamente)</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Performance */}
          <Card className="bg-card border-card-border">
            <CardHeader>
              <CardTitle>Racha Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">4W</div>
                  <p className="text-sm text-muted">4 victorias consecutivas</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted">Mejor racha</span>
                    <span className="font-semibold">8W</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted">Peor racha</span>
                    <span className="font-semibold text-danger">5L</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted">Drawdown máx</span>
                    <span className="font-semibold text-danger">-250u</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Picks */}
        <Card className="bg-card border-card-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Picks Recientes</CardTitle>
              <Link href="/dashboard/picks">
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <RecentPick key={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

function KPICard({ 
  title, 
  value, 
  trend, 
  positive, 
  icon 
}: { 
  title: string
  value: string
  trend: string
  positive: boolean
  icon: React.ReactNode
}) {
  return (
    <Card className="bg-card border-card-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-xs mt-1 ${positive ? 'text-accent' : 'text-danger'}`}>
          {positive ? (
            <TrendingUp className="mr-1 h-3 w-3" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3" />
          )}
          <span>{trend}</span>
          <span className="text-muted ml-1">vs mes anterior</span>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentPick() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-card-lighter border border-card-border hover:border-accent/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline">NFL</Badge>
          <span className="text-sm text-muted">Hace 2 horas</span>
        </div>
        <p className="font-medium">Kansas City Chiefs vs Buffalo Bills</p>
        <p className="text-sm text-muted">Moneyline - Chiefs @ 1.85</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-muted">Stake</p>
          <p className="font-semibold">2u</p>
        </div>
        <Badge variant="success" className="px-3 py-1">
          Won +1.7u
        </Badge>
      </div>
    </div>
  )
}