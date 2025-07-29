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
  Package,
  Scroll,
  Target,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string | undefined }>
  description?: string
}

const navigationItems: NavItem[] = [
  {
    title: 'Tablero',
    href: '/',
    icon: Home,
    description: 'Panel principal del DM',
  },
  {
    title: 'Sesión',
    href: '/session',
    icon: Crown,
    description: 'Gestión de sesión actual',
  },
  {
    title: 'Personajes',
    href: '/characters',
    icon: Users,
    description: 'Gestión de jugadores',
  },
  {
    title: 'NPCs',
    href: '/npcs',
    icon: Users,
    description: 'Personajes no jugadores',
  },
  {
    title: 'Combate',
    href: '/combat',
    icon: Sword,
    description: 'Iniciativa y rastreador de combate',
  },
  {
    title: 'Dados',
    href: '/dice',
    icon: Dice1,
    description: 'Utilidades de dados',
  },
  {
    title: 'Mapas y Ubicaciones',
    href: '/maps',
    icon: Map,
    description: 'Mapas del mundo y ubicaciones',
  },
  {
    title: 'Lore y Tradiciones',
    href: '/lore',
    icon: Scroll,
    description: 'Historia, leyendas y conocimiento del mundo',
  },
  {
    title: 'Misiones',
    href: '/quests',
    icon: Target,
    description: 'Sistema de misiones y objetivos',
  },
  {
    title: 'Notas de Campaña',
    href: '/notes',
    icon: BookOpen,
    description: 'Notas de historia y lore',
  },
  {
    title: 'Hechizos',
    href: '/compendium/spells',
    icon: Zap,
    description: 'Biblioteca de hechizos',
  },
  {
    title: 'Objetos',
    href: '/compendium/items',
    icon: Package,
    description: 'Equipo y objetos mágicos',
  },
]

const adminItems: NavItem[] = [
  {
    title: 'Configuración',
    href: '/settings',
    icon: Settings,
    description: 'Configuración de la aplicación',
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
              Panel de Control DM
            </h2>
          </div>
          <div className="space-y-1">
            <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">
              Herramientas de Campaña
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
            Administración
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
