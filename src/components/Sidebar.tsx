'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Hash,
  Gamepad2,
  PenTool,
  Archive,
  Wrench,
  Grid,
  Gem,
  Coins,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string | undefined }>
  description?: string
  keywords?: string[]
  badge?: string
  isNew?: boolean
  children?: NavItem[] // Support for nested items
}

interface NavCategory {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string | undefined }>
  items: NavItem[]
  defaultExpanded?: boolean
  color?: string
}

// Enhanced navigation with organized categories
const navigationCategories: NavCategory[] = [
  {
    id: 'session',
    title: 'Herramientas de Sesión',
    icon: Gamepad2,
    defaultExpanded: true,
    color: 'text-blue-500',
    items: [
      {
        title: 'Tablero',
        href: '/',
        icon: Home,
        description: 'Panel principal del DM',
        keywords: ['dashboard', 'inicio', 'home', 'panel'],
      },
      {
        title: 'Sesión Activa',
        href: '/session',
        icon: Crown,
        description: 'Gestión de sesión actual',
        keywords: ['session', 'actual', 'live'],
        badge: 'Live',
      },
      {
        title: 'Combate',
        href: '/combat',
        icon: Sword,
        description: 'Iniciativa y rastreador de combate',
        keywords: ['combat', 'fight', 'battle', 'iniciativa'],
      },
      {
        title: 'Dados',
        href: '/dice',
        icon: Dice1,
        description: 'Utilidades de dados',
        keywords: ['dice', 'roll', 'random'],
      },
    ],
  },
  {
    id: 'world',
    title: 'Mundo y Personajes',
    icon: Users,
    defaultExpanded: true,
    color: 'text-green-500',
    items: [
      {
        title: 'Personajes',
        href: '/characters',
        icon: Users,
        description: 'Gestión de jugadores',
        keywords: ['characters', 'players', 'jugadores', 'pcs'],
      },
      {
        title: 'NPCs',
        href: '/npcs',
        icon: Users,
        description: 'Personajes no jugadores',
        keywords: ['npcs', 'non-player', 'characters'],
      },
      {
        title: 'Mapas y Ubicaciones',
        href: '/maps',
        icon: Map,
        description: 'Mapas del mundo y ubicaciones',
        keywords: ['maps', 'locations', 'places', 'world'],
      },
      {
        title: 'Grupos y Facciones',
        href: '/factions',
        icon: Building,
        description: 'Organizaciones, gremios y facciones',
        keywords: ['factions', 'groups', 'organizations', 'guilds'],
      },
    ],
  },
  {
    id: 'story',
    title: 'Historia y Contenido',
    icon: PenTool,
    defaultExpanded: false,
    color: 'text-purple-500',
    items: [
      {
        title: 'Calendario',
        href: '/calendar',
        icon: Calendar,
        description: 'Sistema de calendario personalizado',
        keywords: ['calendar', 'time', 'dates', 'events'],
        isNew: true,
      },
      {
        title: 'Misiones',
        href: '/quests',
        icon: Target,
        description: 'Sistema de misiones y objetivos',
        keywords: ['quests', 'missions', 'objectives', 'goals'],
      },
      {
        title: 'Lore y Tradiciones',
        href: '/lore',
        icon: Scroll,
        description: 'Historia, leyendas y conocimiento del mundo',
        keywords: ['lore', 'history', 'legends', 'knowledge'],
      },
      {
        title: 'Notas de Campaña',
        href: '/notes',
        icon: BookOpen,
        description: 'Notas de historia y lore',
        keywords: ['notes', 'campaign', 'story'],
      },
    ],
  },
  {
    id: 'compendium',
    title: 'Compendio',
    icon: Library,
    defaultExpanded: false,
    color: 'text-amber-500',
    items: [
      {
        title: 'Biblioteca Principal',
        href: '/compendium',
        icon: Library,
        description: 'Biblioteca mágica principal',
        keywords: ['compendium', 'library', 'reference'],
      },
      {
        title: 'Canciones',
        href: '/compendium/songs',
        icon: Zap,
        description: 'Biblioteca de canciones',
        keywords: ['songs', 'music', 'canciones', 'musical'],
        children: [
          {
            title: 'Escuelas',
            href: '/compendium/songs/taxonomies/SongSchool',
            icon: Star,
            description: 'Gestionar escuelas de canción',
            keywords: ['schools', 'magic', 'schools'],
          },
          {
            title: 'Instrumentos',
            href: '/compendium/songs/taxonomies/InstrumentType',
            icon: Package,
            description: 'Gestionar tipos de instrumento',
            keywords: ['instrument', 'music'],
          },
          {
            title: 'Géneros',
            href: '/compendium/songs/taxonomies/MusicGenre',
            icon: Star,
            description: 'Gestionar géneros musicales',
            keywords: ['genre', 'style'],
          },
          {
            title: 'Componentes',
            href: '/compendium/songs/taxonomies/SongComponent',
            icon: Grid,
            description: 'Gestionar componentes de canción',
            keywords: ['components', 'requirements'],
          },
          {
            title: 'Calidades',
            href: '/compendium/songs/taxonomies/PerformanceQuality',
            icon: Star,
            description: 'Gestionar calidades de interpretación',
            keywords: ['quality', 'performance'],
          },
          {
            title: 'Alcances',
            href: '/compendium/songs/taxonomies/SongRange',
            icon: Target,
            description: 'Gestionar alcances de canción',
            keywords: ['range', 'distance'],
          },
          {
            title: 'Duraciones',
            href: '/compendium/songs/taxonomies/SongDuration',
            icon: Clock,
            description: 'Gestionar duraciones de canción',
            keywords: ['duration', 'time'],
          },
          {
            title: 'Propiedades',
            href: '/compendium/songs/taxonomies/SongProperty',
            icon: Sparkles,
            description: 'Gestionar propiedades de canción',
            keywords: ['properties', 'special'],
          },
        ],
      },
      {
        title: 'Objetos',
        href: '/compendium/items',
        icon: Package,
        description: 'Equipo y objetos mágicos',
        keywords: ['items', 'equipment', 'gear', 'magic items'],
        children: [
          {
            title: 'Tipos',
            href: '/compendium/items/taxonomies/ItemType',
            icon: Package,
            description: 'Gestionar tipos de objetos',
            keywords: ['types', 'categories'],
          },
          {
            title: 'Rarezas',
            href: '/compendium/items/taxonomies/ItemRarity',
            icon: Star,
            description: 'Gestionar rarezas de objetos',
            keywords: ['rarity', 'quality'],
          },
          {
            title: 'Tipos de Daño',
            href: '/compendium/items/taxonomies/DamageType',
            icon: Zap,
            description: 'Gestionar tipos de daño',
            keywords: ['damage', 'combat'],
          },
          {
            title: 'Ranuras de Equipo',
            href: '/compendium/items/taxonomies/EquipmentSlot',
            icon: Grid,
            description: 'Gestionar ranuras de equipamiento',
            keywords: ['slots', 'equipment'],
          },
          {
            title: 'Materiales Especiales',
            href: '/compendium/items/taxonomies/SpecialMaterial',
            icon: Gem,
            description: 'Gestionar materiales especiales',
            keywords: ['materials', 'special'],
          },
          {
            title: 'Monedas',
            href: '/compendium/items/taxonomies/Currency',
            icon: Coins,
            description: 'Gestionar tipos de moneda',
            keywords: ['currency', 'money', 'gold'],
          },
          {
            title: 'Tipos de Arma',
            href: '/compendium/items/taxonomies/WeaponType',
            icon: Sword,
            description: 'Gestionar tipos de armas',
            keywords: ['weapon', 'arms'],
          },
          {
            title: 'Tipos de Armadura',
            href: '/compendium/items/taxonomies/ArmorType',
            icon: Shield,
            description: 'Gestionar tipos de armadura',
            keywords: ['armor', 'protection'],
          },
          {
            title: 'Tipos de Resistencia',
            href: '/compendium/items/taxonomies/ResistanceType',
            icon: ShieldCheck,
            description: 'Gestionar tipos de resistencia',
            keywords: ['resistance', 'immunity'],
          },
        ],
      },
    ],
  },
  {
    id: 'admin',
    title: 'Administración',
    icon: Wrench,
    defaultExpanded: false,
    color: 'text-red-500',
    items: [
      {
        title: 'Configuración',
        href: '/settings',
        icon: Settings,
        description: 'Configuración de la aplicación',
        keywords: ['settings', 'config', 'preferences'],
      },
      {
        title: 'Base de Datos',
        href: '/settings/database',
        icon: Database,
        description: 'Depuración y estado de la base de datos',
        keywords: ['database', 'debug', 'data'],
      },
    ],
  },
]

// Flatten all items for search (including nested children)
const allNavigationItems: NavItem[] = navigationCategories.flatMap(category => {
  const flattenItem = (item: NavItem): NavItem[] => {
    if (!item.children) return [item]
    return [item, ...item.children.flatMap(flattenItem)]
  }
  return category.items.flatMap(flattenItem)
})

interface SidebarProps {
  className?: string
}

interface CollapsibleCategoryProps {
  category: NavCategory
  pathname: string
  isExpanded: boolean
  onToggle: () => void
  searchQuery: string
}

interface NavItemProps {
  item: NavItem
  pathname: string
  depth?: number
}

function NavItemWithChildren({ item, pathname, depth = 0 }: NavItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = item.icon
  const hasChildren = item.children && item.children.length > 0

  const isActive =
    pathname === item.href ||
    (hasChildren && item.children?.some(child => pathname === child.href))

  if (!hasChildren) {
    return (
      <Button
        key={item.href}
        variant={pathname === item.href ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start gap-2 h-8 text-sm',
          depth === 0 ? 'pl-4' : 'pl-8',
          pathname === item.href && 'bg-secondary'
        )}
        asChild
      >
        <Link href={item.href}>
          <Icon className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="h-4 text-xs px-1.5">
              {item.badge}
            </Badge>
          )}
          {item.isNew && (
            <Badge
              variant="default"
              className="h-4 text-xs px-1.5 bg-green-500"
            >
              New
            </Badge>
          )}
        </Link>
      </Button>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        <Button
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          className={cn(
            'flex-1 justify-start gap-2 h-8 text-sm',
            depth === 0 ? 'pl-4' : 'pl-8',
            pathname === item.href && 'bg-secondary'
          )}
          asChild
        >
          <Link href={item.href}>
            <Icon className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="h-4 text-xs px-1.5">
                {item.badge}
              </Badge>
            )}
            {item.isNew && (
              <Badge
                variant="default"
                className="h-4 text-xs px-1.5 bg-green-500"
              >
                New
              </Badge>
            )}
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-secondary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
      </div>
      {isExpanded && item.children && (
        <div className="mt-1 space-y-1">
          {/* Show parent link first */}
          <Button
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start gap-2 h-8 text-sm',
              depth === 0 ? 'pl-8' : 'pl-12',
              pathname === item.href && 'bg-secondary'
            )}
            asChild
          >
            <Link href={item.href}>
              <Icon className="h-3.5 w-3.5" />
              <span className="flex-1 text-left">Ver todos</span>
            </Link>
          </Button>
          {/* Then show children */}
          {item.children.map(child => (
            <NavItemWithChildren
              key={child.href}
              item={child}
              pathname={pathname}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CollapsibleCategory({
  category,
  pathname,
  isExpanded,
  onToggle,
  searchQuery,
}: CollapsibleCategoryProps) {
  const CategoryIcon = category.icon
  const hasActiveItem = category.items.some(
    item =>
      pathname === item.href ||
      (item.href === '/settings/database' &&
        pathname.startsWith('/settings/database')) ||
      (item.children && item.children.some(child => pathname === child.href))
  )

  const filteredItems = useMemo(() => {
    if (!searchQuery) return category.items

    return category.items.filter(item => {
      const searchLower = searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.keywords?.some(keyword =>
          keyword.toLowerCase().includes(searchLower)
        )
      )
    })
  }, [category.items, searchQuery])

  if (searchQuery && filteredItems.length === 0) {
    return null
  }

  return (
    <div className="mb-3">
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start gap-2 h-8 px-2 text-sm font-medium',
          hasActiveItem && 'text-primary',
          category.color
        )}
        onClick={onToggle}
      >
        <CategoryIcon className="h-4 w-4" />
        <span className="flex-1 text-left">{category.title}</span>
        {!searchQuery &&
          (isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          ))}
      </Button>

      {(isExpanded || searchQuery) && (
        <div className="mt-1 space-y-1 ml-1">
          {filteredItems.map(item => (
            <NavItemWithChildren
              key={item.href}
              item={item}
              pathname={pathname}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(
      navigationCategories.filter(cat => cat.defaultExpanded).map(cat => cat.id)
    )
  )
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [recentItems, setRecentItems] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return navigationCategories

    return navigationCategories.filter(category => {
      const hasMatchingItems = category.items.some(item => {
        const searchLower = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.keywords?.some(keyword =>
            keyword.toLowerCase().includes(searchLower)
          )
        )
      })

      return (
        hasMatchingItems ||
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [searchQuery])

  const quickAccessItems = useMemo(() => {
    const favoriteItems = allNavigationItems.filter(item =>
      favorites.has(item.href)
    )
    const recentNavItems = recentItems
      .map(href => allNavigationItems.find(item => item.href === href))
      .filter(Boolean) as NavItem[]

    return { favorites: favoriteItems, recent: recentNavItems }
  }, [favorites, recentItems])

  return (
    <div
      className={cn(
        'pb-4 w-64 h-full flex flex-col bg-background border-r',
        className
      )}
    >
      {/* Header */}
      <div className="px-3 py-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">
            Panel de Control DM
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar herramientas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Quick Access */}
      {!searchQuery &&
        (quickAccessItems.favorites.length > 0 ||
          quickAccessItems.recent.length > 0) && (
          <div className="px-3 py-3 border-b">
            {quickAccessItems.favorites.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Favoritos
                  </span>
                </div>
                <div className="space-y-1">
                  {quickAccessItems.favorites.slice(0, 3).map(item => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Button
                        key={item.href}
                        variant={isActive ? 'secondary' : 'ghost'}
                        size="sm"
                        className="w-full justify-start gap-2 h-7 text-xs"
                        asChild
                      >
                        <Link href={item.href}>
                          <Icon className="h-3 w-3" />
                          {item.title}
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}

            {quickAccessItems.recent.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Recientes
                  </span>
                </div>
                <div className="space-y-1">
                  {quickAccessItems.recent.slice(0, 3).map(item => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Button
                        key={item.href}
                        variant={isActive ? 'secondary' : 'ghost'}
                        size="sm"
                        className="w-full justify-start gap-2 h-7 text-xs"
                        asChild
                      >
                        <Link href={item.href}>
                          <Icon className="h-3 w-3" />
                          {item.title}
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-3 overflow-y-auto">
        {searchQuery && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Resultados para &quot;{searchQuery}&quot;
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {filteredCategories.map(category => (
            <CollapsibleCategory
              key={category.id}
              category={category}
              pathname={pathname}
              isExpanded={expandedCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
              searchQuery={searchQuery}
            />
          ))}
        </div>

        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No se encontraron resultados para &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-2 border-t">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{allNavigationItems.length} herramientas</span>
          <div className="flex items-center gap-1">
            <Archive className="h-3 w-3" />
            <span>v1.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
