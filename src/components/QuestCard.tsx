'use client'

import React from 'react'
import {
  Calendar,
  Clock,
  CheckCircle,
  Edit3,
  Trash2,
  Users,
  MapPin,
  BookOpen,
  Trophy,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Quest,
  calculateQuestProgress,
  getQuestTypeInfo,
  getQuestStatusInfo,
  getQuestPriorityInfo,
  getActionTypeInfo,
} from '@/types/quest'

interface QuestCardProps {
  quest: Quest
  onEdit: (quest: Quest) => void
  onDelete: (questId: string) => void
  onViewTimeline: (quest: Quest) => void
}

export function QuestCard({
  quest,
  onEdit,
  onDelete,
  onViewTimeline,
}: QuestCardProps) {
  const typeInfo = getQuestTypeInfo(quest.type)
  const statusInfo = getQuestStatusInfo(quest.status)
  const priorityInfo = getQuestPriorityInfo(quest.priority)
  const timeline = calculateQuestProgress(quest)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  const getStatusIcon = () => {
    switch (quest.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'failed':
        return <div className="w-4 h-4 rounded-full bg-red-600" />
      case 'cancelled':
        return <div className="w-4 h-4 rounded-full bg-gray-400" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon()}
              <CardTitle className="text-lg font-semibold">
                {quest.title}
              </CardTitle>
            </div>

            {quest.summary && (
              <p className="text-sm text-gray-600 mb-2">{quest.summary}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {typeInfo && (
                <Badge variant="outline" className={typeInfo.color}>
                  {typeInfo.label}
                </Badge>
              )}
              {statusInfo && (
                <Badge variant="outline" className={statusInfo.color}>
                  {statusInfo.label}
                </Badge>
              )}
              {priorityInfo && (
                <Badge variant="outline" className={priorityInfo.color}>
                  {priorityInfo.label}
                </Badge>
              )}
              {!quest.isKnownToPlayers && (
                <Badge variant="secondary" className="text-xs">
                  Oculta para jugadores
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewTimeline(quest)}
              className="text-xs"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Timeline
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(quest)}>
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(quest.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-700 line-clamp-2">
            {quest.description}
          </p>

          {/* Progress */}
          {quest.actions.length > 0 && timeline && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Progreso</span>
                <span className="text-gray-600">
                  {timeline.completedActions}/{timeline.totalActions} acciones
                  completadas
                </span>
              </div>
              <Progress value={timeline.progressPercentage} className="h-2" />
            </div>
          )}

          {/* Next Action */}
          {timeline && timeline.nextAction && quest.status === 'active' && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900">
                    Siguiente: {timeline.nextAction.title}
                  </p>
                  <p className="text-xs text-blue-700 mt-1 line-clamp-2">
                    {timeline.nextAction.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {getActionTypeInfo(timeline.nextAction.type)?.icon}{' '}
                      {getActionTypeInfo(timeline.nextAction.type)?.label}
                    </Badge>
                    {timeline.nextAction.isRequired && (
                      <Badge variant="destructive" className="text-xs">
                        Requerida
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quest Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              {quest.questGiverName && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Dador: {quest.questGiverName}
                  </span>
                </div>
              )}
              {quest.startLocationName && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Inicio: {quest.startLocationName}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {quest.rewards.length > 0 && (
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {quest.rewards.length} recompensas
                  </span>
                </div>
              )}
              {quest.connections.length > 0 && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {quest.connections.length} conexiones
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {quest.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {quest.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {quest.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{quest.tags.length - 3} más
                </Badge>
              )}
            </div>
          )}

          {/* Dates */}
          <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-4">
              {quest.startDate && (
                <span>Iniciada: {formatDate(quest.startDate)}</span>
              )}
              {quest.completedDate && (
                <span>Completada: {formatDate(quest.completedDate)}</span>
              )}
            </div>
            <span>Actualizada: {formatDate(quest.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
