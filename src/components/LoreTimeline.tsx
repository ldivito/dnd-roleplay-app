'use client'

import React, { useState } from 'react'
import {
  Clock,
  Calendar,
  Scroll,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useSessionStore } from '@/stores/sessionStore'
import type { Lore, Era } from '@/types/lore'
import {
  getLoreTypeInfo,
  getLoreImportanceInfo,
  groupLoreByEra,
  sortLoreByTimeline,
  DEFAULT_ERAS,
} from '@/types/lore'

interface LoreTimelineProps {
  onEditLore?: (lore: Lore) => void
  onAddLore?: (parentLore?: Lore) => void
  onDeleteLore?: (lore: Lore) => void
  showOnlyMainTimeline?: boolean
  selectedYear?: number
}

interface LoreCardProps {
  lore: Lore
  onEdit?: (lore: Lore) => void
  onDelete?: (lore: Lore) => void
  onAddRelated?: (parentLore: Lore) => void
}

const LoreCard: React.FC<LoreCardProps> = ({
  lore,
  onEdit,
  onDelete,
  onAddRelated,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const typeInfo = getLoreTypeInfo(lore.type)
  const importanceInfo = getLoreImportanceInfo(lore.importance)

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        lore.isMainTimeline && 'border-l-4 border-l-primary',
        !lore.isPublic && 'bg-muted/30'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <CardTitle className="text-lg truncate">{lore.title}</CardTitle>
              {!lore.isPublic && (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {typeInfo && (
                <Badge variant="outline" className="text-xs">
                  {typeInfo.label}
                </Badge>
              )}

              {importanceInfo && (
                <Badge
                  variant="outline"
                  className={cn('text-xs', importanceInfo.color)}
                >
                  {importanceInfo.label}
                </Badge>
              )}

              {lore.isMainTimeline && (
                <Badge variant="default" className="text-xs">
                  Timeline Principal
                </Badge>
              )}

              {lore.year !== undefined && (
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Año {lore.year}
                </Badge>
              )}

              {lore.dateDescription && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {lore.dateDescription}
                </Badge>
              )}
            </div>

            {lore.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {lore.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 ml-2">
            {onAddRelated && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onAddRelated(lore)}
                title="Agregar lore relacionado"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}

            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEdit(lore)}
                title="Editar"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}

            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(lore)}
                title="Eliminar"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div
          className={cn(
            'text-sm text-muted-foreground mb-3',
            !isExpanded && 'line-clamp-3'
          )}
        >
          {lore.content}
        </div>

        {lore.content.length > 200 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs p-0 h-auto"
          >
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </Button>
        )}

        {lore.connections.length > 0 && (
          <>
            <Separator className="my-3" />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Conexiones ({lore.connections.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {lore.connections
                  .slice(0, isExpanded ? undefined : 3)
                  .map(connection => (
                    <Badge
                      key={connection.id}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-muted"
                      title={`${connection.relationshipType}: ${connection.description || ''}`}
                    >
                      {connection.entityName}
                    </Badge>
                  ))}
                {!isExpanded && lore.connections.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{lore.connections.length - 3} más
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}

        {lore.author && (
          <div className="text-xs text-muted-foreground mt-3">
            Autor: {lore.author}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const EraSection: React.FC<{
  era: Era
  lore: Lore[]
  onEditLore?: (lore: Lore) => void
  onDeleteLore?: (lore: Lore) => void
  onAddLore?: (parentLore?: Lore) => void
}> = ({ era, lore, onEditLore, onDeleteLore, onAddLore }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const sortedLore = sortLoreByTimeline(lore)

  if (lore.length === 0) return null

  return (
    <div className="mb-8">
      <div
        className="flex items-center gap-3 mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: era.color }}
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{era.name}</h3>
          <p className="text-sm text-muted-foreground">
            {era.description} • {lore.length} entradas
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {era.endYear
            ? `${era.startYear} - ${era.endYear}`
            : `${era.startYear}+`}
        </Badge>
      </div>

      {isExpanded && (
        <div className="space-y-4 ml-7">
          {sortedLore.map(loreItem => (
            <LoreCard
              key={loreItem.id}
              lore={loreItem}
              {...(onEditLore && { onEdit: onEditLore })}
              {...(onDeleteLore && { onDelete: onDeleteLore })}
              {...(onAddLore && { onAddRelated: onAddLore })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const LoreTimeline: React.FC<LoreTimelineProps> = ({
  onEditLore,
  onAddLore,
  onDeleteLore,
  showOnlyMainTimeline = false,
  selectedYear,
}) => {
  const { lore, eras } = useSessionStore()

  // Use stored eras or fall back to defaults
  const timelineEras = eras.length > 0 ? eras : DEFAULT_ERAS

  // Filter lore based on props
  let filteredLore = lore
  if (showOnlyMainTimeline) {
    filteredLore = lore.filter(l => l.isMainTimeline)
  }
  if (selectedYear !== undefined) {
    filteredLore = filteredLore.filter(l => l.year === selectedYear)
  }

  // Group lore by era
  const groupedLore = groupLoreByEra(filteredLore, timelineEras)

  if (filteredLore.length === 0) {
    return (
      <div className="text-center py-12">
        <Scroll className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {showOnlyMainTimeline
            ? 'No hay lore en el timeline principal'
            : 'No hay lore creado'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {showOnlyMainTimeline
            ? 'Agrega eventos importantes que marquen la historia de tu mundo.'
            : 'Comienza creando la primera entrada de lore para tu campaña.'}
        </p>
        {onAddLore && (
          <Button onClick={() => onAddLore()}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primera Entrada
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {timelineEras.map(era => {
        const eraLore = groupedLore[era.name] || []
        return (
          <EraSection
            key={era.id}
            era={era}
            lore={eraLore}
            {...(onEditLore && { onEditLore })}
            {...(onDeleteLore && { onDeleteLore })}
            {...(onAddLore && { onAddLore })}
          />
        )
      })}

      {/* Lore without era */}
      {groupedLore['Sin Era'] && groupedLore['Sin Era'].length > 0 && (
        <EraSection
          era={{
            id: 'no-era',
            name: 'Sin Era Definida',
            description: 'Entradas de lore sin fecha específica',
            startYear: 0,
            color: '#6B7280',
          }}
          lore={groupedLore['Sin Era']}
          {...(onEditLore && { onEditLore })}
          {...(onDeleteLore && { onDeleteLore })}
          {...(onAddLore && { onAddLore })}
        />
      )}
    </div>
  )
}

export default LoreTimeline
