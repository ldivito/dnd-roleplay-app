import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu'
import {
  Move,
  Sword,
  Shield,
  Heart,
  Zap,
  Eye,
  Target,
  Mountain,
  Trees,
} from 'lucide-react'
import type {
  CombatEntity,
  CombatMap,
  GridPosition,
  Combat,
} from '@/types/combat'
import { useCombatStore } from '@/stores/combatStore'
import { COMBAT_CONDITIONS } from '@/types/combat'

interface CombatGridProps {
  combat: Combat
  map: CombatMap
}

interface CellProps {
  position: GridPosition
  entity: CombatEntity | undefined
  isObstacle: boolean
  isDifficultTerrain: boolean
  isValidMove: boolean
  isSelected: boolean
  onCellClick: (position: GridPosition) => void
  onEntityRightClick: (entity: CombatEntity, position: GridPosition) => void
}

function Cell({
  position,
  entity,
  isObstacle,
  isDifficultTerrain,
  isValidMove,
  isSelected,
  onCellClick,
  onEntityRightClick,
}: CellProps) {
  const cellContent = (
    <div
      className={`
        w-8 h-8 border border-gray-300 cursor-pointer relative
        ${isObstacle ? 'bg-gray-800' : ''}
        ${isDifficultTerrain ? 'bg-yellow-200' : ''}
        ${isValidMove && !entity ? 'bg-green-100 hover:bg-green-200' : ''}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${!isObstacle && !entity ? 'hover:bg-gray-100' : ''}
      `}
      onClick={() => onCellClick(position)}
    >
      {isObstacle && (
        <Mountain className="w-4 h-4 text-gray-600 absolute inset-0 m-auto" />
      )}
      {isDifficultTerrain && !isObstacle && (
        <Trees className="w-3 h-3 text-yellow-600 absolute top-0 left-0" />
      )}
      {entity && (
        <div
          className={`
            w-full h-full rounded-full flex items-center justify-center text-xs font-bold
            ${entity.type === 'player' ? 'bg-blue-500 text-white' : ''}
            ${entity.type === 'npc' ? 'bg-green-500 text-white' : ''}
            ${entity.type === 'monster' ? 'bg-red-500 text-white' : ''}
            ${entity.hitPoints.current <= 0 ? 'opacity-50 grayscale' : ''}
          `}
        >
          {entity.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )

  if (entity) {
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{cellContent}</TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-medium">{entity.name}</p>
                  <p className="text-sm">
                    HP: {entity.hitPoints.current}/{entity.hitPoints.maximum}
                  </p>
                  <p className="text-sm">AC: {entity.armorClass}</p>
                  <p className="text-sm">Iniciativa: {entity.initiative}</p>
                  {entity.conditions.length > 0 && (
                    <p className="text-sm">
                      Condiciones: {entity.conditions.join(', ')}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => onEntityRightClick(entity, position)}>
            <Target className="w-4 h-4 mr-2" />
            Seleccionar como objetivo
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onEntityRightClick(entity, position)}>
            <Move className="w-4 h-4 mr-2" />
            Mover
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Zap className="w-4 h-4 mr-2" />
              Añadir condición
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {COMBAT_CONDITIONS.map(condition => (
                <ContextMenuItem key={condition}>{condition}</ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem onClick={() => onEntityRightClick(entity, position)}>
            <Eye className="w-4 h-4 mr-2" />
            Ver detalles
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return cellContent
}

export default function CombatGrid({ combat, map }: CombatGridProps) {
  const { moveEntity, addCondition, removeCondition } = useCombatStore()
  const [selectedEntity, setSelectedEntity] = useState<CombatEntity | null>(
    null
  )
  const [showValidMoves, setShowValidMoves] = useState(false)

  const currentEntity =
    combat.initiativeOrder.length > 0
      ? combat.entities.find(
          e => e.id === combat.initiativeOrder[combat.currentTurnIndex]
        )
      : null

  const handleCellClick = useCallback(
    (position: GridPosition) => {
      if (selectedEntity && showValidMoves) {
        // Move the selected entity
        moveEntity(selectedEntity.id, position)
        setSelectedEntity(null)
        setShowValidMoves(false)
      }
    },
    [selectedEntity, showValidMoves, moveEntity]
  )

  const handleEntityRightClick = useCallback(
    (entity: CombatEntity, position: GridPosition) => {
      setSelectedEntity(entity)
      setShowValidMoves(true)
    },
    []
  )

  const isValidMove = useCallback(
    (position: GridPosition): boolean => {
      if (!selectedEntity || !showValidMoves) return false

      // Check if position is occupied by another entity
      if (
        combat.entities.some(
          e =>
            e.id !== selectedEntity.id &&
            e.position.x === position.x &&
            e.position.y === position.y
        )
      ) {
        return false
      }

      // Check if position is an obstacle
      if (
        map.obstacles.some(obs => obs.x === position.x && obs.y === position.y)
      ) {
        return false
      }

      // Check movement range (simplified - should consider actual movement speed)
      const distance = Math.max(
        Math.abs(position.x - selectedEntity.position.x),
        Math.abs(position.y - selectedEntity.position.y)
      )

      return distance <= 6 // Simplified movement range
    },
    [selectedEntity, showValidMoves, combat.entities, map.obstacles]
  )

  const renderGrid = () => {
    const grid = []

    for (let y = 0; y < map.gridSize.height; y++) {
      const row = []
      for (let x = 0; x < map.gridSize.width; x++) {
        const position = { x, y }
        const entity = combat.entities.find(
          e => e.position.x === x && e.position.y === y
        )
        const isObstacle = map.obstacles.some(obs => obs.x === x && obs.y === y)
        const isDifficultTerrain = map.difficultTerrain.some(
          dt => dt.x === x && dt.y === y
        )
        const isValidMovePosition = isValidMove(position)
        const isSelected =
          selectedEntity?.position.x === x && selectedEntity?.position.y === y

        row.push(
          <Cell
            key={`${x}-${y}`}
            position={position}
            entity={entity}
            isObstacle={isObstacle}
            isDifficultTerrain={isDifficultTerrain}
            isValidMove={isValidMovePosition}
            isSelected={isSelected}
            onCellClick={handleCellClick}
            onEntityRightClick={handleEntityRightClick}
          />
        )
      }
      grid.push(
        <div key={y} className="flex">
          {row}
        </div>
      )
    }

    return grid
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {map.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedEntity && (
                <Badge variant="outline">Moviendo: {selectedEntity.name}</Badge>
              )}
              {currentEntity && <Badge>Turno: {currentEntity.name}</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="inline-block border-2 border-gray-400 bg-white">
              {renderGrid()}
            </div>
          </div>

          {selectedEntity && showValidMoves && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">
                    Moviendo: {selectedEntity.name}
                  </p>
                  <p className="text-sm text-blue-700">
                    Haz clic en una celda verde para mover la entidad
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedEntity(null)
                    setShowValidMoves(false)
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Jugador</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>NPC</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Monstruo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-800 flex items-center justify-center">
                <Mountain className="w-3 h-3 text-white" />
              </div>
              <span>Obstáculo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-200 border flex items-center justify-center">
                <Trees className="w-3 h-3 text-yellow-600" />
              </div>
              <span>Terreno Difícil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border"></div>
              <span>Movimiento Válido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500"></div>
              <span>Seleccionado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full opacity-50"></div>
              <span>Inconsciente</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
