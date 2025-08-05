'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSessionStore } from '@/stores/sessionStore'
import type { AnyLocation, LocationType } from '@/types/location'
import {
  getLocationTypeLabel,
  canHaveChildren,
  getValidChildTypes,
  DANGER_LEVELS,
} from '@/types/location'

interface LocationTreeViewProps {
  onEditLocation: (location: AnyLocation) => void
  onAddLocation: (parentId: string | undefined, type: LocationType) => void
  onDeleteLocation: (location: AnyLocation) => void
}

interface LocationNodeProps extends LocationTreeViewProps {
  location: AnyLocation
  level: number
  isExpanded: boolean
  onToggleExpand: (locationId: string) => void
}

const getLocationIcon = (type: LocationType) => {
  switch (type) {
    case 'plane':
      return <Globe className="h-4 w-4" />
    case 'continent':
      return <Mountain className="h-4 w-4" />
    case 'region':
      return <MapPin className="h-4 w-4" />
    case 'location':
      return <Building className="h-4 w-4" />
    default:
      return <MapPin className="h-4 w-4" />
  }
}

const getLocationColor = (type: LocationType) => {
  switch (type) {
    case 'plane':
      return 'bg-purple-100 text-purple-800'
    case 'continent':
      return 'bg-blue-100 text-blue-800'
    case 'region':
      return 'bg-green-100 text-green-800'
    case 'location':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const LocationNode: React.FC<LocationNodeProps> = ({
  location,
  level,
  isExpanded,
  onToggleExpand,
  onEditLocation,
  onAddLocation,
  onDeleteLocation,
}) => {
  const router = useRouter()
  const { getLocationChildren } = useSessionStore()
  const children = getLocationChildren(location.id)
  const hasChildren = children.length > 0
  const canAddChildren = canHaveChildren(location.type)
  const validChildTypes = getValidChildTypes(location.type)

  const handleToggleExpand = () => {
    if (hasChildren) {
      onToggleExpand(location.id)
    }
  }

  const getDangerBadge = () => {
    if (location.type === 'region' && 'dangerLevel' in location) {
      const dangerInfo = DANGER_LEVELS.find(
        d => d.value === location.dangerLevel
      )
      if (dangerInfo) {
        return (
          <Badge variant="outline" className={cn('text-xs', dangerInfo.color)}>
            Peligro {dangerInfo.value}
          </Badge>
        )
      }
    }
    return null
  }

  const getPopulationBadge = () => {
    if (
      ('population' in location && location.population) ||
      (location.type === 'region' &&
        'population' in location &&
        location.population)
    ) {
      return (
        <Badge variant="outline" className="text-xs">
          {location.population?.toLocaleString()} hab.
        </Badge>
      )
    }
    return null
  }

  return (
    <div className="select-none">
      <div
        className={cn(
          'group flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer',
          `ml-${level * 4}`
        )}
        style={{ marginLeft: `${level * 16}px` }}
        onClick={() => router.push(`/maps/${location.id}`)}
      >
        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={e => {
            e.stopPropagation()
            handleToggleExpand()
          }}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )
          ) : (
            <div className="h-3 w-3" />
          )}
        </Button>

        {/* Location Icon */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {getLocationIcon(location.type)}

          {/* Location Name and Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium truncate">{location.name}</span>
              <Badge
                variant="outline"
                className={cn('text-xs', getLocationColor(location.type))}
              >
                {getLocationTypeLabel(location.type)}
              </Badge>
              {getDangerBadge()}
              {getPopulationBadge()}
            </div>
            {location.description && (
              <p className="text-sm text-muted-foreground truncate mt-1">
                {location.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
          onClick={e => e.stopPropagation()}
        >
          {canAddChildren &&
            validChildTypes.map(childType => (
              <Button
                key={childType}
                variant="outline"
                size="sm"
                className="h-7 px-2"
                onClick={e => {
                  e.stopPropagation()
                  onAddLocation(location.id, childType)
                }}
                title={`Agregar ${getLocationTypeLabel(childType)}`}
              >
                <Plus className="h-3 w-3 mr-1" />
                {getLocationTypeLabel(childType)}
              </Button>
            ))}

          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={e => {
              e.stopPropagation()
              onEditLocation(location)
            }}
            title="Editar"
          >
            <Edit className="h-3 w-3" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={e => {
              e.stopPropagation()
              onDeleteLocation(location)
            }}
            title="Eliminar"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="space-y-1">
          {children.map(child => (
            <LocationNode
              key={child.id}
              location={child}
              level={level + 1}
              isExpanded={isExpanded}
              onToggleExpand={onToggleExpand}
              onEditLocation={onEditLocation}
              onAddLocation={onAddLocation}
              onDeleteLocation={onDeleteLocation}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const LocationTreeView: React.FC<LocationTreeViewProps> = ({
  onEditLocation,
  onAddLocation,
  onDeleteLocation,
}) => {
  const { getLocationsByType, locations } = useSessionStore()
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const planes = getLocationsByType('plane')
  const rootLocations = locations.filter(loc => !loc.parentId)

  const handleToggleExpand = (locationId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(locationId)) {
        newSet.delete(locationId)
      } else {
        newSet.add(locationId)
      }
      return newSet
    })
  }

  if (rootLocations.length === 0) {
    return (
      <div className="text-center py-8">
        <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No hay ubicaciones creadas</h3>
        <p className="text-muted-foreground mb-4">
          Comienza creando un plano de existencia para organizar tu mundo.
        </p>
        <Button onClick={() => onAddLocation(undefined, 'plane')}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Primer Plano
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {rootLocations.map(location => (
        <LocationNode
          key={location.id}
          location={location}
          level={0}
          isExpanded={expandedNodes.has(location.id)}
          onToggleExpand={handleToggleExpand}
          onEditLocation={onEditLocation}
          onAddLocation={onAddLocation}
          onDeleteLocation={onDeleteLocation}
        />
      ))}
    </div>
  )
}

export default LocationTreeView
