import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, TrendingUp, BarChart3, Shield, Users, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container px-6 mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-card border border-card-border">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-muted">La plataforma definitiva de seguimiento de apuestas</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent">
              Crea tu historial de picks<br />y muestra tu ROI real
            </h1>
            
            <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">
              Registra tus apuestas deportivas, analiza tu rendimiento con métricas precisas y construye tu reputación como tipster verificado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6">
                  Comenzar Gratis
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card-lighter">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas para dominar tus apuestas
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Potentes herramientas de análisis, seguimiento detallado y perfiles públicos tipo tipster
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-accent" />}
              title="Métricas Precisas"
              description="ROI, Yield, Win Rate, Drawdown, Equity Curve y más. Calculadas con fórmulas exactas y confiables."
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8 text-accent" />}
              title="Eventos Reales"
              description="Conecta tus picks con partidos reales. Validación automática de resultados cuando estén disponibles."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-accent" />}
              title="Perfil Público"
              description="Muestra tu historial como tipster verificado. Sigue a los mejores y construye tu comunidad."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-accent" />}
              title="Análisis Avanzado"
              description="Breakdown por deporte, mercado, bookmaker. Descubre tus fortalezas y áreas de mejora."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-accent" />}
              title="Auditoría Total"
              description="Sistema de auditoría que registra todos los cambios. Transparencia total en tu historial."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-accent" />}
              title="Feed en Tiempo Real"
              description="Sigue a tipsters, recibe notificaciones y descubre las mejores picks de la comunidad."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-muted">
              Tres simples pasos para empezar a mejorar tu rendimiento
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                number="1"
                title="Regístrate"
                description="Crea tu cuenta en segundos. Configura tu perfil público o privado según tus preferencias."
              />
              <StepCard
                number="2"
                title="Registra Picks"
                description="Añade tus apuestas conectándolas con eventos reales. Define stake, cuota y mercado."
              />
              <StepCard
                number="3"
                title="Analiza y Comparte"
                description="Visualiza tu progreso con gráficas interactivas y comparte tu perfil con la comunidad."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card-lighter">
        <div className="container px-6 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para mejorar tu betting?
          </h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
            Únete a miles de betters que ya están tomando decisiones más informadas
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-10 py-7">
              Crear Cuenta Gratuita
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-card-border">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-accent" />
              <span className="text-xl font-bold">Bet-Analytix</span>
            </div>
            <p className="text-muted text-sm">
              © 2024 Bet-Analytix. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-card border-card-border hover:border-accent/50 transition-colors">
      <CardHeader>
        <div className="w-14 h-14 rounded-lg bg-card-lighter flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function StepCard({ number, title, description }: { number: number, title: string, description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-accent text-background text-2xl font-bold flex items-center justify-center mx-auto mb-6">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  )
}