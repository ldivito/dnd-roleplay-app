'use client'

import React from 'react'
import {
  Users,
  Crown,
  MapPin,
  Target,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Shield,
  Sword,
  Building,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Faction,
  calculateFactionPower,
  getFactionTypeInfo,
  getFactionSizeInfo,
  getFactionInfluenceInfo,
  getFactionAlignmentInfo,
  getFactionStatusInfo,
  getRelationshipTypeInfo,
} from '@/types/faction'

interface FactionCardProps {
  faction: Faction
  onEdit: (faction: Faction) => void
  onDelete: (factionId: string) => void
  onViewDetails?: (faction: Faction) => void
}

export function FactionCard({
  faction,
  onEdit,
  onDelete,
  onViewDetails,
}: FactionCardProps) {
  const typeInfo = getFactionTypeInfo(faction.type)
  const sizeInfo = getFactionSizeInfo(faction.size)
  const influenceInfo = getFactionInfluenceInfo(faction.influence)
  const alignmentInfo = faction.alignment
    ? getFactionAlignmentInfo(faction.alignment)
    : null
  const statusInfo = getFactionStatusInfo(faction.status)
  const factionPower = calculateFactionPower(faction)

  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A'

    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida'
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(dateObj)
  }

  const getStatusIcon = () => {
    switch (faction.status) {
      case 'active':
        return <Shield className="w-4 h-4 text-green-600" />
      case 'inactive':
        return <Shield className="w-4 h-4 text-yellow-600" />
      case 'disbanded':
        return <Shield className="w-4 h-4 text-gray-600" />
      case 'hidden':
        return <EyeOff className="w-4 h-4 text-purple-600" />
      case 'destroyed':
        return <Shield className="w-4 h-4 text-red-600" />
      default:
        return <Shield className="w-4 h-4 text-gray-600" />
    }
  }

  const getPowerColor = (power: number) => {
    if (power >= 80) return 'text-red-600'
    if (power >= 60) return 'text-orange-600'
    if (power >= 40) return 'text-yellow-600'
    if (power >= 20) return 'text-blue-600'
    return 'text-gray-600'
  }

  const activeGoals = faction.goals?.filter(g => g.status === 'active') || []
  const completedGoals =
    faction.goals?.filter(g => g.status === 'completed') || []
  const averageProgress = faction.goals?.length
    ? faction.goals.reduce((sum, goal) => sum + goal.progress, 0) /
      faction.goals.length
    : 0

  const handleDelete = () => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar la facción "${faction.name}"?`
      )
    ) {
      onDelete(faction.id)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon()}
              <CardTitle className="text-lg">{faction.name}</CardTitle>
              {faction.shortName && (
                <Badge variant="outline" className="text-xs">
                  {faction.shortName}
                </Badge>
              )}
              {!faction.isKnownToPlayers && (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {typeInfo && (
                <Badge variant="secondary" className={typeInfo.color}>
                  {typeInfo.label}
                </Badge>
              )}
              {statusInfo && (
                <Badge variant="outline" className={statusInfo.color}>
                  {statusInfo.label}
                </Badge>
              )}
              {sizeInfo && <Badge variant="outline">{sizeInfo.label}</Badge>}
              {influenceInfo && (
                <Badge variant="outline">{influenceInfo.label}</Badge>
              )}
              {alignmentInfo && (
                <Badge variant="outline">{alignmentInfo.short}</Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(faction)}>
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {faction.description}
        </p>

        {/* Key Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {faction.leader && (
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span className="font-medium">Líder:</span>
              <span>{faction.leader}</span>
            </div>
          )}

          {faction.headquarters && (
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Base:</span>
              <span>{faction.headquarters}</span>
            </div>
          )}

          {faction.totalMembers && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Miembros:</span>
              <span>{faction.totalMembers}</span>
            </div>
          )}

          {faction.territory && faction.territory.length > 0 && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-medium">Territorios:</span>
              <span>{faction.territory.length}</span>
            </div>
          )}
        </div>

        {/* Power Scores */}
        {(faction.wealth ||
          faction.militaryStrength ||
          faction.politicalPower) && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            {faction.wealth && (
              <div className="text-center">
                <div className="text-yellow-600 font-medium">
                  💰 {faction.wealth}/10
                </div>
                <div className="text-gray-500">Riqueza</div>
              </div>
            )}
            {faction.militaryStrength && (
              <div className="text-center">
                <div className="text-red-600 font-medium">
                  ⚔️ {faction.militaryStrength}/10
                </div>
                <div className="text-gray-500">Militar</div>
              </div>
            )}
            {faction.politicalPower && (
              <div className="text-center">
                <div className="text-purple-600 font-medium">
                  🏛️ {faction.politicalPower}/10
                </div>
                <div className="text-gray-500">Político</div>
              </div>
            )}
          </div>
        )}

        {/* Goals Progress */}
        {faction.goals && faction.goals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Objetivos ({activeGoals.length} activos, {completedGoals.length}{' '}
                completados)
              </span>
              <span className="text-xs text-gray-500">
                {Math.round(averageProgress)}% promedio
              </span>
            </div>
            <Progress value={averageProgress} className="h-2" />
          </div>
        )}

        {/* Recent Goals */}
        {activeGoals.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">
              Objetivos Activos:
            </h4>
            {activeGoals.slice(0, 2).map(goal => (
              <div
                key={goal.id}
                className="text-xs text-gray-600 flex items-center gap-2"
              >
                <Badge variant="outline" className="text-xs">
                  {goal.priority}
                </Badge>
                <span className="flex-1 truncate">{goal.title}</span>
                <span>{goal.progress}%</span>
              </div>
            ))}
            {activeGoals.length > 2 && (
              <div className="text-xs text-gray-500">
                +{activeGoals.length - 2} objetivos más
              </div>
            )}
          </div>
        )}

        {/* Resources */}
        {faction.resources && faction.resources.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">
              Recursos Principales:
            </h4>
            <div className="flex flex-wrap gap-1">
              {faction.resources.slice(0, 3).map(resource => (
                <Badge key={resource.id} variant="outline" className="text-xs">
                  {resource.name}
                </Badge>
              ))}
              {faction.resources.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{faction.resources.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Relationships */}
        {faction.relationships && faction.relationships.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">Relaciones:</h4>
            <div className="flex flex-wrap gap-1">
              {faction.relationships.slice(0, 3).map(rel => {
                const relInfo = getRelationshipTypeInfo(rel.relationshipType)
                return (
                  <Badge
                    key={rel.id}
                    variant="outline"
                    className={`text-xs ${relInfo?.color}`}
                  >
                    {rel.factionName} ({relInfo?.label})
                  </Badge>
                )
              })}
              {faction.relationships.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{faction.relationships.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Connections */}
        {faction.connections && faction.connections.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">Conexiones:</h4>
            <div className="flex flex-wrap gap-1">
              {faction.connections.slice(0, 4).map(conn => (
                <Badge key={conn.id} variant="outline" className="text-xs">
                  {conn.type.toUpperCase()}: {conn.entityName}
                </Badge>
              ))}
              {faction.connections.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{faction.connections.length - 4} más
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {faction.tags && faction.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {faction.tags.slice(0, 4).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {faction.tags.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{faction.tags.length - 4} más
              </Badge>
            )}
          </div>
        )}

        {/* Power and Dates */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-4">
            <span className={`font-medium ${getPowerColor(factionPower)}`}>
              Poder: {Math.round(factionPower)}
            </span>
            {faction.foundedDate && (
              <span>Fundada: {formatDate(faction.foundedDate)}</span>
            )}
          </div>
          <span>Actualizada: {formatDate(faction.updatedAt)}</span>
        </div>

        {/* View Details Button */}
        {onViewDetails && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onViewDetails(faction)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalles
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
