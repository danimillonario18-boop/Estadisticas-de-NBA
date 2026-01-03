"use client"

import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-card-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Search */}
        <div className="flex items-center flex-1 gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              type="text"
              placeholder="Buscar picks, usuarios, partidos..."
              className="pl-10 bg-card border-card-border text-foreground"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </Button>

          {/* User Avatar */}
          {session?.user?.profile && (
            <Link href={`/u/@${session.user.profile.username}`}>
              <Avatar>
                <AvatarFallback>
                  {session.user.profile.displayName?.charAt(0) || session.user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}