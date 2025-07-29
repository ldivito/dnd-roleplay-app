'use client'

import React, { useState } from 'react'
import {
  CheckCircle,
  Circle,
  Clock,
  Play,
  Users,
  MapPin,
  Package,
  BookOpen,
  Swords,
  Zap,
  Dice6,
  Timer,
  Settings,
  ChevronRight,
  Edit3,
  Plus,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Quest,
  QuestAction,
  calculateQuestProgress,
  generateQuestTimeline,
  canStartAction,
  getActionTypeInfo,
} from '@/types/quest'

interface QuestTimelineProps {
  quest: Quest
  onUpdateQuest: (quest: Quest) => void
}

export function QuestTimeline({ quest, onUpdateQuest }: QuestTimelineProps) {
  const [isCompactView, setIsCompactView] = useState(false)
  const [completedBy, setCompletedBy] = useState('')
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [actionToComplete, setActionToComplete] = useState<QuestAction | null>(
    null
  )

  const timeline = generateQuestTimeline(quest)
  const progress = calculateQuestProgress(quest)

  const getActionIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      talk_to_npc: <Users className="w-4 h-4" />,
      visit_location: <MapPin className="w-4 h-4" />,
      find_item: <Package className="w-4 h-4" />,
      defeat_enemy: <Swords className="w-4 h-4" />,
      trigger_event: <Zap className="w-4 h-4" />,
      learn_lore: <BookOpen className="w-4 h-4" />,
      skill_check: <Dice6 className="w-4 h-4" />,
      wait_time: <Timer className="w-4 h-4" />,
      custom: <Settings className="w-4 h-4" />,
    }
    return iconMap[type] || <Circle className="w-4 h-4" />
  }

  const toggleActionCompletion = (action: QuestAction) => {
    if (!action.isCompleted) {
      setActionToComplete(action)
      setShowCompletionDialog(true)
    } else {
      // Uncomplete action
      const updatedActions = quest.actions.map(a => {
        if (a.id === action.id) {
          const { completedAt, completedBy, ...rest } = a
          return { ...rest, isCompleted: false }
        }
        return a
      })

      onUpdateQuest({
        ...quest,
        actions: updatedActions,
        lastUpdated: new Date(),
        updatedAt: new Date(),
      })
    }
  }

  const completeAction = () => {
    if (!actionToComplete) return

    const updatedActions = quest.actions.map(a =>
      a.id === actionToComplete.id
        ? {
            ...a,
            isCompleted: true,
            completedAt: new Date(),
            completedBy: completedBy || 'DM',
          }
        : a
    )

    // Update quest status if all required actions are completed
    const allRequiredCompleted = updatedActions
      .filter(a => a.isRequired)
      .every(a => a.isCompleted)

    const newStatus =
      allRequiredCompleted && quest.status !== 'completed'
        ? 'completed'
        : quest.status

    const updateData: Partial<Quest> = {
      ...quest,
      actions: updatedActions,
      status: newStatus,
      lastUpdated: new Date(),
      updatedAt: new Date(),
    }

    if (newStatus === 'completed') {
      updateData.completedDate = new Date()
    }

    onUpdateQuest(updateData as Quest)

    setShowCompletionDialog(false)
    setActionToComplete(null)
    setCompletedBy('')
  }

  const getActionStatusColor = (action: QuestAction) => {
    if (action.isCompleted) return 'text-green-600 bg-green-50 border-green-200'
    if (canStartAction(action, quest.actions))
      return 'text-blue-600 bg-blue-50 border-blue-200'
    return 'text-gray-400 bg-gray-50 border-gray-200'
  }

  const getActionStatusIcon = (action: QuestAction) => {
    if (action.isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }
    if (canStartAction(action, quest.actions)) {
      return <Play className="w-5 h-5 text-blue-600" />
    }
    return <Clock className="w-5 h-5 text-gray-400" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{quest.title}</h2>
          <p className="text-gray-600 mt-1">{quest.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCompactView(!isCompactView)}
          >
            {isCompactView ? 'Vista Detallada' : 'Vista Compacta'}
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Progreso General</h3>
              <span className="text-sm text-gray-600">
                {progress?.completedActions || 0}/{progress?.totalActions || 0}{' '}
                acciones completadas
              </span>
            </div>

            <Progress
              value={progress?.progressPercentage || 0}
              className="h-3"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {progress?.completedActions || 0}
                </div>
                <div className="text-gray-600">Completadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    timeline.filter(
                      a => canStartAction(a, quest.actions) && !a.isCompleted
                    ).length
                  }
                </div>
                <div className="text-gray-600">Disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {
                    timeline.filter(
                      a => !canStartAction(a, quest.actions) && !a.isCompleted
                    ).length
                  }
                </div>
                <div className="text-gray-600">Bloqueadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(progress?.progressPercentage || 0)}%
                </div>
                <div className="text-gray-600">Completado</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Línea de Tiempo de Acciones</h3>

        <div className="space-y-3">
          {timeline.map((action, index) => (
            <Card
              key={action.id}
              className={`border-l-4 ${
                action.isCompleted
                  ? 'border-l-green-500'
                  : action.canStart
                    ? 'border-l-blue-500'
                    : 'border-l-gray-300'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    {getActionStatusIcon(action)}
                    {index < timeline.length - 1 && (
                      <div className="w-px h-12 bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Action content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-500">
                            #{action.order + 1}
                          </span>
                          <h4 className="font-medium text-lg">
                            {action.title}
                          </h4>
                          {action.isRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Requerida
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          {getActionIcon(action.type)}
                          <Badge variant="outline">
                            {getActionTypeInfo(action.type)?.label ||
                              action.type}
                          </Badge>

                          {action.estimatedDuration && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {action.estimatedDuration}h
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant={action.isCompleted ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleActionCompletion(action)}
                          disabled={
                            !canStartAction(action, quest.actions) &&
                            !action.isCompleted
                          }
                        >
                          {action.isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Completada
                            </>
                          ) : canStartAction(action, quest.actions) ? (
                            <>
                              <Play className="w-4 h-4 mr-1" />
                              Completar
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 mr-1" />
                              Bloqueada
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {!isCompactView && (
                      <>
                        <p className="text-gray-700 mb-3">
                          {action.description}
                        </p>

                        {/* Integration info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          {action.npcName && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-700">
                                NPC: {action.npcName}
                              </span>
                            </div>
                          )}
                          {action.locationName && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-green-600" />
                              <span className="text-green-700">
                                Ubicación: {action.locationName}
                              </span>
                            </div>
                          )}
                          {action.itemName && (
                            <div className="flex items-center gap-2 text-sm">
                              <Package className="w-4 h-4 text-purple-600" />
                              <span className="text-purple-700">
                                Objeto: {action.itemName}
                              </span>
                            </div>
                          )}
                          {action.loreTitle && (
                            <div className="flex items-center gap-2 text-sm">
                              <BookOpen className="w-4 h-4 text-yellow-600" />
                              <span className="text-yellow-700">
                                Historia: {action.loreTitle}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Prerequisites */}
                        {action.dependencies &&
                          action.dependencies.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Depende de:</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {action.dependencies.map((dep, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Skill requirement */}
                        {action.skillRequirement && (
                          <div className="flex items-center gap-2 text-sm text-orange-600 mb-3">
                            <Dice6 className="w-4 h-4" />
                            <span>
                              Requiere {action.skillRequirement.skill} DC{' '}
                              {action.skillRequirement.dc}
                            </span>
                          </div>
                        )}

                        {/* Completion info */}
                        {action.isCompleted && (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 text-sm text-green-800">
                              <CheckCircle className="w-4 h-4" />
                              <span>
                                Completada{' '}
                                {action.completedAt &&
                                  `el ${new Intl.DateTimeFormat('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }).format(action.completedAt)}`}
                                {action.completedBy &&
                                  ` por ${action.completedBy}`}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {action.notes && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-3">
                            <div className="text-sm text-blue-800">
                              <strong>Notas:</strong> {action.notes}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {timeline.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Clock className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay acciones configuradas
              </h3>
              <p className="text-gray-600 mb-4">
                Esta misión no tiene acciones definidas. Edita la misión para
                agregar acciones.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completion Dialog */}
      <Dialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Completar Acción</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              ¿Estás seguro de que quieres marcar esta acción como completada?
            </p>

            {actionToComplete && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium">{actionToComplete.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {actionToComplete.description}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="completedBy">Completado por (opcional)</Label>
              <Input
                id="completedBy"
                value={completedBy}
                onChange={e => setCompletedBy(e.target.value)}
                placeholder="Nombre del jugador o personaje"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCompletionDialog(false)}
              >
                Cancelar
              </Button>
              <Button onClick={completeAction}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
