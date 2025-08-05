'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ChevronDown,
  ChevronRight,
  MapPin,
  Globe,
  Mountain,
  Building,
  Plus,
  Edit,
  Trash2,
  Users,
  Shield,
  Eye,
  MoreHorizontal,
  Search,
  Map,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useSessionStore } from '@/stores/sessionStore'
import type { AnyLocation, LocationType } from '@/types/location'
import {
  getLocationTypeLabel,
  canHaveChildren,
  getValidChildTypes,
  DANGER_LEVELS,
} from '@/types/location'

// Search utility functions
const matchesSearch = (location: AnyLocation, searchTerm: string): boolean => {
  const term = searchTerm.toLowerCase()

  // Search in basic fields
  if (
    location.name.toLowerCase().includes(term) ||
    location.description.toLowerCase().includes(term)
  ) {
    return true
  }

  // Search in type-specific fields
  if ('ruler' in location && location.ruler?.toLowerCase().includes(term)) {
    return true
  }

  if (
    'government' in location &&
    location.government?.toLowerCase().includes(term)
  ) {
    return true
  }

  if ('keyNPCs' in location && location.keyNPCs) {
    return location.keyNPCs.some(
      npc =>
        npc.name.toLowerCase().includes(term) ||
        npc.role.toLowerCase().includes(term)
    )
  }

  // Search in tags
  if (location.tags.some(tag => tag.toLowerCase().includes(term))) {
    return true
  }

  return false
}

const hasSearchMatchInDescendants = (
  locationId: string,
  searchTerm: string,
  allLocations: AnyLocation[]
): boolean => {
  const children = allLocations.filter(loc => loc.parentId === locationId)

  for (const child of children) {
    if (matchesSearch(child, searchTerm)) {
      return true
    }

    // Recursively check descendants
    if (hasSearchMatchInDescendants(child.id, searchTerm, allLocations)) {
      return true
    }
  }

  return false
}

const getAllDescendantIds = (
  locationId: string,
  allLocations: AnyLocation[]
): string[] => {
  const descendants: string[] = []
  const children = allLocations.filter(loc => loc.parentId === locationId)

  for (const child of children) {
    descendants.push(child.id)
    descendants.push(...getAllDescendantIds(child.id, allLocations))
  }

  return descendants
}

// Simplified card component for search results (no hierarchy, no children)
interface SearchResultCardProps {
  location: AnyLocation
  onEditLocation: (location: AnyLocation) => void
  onAddLocation: (parentId: string | undefined, type: LocationType) => void
  onDeleteLocation: (location: AnyLocation) => void
  searchTerm: string
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  location,
  onEditLocation,
  onAddLocation,
  onDeleteLocation,
  searchTerm,
}) => {
  const router = useRouter()
  const { locations: allLocations, getMapsByLocation } = useSessionStore()
  const getLocationById = (id: string) =>
    allLocations.find(loc => loc.id === id)
  const canAddChildren = canHaveChildren(location.type)
  const validChildTypes = getValidChildTypes(location.type)

  // Get parent information for context
  const parentLocation = location.parentId
    ? getLocationById(location.parentId)
    : null
  const getLocationPath = (loc: AnyLocation): string => {
    if (!loc.parentId) return loc.name
    const parent = getLocationById(loc.parentId)
    return parent ? `${getLocationPath(parent)} > ${loc.name}` : loc.name
  }

  const getDangerInfo = () => {
    if (location.type === 'region' && 'dangerLevel' in location) {
      const dangerInfo = DANGER_LEVELS.find(
        d => d.value === location.dangerLevel
      )
      return dangerInfo
    }
    return null
  }

  const getPopulation = () => {
    if ('population' in location && location.population) {
      return location.population
    }
    return null
  }

  const getGovernment = () => {
    if ('government' in location && location.government) {
      return location.government
    }
    return null
  }

  const getRuler = () => {
    if ('ruler' in location && location.ruler) {
      return location.ruler
    }
    return null
  }

  const getKeyNPCs = () => {
    if ('keyNPCs' in location && location.keyNPCs) {
      return location.keyNPCs
    }
    return []
  }

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-lg bg-gradient-to-br cursor-pointer',
        getLocationGradient(location.type)
      )}
      onClick={() => router.push(`/maps/${location.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Location Icon and Title */}
            <div className="flex items-start gap-3 flex-1">
              <div
                className={cn(
                  'p-2 rounded-lg bg-white/50 dark:bg-gray-800/50',
                  getLocationIconColor(location.type)
                )}
              >
                {getLocationIcon(location.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <CardTitle className="text-xl font-bold truncate">
                    {location.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {getLocationTypeLabel(location.type)}
                  </Badge>
                </div>

                {/* Location Path */}
                {parentLocation && (
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">
                      {getLocationPath(location)}
                    </span>
                  </div>
                )}

                {/* Quick Info Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {getPopulation() && (
                    <Badge
                      variant="outline"
                      className="text-xs flex items-center gap-1"
                    >
                      <Users className="h-3 w-3" />
                      {getPopulation()?.toLocaleString()} hab.
                    </Badge>
                  )}

                  {getDangerInfo() && (
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs flex items-center gap-1',
                        getDangerInfo()?.color
                      )}
                    >
                      <Shield className="h-3 w-3" />
                      Peligro {getDangerInfo()?.value}
                    </Badge>
                  )}

                  {getGovernment() && (
                    <Badge variant="outline" className="text-xs">
                      {getGovernment()}
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {location.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={e => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={e => {
                  e.stopPropagation()
                  onEditLocation(location)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>

              {location.type === 'location' && (
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation()
                    const existingMaps = getMapsByLocation(location.id)
                    if (existingMaps.length > 0 && existingMaps[0]) {
                      router.push(
                        `/maps/editor?location=${location.id}&map=${existingMaps[0].id}`
                      )
                    } else {
                      router.push(`/maps/editor?location=${location.id}`)
                    }
                  }}
                >
                  <Map className="h-4 w-4 mr-2" />
                  {getMapsByLocation(location.id).length > 0
                    ? 'Editar Mapa'
                    : 'Crear Mapa'}
                </DropdownMenuItem>
              )}

              {canAddChildren &&
                validChildTypes.map(childType => (
                  <DropdownMenuItem
                    key={childType}
                    onClick={e => {
                      e.stopPropagation()
                      onAddLocation(location.id, childType)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir {getLocationTypeLabel(childType)}
                  </DropdownMenuItem>
                ))}

              <Separator />
              <DropdownMenuItem
                onClick={e => {
                  e.stopPropagation()
                  onDeleteLocation(location)
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Additional Details */}
      {(getRuler() || getKeyNPCs().length > 0) && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {getRuler() && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-muted-foreground">
                  Gobernante:
                </span>
                <span>{getRuler()}</span>
              </div>
            )}

            {getKeyNPCs().length > 0 && (
              <div>
                <span className="font-medium text-muted-foreground text-sm">
                  NPCs Clave:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {getKeyNPCs()
                    .slice(0, 3)
                    .map((npc, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {npc.name} ({npc.role})
                      </Badge>
                    ))}
                  {getKeyNPCs().length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{getKeyNPCs().length - 3} más
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

interface LocationHierarchyViewProps {
  onEditLocation: (location: AnyLocation) => void
  onAddLocation: (parentId: string | undefined, type: LocationType) => void
  onDeleteLocation: (location: AnyLocation) => void
  searchTerm?: string
}

const getLocationIcon = (type: LocationType, className = 'h-5 w-5') => {
  switch (type) {
    case 'plane':
      return <Globe className={className} />
    case 'continent':
      return <Mountain className={className} />
    case 'region':
      return <MapPin className={className} />
    case 'location':
      return <Building className={className} />
    default:
      return <MapPin className={className} />
  }
}

const getLocationGradient = (type: LocationType) => {
  switch (type) {
    case 'plane':
      return 'from-purple-500/10 to-indigo-500/10 border-purple-200 dark:border-purple-800'
    case 'continent':
      return 'from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800'
    case 'region':
      return 'from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800'
    case 'location':
      return 'from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-800'
    default:
      return 'from-gray-500/10 to-slate-500/10 border-gray-200 dark:border-gray-800'
  }
}

const getLocationIconColor = (type: LocationType) => {
  switch (type) {
    case 'plane':
      return 'text-purple-600 dark:text-purple-400'
    case 'continent':
      return 'text-blue-600 dark:text-blue-400'
    case 'region':
      return 'text-green-600 dark:text-green-400'
    case 'location':
      return 'text-amber-600 dark:text-amber-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

interface LocationCardProps extends LocationHierarchyViewProps {
  location: AnyLocation
  level: number
  isExpanded: boolean
  onToggleExpand: (locationId: string, forceClose?: boolean) => void
  expandedNodes: Set<string>
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  level,
  isExpanded,
  onToggleExpand,
  onEditLocation,
  onAddLocation,
  onDeleteLocation,
  searchTerm = '',
  expandedNodes,
}) => {
  const router = useRouter()
  const {
    getLocationChildren,
    locations: allLocations,
    getMapsByLocation,
  } = useSessionStore()
  const children = getLocationChildren(location.id)
  const hasChildren = children.length > 0
  const canAddChildren = canHaveChildren(location.type)
  const validChildTypes = getValidChildTypes(location.type)

  // Filter children based on search term
  const filteredChildren = searchTerm
    ? children.filter(child => matchesSearch(child, searchTerm))
    : children

  const hasFilteredChildren = filteredChildren.length > 0

  const handleToggleExpand = () => {
    if (hasChildren) {
      onToggleExpand(location.id, isExpanded) // Pass current state to determine if we're closing
    }
  }

  // Check if location matches search criteria
  const matchesCurrentSearch =
    !searchTerm || matchesSearch(location, searchTerm)

  // Check if any descendant matches search (for auto-expanding parents)
  const hasMatchingDescendants = searchTerm
    ? hasSearchMatchInDescendants(location.id, searchTerm, allLocations)
    : false

  // Don't render if doesn't match search and has no matching descendants
  if (searchTerm && !matchesCurrentSearch && !hasMatchingDescendants) {
    return null
  }

  const getDangerInfo = () => {
    if (location.type === 'region' && 'dangerLevel' in location) {
      const dangerInfo = DANGER_LEVELS.find(
        d => d.value === location.dangerLevel
      )
      return dangerInfo
    }
    return null
  }

  const getPopulation = () => {
    if ('population' in location && location.population) {
      return location.population
    }
    return null
  }

  const getGovernment = () => {
    if ('government' in location && location.government) {
      return location.government
    }
    return null
  }

  const getRuler = () => {
    if ('ruler' in location && location.ruler) {
      return location.ruler
    }
    return null
  }

  const getKeyNPCs = () => {
    if ('keyNPCs' in location && location.keyNPCs) {
      return location.keyNPCs
    }
    return []
  }

  return (
    <div className={cn('space-y-4', level > 0 && 'ml-8')}>
      <Card
        className={cn(
          'transition-all duration-200 hover:shadow-lg bg-gradient-to-br cursor-pointer',
          getLocationGradient(location.type),
          level === 0 && 'shadow-md'
        )}
        onClick={() => router.push(`/maps/${location.id}`)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {/* Expand/Collapse Button */}
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 mt-1"
                  onClick={e => {
                    e.stopPropagation()
                    handleToggleExpand()
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* Location Icon and Title */}
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={cn(
                    'p-2 rounded-lg bg-white/50 dark:bg-gray-800/50',
                    getLocationIconColor(location.type)
                  )}
                >
                  {getLocationIcon(location.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <CardTitle className="text-xl font-bold truncate">
                      {location.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {getLocationTypeLabel(location.type)}
                    </Badge>
                    {hasChildren && (
                      <Badge variant="outline" className="text-xs">
                        {children.length} ubicación
                        {children.length !== 1 ? 'es' : ''}
                      </Badge>
                    )}
                  </div>

                  {/* Quick Info Badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {getPopulation() && (
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                      >
                        <Users className="h-3 w-3" />
                        {getPopulation()?.toLocaleString()} hab.
                      </Badge>
                    )}

                    {getDangerInfo() && (
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs flex items-center gap-1',
                          getDangerInfo()?.color
                        )}
                      >
                        <Shield className="h-3 w-3" />
                        Peligro {getDangerInfo()?.value}
                      </Badge>
                    )}

                    {getGovernment() && (
                      <Badge variant="outline" className="text-xs">
                        {getGovernment()}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {location.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={e => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation()
                    onEditLocation(location)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>

                {location.type === 'location' && (
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation()
                      const existingMaps = getMapsByLocation(location.id)
                      if (existingMaps.length > 0 && existingMaps[0]) {
                        router.push(
                          `/maps/editor?location=${location.id}&map=${existingMaps[0].id}`
                        )
                      } else {
                        router.push(`/maps/editor?location=${location.id}`)
                      }
                    }}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    {getMapsByLocation(location.id).length > 0
                      ? 'Editar Mapa'
                      : 'Crear Mapa'}
                  </DropdownMenuItem>
                )}

                {canAddChildren &&
                  validChildTypes.map(childType => (
                    <DropdownMenuItem
                      key={childType}
                      onClick={e => {
                        e.stopPropagation()
                        onAddLocation(location.id, childType)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir {getLocationTypeLabel(childType)}
                    </DropdownMenuItem>
                  ))}

                <Separator />
                <DropdownMenuItem
                  onClick={e => {
                    e.stopPropagation()
                    onDeleteLocation(location)
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {/* Additional Details (expandable for locations with rich data) */}
        {(getRuler() || getKeyNPCs().length > 0) && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              {getRuler() && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">
                    Gobernante:
                  </span>
                  <span>{getRuler()}</span>
                </div>
              )}

              {getKeyNPCs().length > 0 && (
                <div>
                  <span className="font-medium text-muted-foreground text-sm">
                    NPCs Clave:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getKeyNPCs()
                      .slice(0, 3)
                      .map((npc, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {npc.name} ({npc.role})
                        </Badge>
                      ))}
                    {getKeyNPCs().length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{getKeyNPCs().length - 3} más
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="space-y-4 border-l-2 border-dashed border-muted pl-4">
          {(searchTerm ? filteredChildren : children).map(child => {
            // Auto-expand children with matching descendants when searching
            const shouldAutoExpand = searchTerm
              ? hasSearchMatchInDescendants(child.id, searchTerm, allLocations)
              : false
            const childIsExpanded =
              expandedNodes.has(child.id) || shouldAutoExpand

            return (
              <LocationCard
                key={child.id}
                location={child}
                level={level + 1}
                isExpanded={childIsExpanded}
                onToggleExpand={onToggleExpand}
                onEditLocation={onEditLocation}
                onAddLocation={onAddLocation}
                onDeleteLocation={onDeleteLocation}
                searchTerm={searchTerm}
                expandedNodes={expandedNodes}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export const LocationHierarchyView: React.FC<LocationHierarchyViewProps> = ({
  onEditLocation,
  onAddLocation,
  onDeleteLocation,
  searchTerm = '',
}) => {
  const { locations } = useSessionStore()
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const rootLocations = locations.filter(loc => !loc.parentId)

  // When searching, show flat results instead of hierarchy
  const searchResults = searchTerm
    ? locations.filter(location => matchesSearch(location, searchTerm))
    : []

  const handleToggleExpand = (locationId: string, forceClose?: boolean) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      const isCurrentlyExpanded = newSet.has(locationId)

      if (forceClose || isCurrentlyExpanded) {
        // Closing - remove this node and all its descendants
        newSet.delete(locationId)
        const descendantIds = getAllDescendantIds(locationId, locations)
        descendantIds.forEach(id => newSet.delete(id))
      } else {
        // Opening - add this node
        newSet.add(locationId)

        // If we have a search term, also expand parents of matching descendants
        if (
          searchTerm &&
          hasSearchMatchInDescendants(locationId, searchTerm, locations)
        ) {
          const expandMatchingDescendants = (parentId: string) => {
            const children = locations.filter(loc => loc.parentId === parentId)
            children.forEach(child => {
              if (
                matchesSearch(child, searchTerm) ||
                hasSearchMatchInDescendants(child.id, searchTerm, locations)
              ) {
                newSet.add(child.id)
                expandMatchingDescendants(child.id)
              }
            })
          }
          expandMatchingDescendants(locationId)
        }
      }

      return newSet
    })
  }

  const handleExpandAll = () => {
    const allIds = new Set(locations.map(loc => loc.id))
    setExpandedNodes(allIds)
  }

  const handleCollapseAll = () => {
    setExpandedNodes(new Set())
  }

  // Render search results as flat list
  if (searchTerm && searchResults.length > 0) {
    return (
      <div className="space-y-6">
        {/* Search Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {searchResults.length} resultado
              {searchResults.length !== 1 ? 's' : ''} de búsqueda
            </Badge>
            <Badge variant="secondary" className="text-sm">
              &ldquo;{searchTerm}&rdquo;
            </Badge>
          </div>
        </div>

        {/* Flat Search Results */}
        <ScrollArea className="h-[800px]">
          <div className="grid gap-4 pr-4">
            {searchResults.map(location => (
              <SearchResultCard
                key={location.id}
                location={location}
                onEditLocation={onEditLocation}
                onAddLocation={onAddLocation}
                onDeleteLocation={onDeleteLocation}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Show empty search state
  if (searchTerm && searchResults.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="text-sm">
            0 resultados para &ldquo;{searchTerm}&rdquo;
          </Badge>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/30 rounded-full flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              No se encontraron ubicaciones
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              No hay ubicaciones que coincidan con tu búsqueda. Intenta con
              otros términos.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (rootLocations.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mb-6">
            <Globe className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-3">
            No hay ubicaciones creadas
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Comienza creando un plano de existencia para organizar tu mundo de
            campaña. Puedes usar la plantilla de ejemplo para empezar
            rápidamente.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => onAddLocation(undefined, 'plane')}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Plano
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {locations.length} ubicaciones totales
          </Badge>
          <Badge variant="outline" className="text-sm">
            {rootLocations.length} plano{rootLocations.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExpandAll}>
            <Eye className="h-4 w-4 mr-2" />
            Expandir Todo
          </Button>
          <Button variant="outline" size="sm" onClick={handleCollapseAll}>
            <ChevronRight className="h-4 w-4 mr-2" />
            Colapsar Todo
          </Button>
        </div>
      </div>

      {/* Location Hierarchy */}
      <ScrollArea className="h-[800px]">
        <div className="space-y-6 pr-4">
          {rootLocations.map(location => (
            <LocationCard
              key={location.id}
              location={location}
              level={0}
              isExpanded={expandedNodes.has(location.id)}
              onToggleExpand={handleToggleExpand}
              onEditLocation={onEditLocation}
              onAddLocation={onAddLocation}
              onDeleteLocation={onDeleteLocation}
              searchTerm={''}
              expandedNodes={expandedNodes}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default LocationHierarchyView
