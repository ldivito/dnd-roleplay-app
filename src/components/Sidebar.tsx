'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Home,
  Users,
  Sword,
  Dice1,
  Map,
  BookOpen,
  Settings,
  Crown,
  Shield,
  Zap,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string | undefined }>
  description?: string
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Main DM control panel',
  },
  {
    title: 'Session',
    href: '/session',
    icon: Crown,
    description: 'Current session management',
  },
  {
    title: 'Characters',
    href: '/characters',
    icon: Users,
    description: 'Player & NPC management',
  },
  {
    title: 'Combat',
    href: '/combat',
    icon: Sword,
    description: 'Initiative & combat tracker',
  },
  {
    title: 'Dice Roller',
    href: '/dice',
    icon: Dice1,
    description: 'Dice rolling utilities',
  },
  {
    title: 'Maps & Locations',
    href: '/maps',
    icon: Map,
    description: 'World maps and locations',
  },
  {
    title: 'Campaign Notes',
    href: '/notes',
    icon: BookOpen,
    description: 'Story notes and lore',
  },
  {
    title: 'Spells & Items',
    href: '/compendium',
    icon: Zap,
    description: 'Magic items and spells',
  },
]

const adminItems: NavItem[] = [
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'App configuration',
  },
]

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('pb-12 w-64', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">
              DM Control Panel
            </h2>
          </div>
          <div className="space-y-1">
            <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">
              Campaign Tools
            </h3>
            <ScrollArea className="h-[400px] px-1">
              {navigationItems.map(item => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Button
                    key={item.href}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-2 mb-1',
                      isActive && 'bg-secondary'
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                )
              })}
            </ScrollArea>
          </div>
        </div>

        <Separator />

        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">
            Administration
          </h3>
          <div className="space-y-1">
            {adminItems.map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-2',
                    isActive && 'bg-secondary'
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
