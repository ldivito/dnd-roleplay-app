'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
  Building,
  Library,
  Database,
  Calendar,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string | undefined }>
  description?: string
}

// Organized navigation with logical groupings
const coreToolsItems: NavItem[] = [
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
    title: 'Calendario',
    href: '/calendar',
    icon: Calendar,
    description: 'Sistema de calendario personalizado',
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
]

const charactersAndWorldItems: NavItem[] = [
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
    title: 'Mapas y Ubicaciones',
    href: '/maps',
    icon: Map,
    description: 'Mapas del mundo y ubicaciones',
  },
  {
    title: 'Grupos y Facciones',
    href: '/factions',
    icon: Building,
    description: 'Organizaciones, gremios y facciones',
  },
]

const storyAndContentItems: NavItem[] = [
  {
    title: 'Misiones',
    href: '/quests',
    icon: Target,
    description: 'Sistema de misiones y objetivos',
  },
  {
    title: 'Lore y Tradiciones',
    href: '/lore',
    icon: Scroll,
    description: 'Historia, leyendas y conocimiento del mundo',
  },
  {
    title: 'Notas de Campaña',
    href: '/notes',
    icon: BookOpen,
    description: 'Notas de historia y lore',
  },
]

const compendiumItems: NavItem[] = [
  {
    title: 'Compendio',
    href: '/compendium',
    icon: Library,
    description: 'Biblioteca mágica principal',
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

// Combine all navigation items
const navigationItems: NavItem[] = [
  ...coreToolsItems,
  ...charactersAndWorldItems,
  ...storyAndContentItems,
  ...compendiumItems,
]

const adminItems: NavItem[] = [
  {
    title: 'Configuración',
    href: '/settings',
    icon: Settings,
    description: 'Configuración de la aplicación',
  },
  {
    title: 'Base de Datos',
    href: '/settings/database',
    icon: Database,
    description: 'Depuración y estado de la base de datos',
  },
]

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn('pb-4 w-64 h-full flex flex-col', className)}>
      <div className="px-3 py-4">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">
            Panel de Control DM
          </h2>
        </div>
      </div>

      {/* Main Navigation - Takes most of the space */}
      <div className="flex-1 px-3 overflow-y-auto">
        <h3 className="mb-3 px-2 text-sm font-semibold tracking-tight text-muted-foreground">
          Herramientas de Campaña
        </h3>

        {/* Core Tools */}
        <div className="space-y-1 mb-4">
          {coreToolsItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2 h-9 text-sm',
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

        {/* Characters & World */}
        <div className="space-y-1 mb-4">
          <div className="px-2 mb-2">
            <div className="h-px bg-border" />
          </div>
          {charactersAndWorldItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2 h-9 text-sm',
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

        {/* Story & Content */}
        <div className="space-y-1 mb-4">
          <div className="px-2 mb-2">
            <div className="h-px bg-border" />
          </div>
          {storyAndContentItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2 h-9 text-sm',
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

        {/* Compendium */}
        <div className="space-y-1">
          <div className="px-2 mb-2">
            <div className="h-px bg-border" />
          </div>
          {compendiumItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2 h-9 text-sm',
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

      {/* Admin Section - Fixed at bottom */}
      <div className="px-3 py-3 border-t">
        <h3 className="mb-2 px-2 text-sm font-semibold tracking-tight text-muted-foreground">
          Administración
        </h3>
        <div className="space-y-1">
          {adminItems.map(item => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href === '/settings/database' &&
                pathname.startsWith('/settings/database'))

            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-2 h-9 text-sm',
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
  )
}
