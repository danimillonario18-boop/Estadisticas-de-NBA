"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Feed, 
  User, 
  Trophy, 
  TrendingUp,
  LogOut
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Feed', href: '/feed', icon: Feed },
  { name: 'Perfil', href: '/profile', icon: User },
  { name: 'Live', href: '/live', icon: Trophy },
  { name: 'Análisis', href: '/analysis', icon: TrendingUp },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-card-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-card-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent">
            <Trophy className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Bet-Analytix</h1>
            <p className="text-xs text-muted">Track. Analyze. Win.</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-accent text-background'
                    : 'text-muted hover:bg-card-hover hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="px-4 py-4 border-t border-card-border">
          {session?.user?.profile ? (
            <div className="space-y-3">
              <Link
                href={`/u/@${session.user.profile.username}`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-card-hover transition-colors"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-background font-semibold">
                  {session.user.profile.displayName?.charAt(0) || session.user.email?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.user.profile.displayName || session.user.email}
                  </p>
                  <p className="text-xs text-muted">@{session.user.profile.username}</p>
                </div>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-danger hover:bg-card-hover transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <div className="px-4 py-3">
              <p className="text-sm text-muted">Cargando perfil...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}