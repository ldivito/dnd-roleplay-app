import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Sword,
  Shield,
  Heart,
  Zap,
  Plus,
  Dice6,
  Target,
} from 'lucide-react'
import type {
  CombatEntity,
  ActionType,
  DamageType,
  Combat,
} from '@/types/combat'
import { useCombatStore } from '@/stores/combatStore'
import { ACTION_TYPES, DAMAGE_TYPES, COMBAT_CONDITIONS } from '@/types/combat'

interface CombatTurnManagerProps {
  combat: Combat
}

export default function CombatTurnManager({ combat }: CombatTurnManagerProps) {
  const {
    startCombat,
    endCombat,
    pauseCombat,
    resumeCombat,
    nextTurn,
    previousTurn,
    addAction,
    updateEntityHP,
    addCondition,
    removeCondition,
    rollInitiative,
  } = useCombatStore()

  const [showActionDialog, setShowActionDialog] = useState(false)
  const [actionType, setActionType] = useState<ActionType>('attack')
  const [actionDescription, setActionDescription] = useState('')
  const [actionTarget, setActionTarget] = useState('')
  const [damageAmount, setDamageAmount] = useState(0)
  const [damageType, setDamageType] = useState<DamageType>('slashing')
  const [healingAmount, setHealingAmount] = useState(0)
  const [spellSlot, setSpellSlot] = useState(1)

  const [showDamageDialog, setShowDamageDialog] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<CombatEntity | null>(
    null
  )
  const [newHP, setNewHP] = useState(0)
  const [tempHP, setTempHP] = useState(0)

  const [showConditionDialog, setShowConditionDialog] = useState(false)
  const [selectedCondition, setSelectedCondition] = useState('')

  const currentEntity =
    combat.initiativeOrder.length > 0
      ? combat.entities.find(
          e => e.id === combat.initiativeOrder[combat.currentTurnIndex]
        )
      : null

  const canStart = combat.status === 'setup' && combat.entities.length >= 2
  const canControl = combat.status === 'active'
  const canEnd = combat.status === 'active' || combat.status === 'paused'

  const handleStartCombat = () => {
    if (canStart) {
      startCombat()
    }
  }

  const handleEndCombat = () => {
    if (canEnd) {
      endCombat()
    }
  }

  const handlePauseCombat = () => {
    if (combat.status === 'active') {
      pauseCombat()
    } else if (combat.status === 'paused') {
      resumeCombat()
    }
  }

  const handleNextTurn = () => {
    if (canControl) {
      nextTurn()
    }
  }

  const handlePreviousTurn = () => {
    if (canControl) {
      previousTurn()
    }
  }

  const handleAddAction = () => {
    if (!currentEntity) return

    const action = {
      entityId: currentEntity.id,
      round: combat.currentRound,
      actionType,
      description:
        actionDescription || `${currentEntity.name} usa ${actionType}`,
      ...(actionTarget && { target: actionTarget }),
      ...(damageAmount > 0 && {
        damage: { amount: damageAmount, type: damageType },
      }),
      ...(healingAmount > 0 && { healing: healingAmount }),
      ...(actionType === 'spell' && { spellSlot }),
    }

    addAction(action)

    // Reset form
    setActionDescription('')
    setActionTarget('')
    setDamageAmount(0)
    setHealingAmount(0)
    setSpellSlot(1)
    setShowActionDialog(false)
  }

  const handleUpdateHP = () => {
    if (!selectedEntity) return

    updateEntityHP(selectedEntity.id, newHP, tempHP)
    setShowDamageDialog(false)
    setSelectedEntity(null)
    setNewHP(0)
    setTempHP(0)
  }

  const handleAddCondition = () => {
    if (!selectedEntity || !selectedCondition) return

    addCondition(selectedEntity.id, selectedCondition)
    setShowConditionDialog(false)
    setSelectedEntity(null)
    setSelectedCondition('')
  }

  const openDamageDialog = (entity: CombatEntity) => {
    setSelectedEntity(entity)
    setNewHP(entity.hitPoints.current)
    setTempHP(entity.hitPoints.temporary)
    setShowDamageDialog(true)
  }

  const openConditionDialog = (entity: CombatEntity) => {
    setSelectedEntity(entity)
    setShowConditionDialog(true)
  }

  return (
    <div className="space-y-4">
      {/* Combat Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Control de Combate</span>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  combat.status === 'setup'
                    ? 'secondary'
                    : combat.status === 'active'
                      ? 'default'
                      : combat.status === 'paused'
                        ? 'outline'
                        : 'destructive'
                }
              >
                {combat.status === 'setup'
                  ? 'Configuración'
                  : combat.status === 'active'
                    ? 'Activo'
                    : combat.status === 'paused'
                      ? 'Pausado'
                      : 'Terminado'}
              </Badge>
              {combat.status === 'active' && (
                <Badge variant="outline">Ronda {combat.currentRound}</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {combat.status === 'setup' && (
              <>
                <Button onClick={rollInitiative} variant="outline">
                  <Dice6 className="h-4 w-4 mr-2" />
                  Tirar Iniciativa
                </Button>
                <Button onClick={handleStartCombat} disabled={!canStart}>
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Combate
                </Button>
              </>
            )}

            {combat.status === 'active' && (
              <>
                <Button onClick={handlePreviousTurn} variant="outline">
                  <SkipBack className="h-4 w-4 mr-2" />
                  Turno Anterior
                </Button>
                <Button onClick={handleNextTurn}>
                  <SkipForward className="h-4 w-4 mr-2" />
                  Siguiente Turno
                </Button>
                <Button onClick={handlePauseCombat} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
              </>
            )}

            {combat.status === 'paused' && (
              <Button onClick={handlePauseCombat}>
                <Play className="h-4 w-4 mr-2" />
                Reanudar
              </Button>
            )}

            {canEnd && (
              <Button onClick={handleEndCombat} variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                Terminar Combate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Initiative Order */}
      <Card>
        <CardHeader>
          <CardTitle>Orden de Iniciativa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {combat.initiativeOrder.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Tira iniciativa para comenzar el combate
              </p>
            ) : (
              combat.initiativeOrder.map((entityId, index) => {
                const entity = combat.entities.find(e => e.id === entityId)
                if (!entity) return null

                const isCurrentTurn =
                  index === combat.currentTurnIndex &&
                  combat.status === 'active'

                return (
                  <div
                    key={entityId}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isCurrentTurn
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          entity.type === 'player'
                            ? 'bg-blue-500 text-white'
                            : entity.type === 'npc'
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                        }`}
                      >
                        {entity.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-medium">{entity.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Iniciativa: {entity.initiative} | AC:{' '}
                          {entity.armorClass}
                        </p>
                      </div>
                      {isCurrentTurn && (
                        <Badge variant="default" className="ml-2">
                          Turno Actual
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {entity.hitPoints.current}/{entity.hitPoints.maximum}
                          {entity.hitPoints.temporary > 0 &&
                            ` (+${entity.hitPoints.temporary})`}
                        </p>
                        {entity.conditions.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {entity.conditions.map((condition, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDamageDialog(entity)}
                        >
                          <Heart className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openConditionDialog(entity)}
                        >
                          <Zap className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Turn Actions */}
      {currentEntity && combat.status === 'active' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Turno de {currentEntity.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Dialog
                open={showActionDialog}
                onOpenChange={setShowActionDialog}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Acción
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      Nueva Acción - {currentEntity.name}
                    </DialogTitle>
                    <DialogDescription>
                      Registra una acción para el turno actual
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="action-type">Tipo de Acción</Label>
                        <Select
                          value={actionType}
                          onValueChange={value =>
                            setActionType(value as ActionType)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTION_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <span>{type.icon}</span>
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="action-target">
                          Objetivo (opcional)
                        </Label>
                        <Select
                          value={actionTarget}
                          onValueChange={setActionTarget}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar objetivo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Sin objetivo</SelectItem>
                            {combat.entities
                              .filter(e => e.id !== currentEntity.id)
                              .map(entity => (
                                <SelectItem key={entity.id} value={entity.id}>
                                  {entity.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="action-description">Descripción</Label>
                      <Textarea
                        id="action-description"
                        value={actionDescription}
                        onChange={e => setActionDescription(e.target.value)}
                        placeholder="Describe la acción..."
                        rows={2}
                      />
                    </div>

                    {(actionType === 'attack' || actionType === 'spell') && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="damage-amount">Daño</Label>
                          <Input
                            id="damage-amount"
                            type="number"
                            min="0"
                            value={damageAmount}
                            onChange={e =>
                              setDamageAmount(Number(e.target.value))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="damage-type">Tipo de Daño</Label>
                          <Select
                            value={damageType}
                            onValueChange={value =>
                              setDamageType(value as DamageType)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DAMAGE_TYPES.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <span>{type.icon}</span>
                                    <span>{type.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="healing-amount">Curación</Label>
                          <Input
                            id="healing-amount"
                            type="number"
                            min="0"
                            value={healingAmount}
                            onChange={e =>
                              setHealingAmount(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    )}

                    {actionType === 'spell' && (
                      <div>
                        <Label htmlFor="spell-slot">Nivel de Hechizo</Label>
                        <Select
                          value={spellSlot.toString()}
                          onValueChange={value => setSpellSlot(Number(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                              <SelectItem key={level} value={level.toString()}>
                                Nivel {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button onClick={handleAddAction}>Añadir Acción</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                onClick={() => openDamageDialog(currentEntity)}
              >
                <Heart className="h-4 w-4 mr-2" />
                Modificar HP
              </Button>

              <Button
                variant="outline"
                onClick={() => openConditionDialog(currentEntity)}
              >
                <Zap className="h-4 w-4 mr-2" />
                Condiciones
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* HP Modification Dialog */}
      <Dialog open={showDamageDialog} onOpenChange={setShowDamageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Modificar Puntos de Vida - {selectedEntity?.name}
            </DialogTitle>
            <DialogDescription>
              Cambia los puntos de vida actuales y temporales
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="new-hp">Puntos de Vida Actuales</Label>
              <Input
                id="new-hp"
                type="number"
                min="0"
                max={selectedEntity?.hitPoints.maximum || 100}
                value={newHP}
                onChange={e => setNewHP(Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Máximo: {selectedEntity?.hitPoints.maximum}
              </p>
            </div>

            <div>
              <Label htmlFor="temp-hp">Puntos de Vida Temporales</Label>
              <Input
                id="temp-hp"
                type="number"
                min="0"
                value={tempHP}
                onChange={e => setTempHP(Number(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleUpdateHP}>Actualizar HP</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Condition Dialog */}
      <Dialog open={showConditionDialog} onOpenChange={setShowConditionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Gestionar Condiciones - {selectedEntity?.name}
            </DialogTitle>
            <DialogDescription>
              Añade o quita condiciones de estado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Condiciones Actuales</Label>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedEntity?.conditions.map((condition, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      selectedEntity &&
                      removeCondition(selectedEntity.id, condition)
                    }
                  >
                    {condition} ×
                  </Badge>
                )) || (
                  <p className="text-sm text-muted-foreground">
                    Sin condiciones
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="new-condition">Añadir Condición</Label>
              <Select
                value={selectedCondition}
                onValueChange={setSelectedCondition}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar condición" />
                </SelectTrigger>
                <SelectContent>
                  {COMBAT_CONDITIONS.map(condition => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleAddCondition} disabled={!selectedCondition}>
              Añadir Condición
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
