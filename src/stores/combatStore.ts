import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type {
  Combat,
  CombatEntity,
  CombatAction,
  CombatMap,
  CombatLog,
  CombatRecap,
  GridPosition,
  ActionType,
  DamageType,
} from '@/types/combat'
import type { Character } from '@/types/character'
import type { NPC } from '@/types/npc'
import { rollInitiative } from '@/types/combat'

interface CombatStore {
  combats: Combat[]
  currentCombat: Combat | null
  combatLogs: CombatLog[]
  combatMaps: CombatMap[]

  createCombat: (name: string, description?: string) => Combat
  setCombat: (combat: Combat) => void
  addEntityToCombat: (entity: Character | NPC, position: GridPosition) => void
  removeEntityFromCombat: (entityId: string) => void

  setMap: (map: CombatMap) => void
  createMap: (name: string, width: number, height: number) => CombatMap

  startCombat: () => void
  endCombat: () => void
  pauseCombat: () => void
  resumeCombat: () => void

  rollInitiative: () => void
  nextTurn: () => void
  previousTurn: () => void

  addAction: (action: Omit<CombatAction, 'id' | 'timestamp'>) => void
  moveEntity: (entityId: string, position: GridPosition) => void
  updateEntityHP: (
    entityId: string,
    currentHP: number,
    temporaryHP?: number
  ) => void
  addCondition: (entityId: string, condition: string) => void
  removeCondition: (entityId: string, condition: string) => void

  addLog: (
    message: string,
    type: CombatLog['type'],
    entityId?: string,
    targetId?: string
  ) => void
  clearLogs: () => void

  generateRecap: (combatId: string) => CombatRecap | null

  saveCombat: (combat: Combat) => void
  loadCombat: (combatId: string) => Combat | null
  deleteCombat: (combatId: string) => void
}

export const useCombatStore = create<CombatStore>((set, get) => ({
  combats: [],
  currentCombat: null,
  combatLogs: [],
  combatMaps: [],

  createCombat: (name: string, description?: string) => {
    const combat: Combat = {
      id: uuidv4(),
      name,
      ...(description && { description }),
      status: 'setup',
      entities: [],
      currentRound: 0,
      currentTurnIndex: 0,
      rounds: [],
      initiativeOrder: [],
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    set(state => ({
      combats: [...state.combats, combat],
      currentCombat: combat,
    }))

    return combat
  },

  setCombat: (combat: Combat) => {
    set({ currentCombat: combat })
  },

  addEntityToCombat: (entity: Character | NPC, position: GridPosition) => {
    const { currentCombat } = get()
    if (!currentCombat) return

    const isNPC = 'npcType' in entity
    const combatEntity: CombatEntity = {
      id: uuidv4(),
      name: entity.name,
      type: isNPC
        ? 'npcType' in entity && entity.npcType === 'enemy'
          ? 'monster'
          : 'npc'
        : 'player',
      ...(!isNPC && { characterId: entity.id }),
      ...(isNPC && { npcId: entity.id }),

      armorClass: entity.armorClass || 10,
      hitPoints: {
        current: entity.hitPoints.current,
        maximum: entity.hitPoints.maximum,
        temporary: entity.hitPoints.temporary,
      },

      initiative: 0,
      initiativeBonus: Math.floor(
        (entity.abilityScores?.dexterity || 10 - 10) / 2
      ),

      position,
      speed: 30,

      conditions: [],
      notes: '',

      isVisible: true,
      isPlayerControlled: !isNPC,
    }

    const updatedCombat = {
      ...currentCombat,
      entities: [...currentCombat.entities, combatEntity],
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)
  },

  removeEntityFromCombat: (entityId: string) => {
    const { currentCombat } = get()
    if (!currentCombat) return

    const updatedCombat = {
      ...currentCombat,
      entities: currentCombat.entities.filter(e => e.id !== entityId),
      initiativeOrder: currentCombat.initiativeOrder.filter(
        id => id !== entityId
      ),
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)
  },

  setMap: (map: CombatMap) => {
    const { currentCombat } = get()
    if (!currentCombat) return

    const updatedCombat = {
      ...currentCombat,
      map,
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)
  },

  createMap: (name: string, width: number, height: number) => {
    const map: CombatMap = {
      id: uuidv4(),
      name,
      description: '',
      gridSize: { width, height },
      cellSize: 30,
      obstacles: [],
      difficultTerrain: [],
    }

    set(state => ({
      combatMaps: [...state.combatMaps, map],
    }))

    return map
  },

  startCombat: () => {
    const { currentCombat } = get()
    if (!currentCombat || currentCombat.status !== 'setup') return

    get().rollInitiative()

    const updatedCombat = {
      ...currentCombat,
      status: 'active' as const,
      currentRound: 1,
      currentTurnIndex: 0,
      startTime: new Date(),
      rounds: [
        {
          number: 1,
          startTime: new Date(),
          actions: [],
        },
      ],
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)
    get().addLog('¡El combate ha comenzado!', 'system')
  },

  endCombat: () => {
    const { currentCombat } = get()
    if (!currentCombat) return

    const updatedCombat = {
      ...currentCombat,
      status: 'ended' as const,
      endTime: new Date(),
      updatedAt: new Date(),
    }

    if (currentCombat.rounds.length > 0) {
      const lastRound = currentCombat.rounds[currentCombat.rounds.length - 1]
      if (lastRound && !lastRound.endTime) {
        lastRound.endTime = new Date()
      }
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)
    get().addLog('El combate ha terminado', 'system')
  },

  pauseCombat: () => {
    const { currentCombat } = get()
    if (!currentCombat || currentCombat.status !== 'active') return

    const updatedCombat = {
      ...currentCombat,
      status: 'paused' as const,
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)
    get().addLog('Combate pausado', 'system')
  },

  resumeCombat: () => {
    const { currentCombat } = get()
    if (!currentCombat || currentCombat.status !== 'paused') return

    const updatedCombat = {
      ...currentCombat,
      status: 'active' as const,
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)
    get().addLog('Combate reanudado', 'system')
  },

  rollInitiative: () => {
    const { currentCombat } = get()
    if (!currentCombat) return

    const entitiesWithInitiative = currentCombat.entities.map(entity => ({
      ...entity,
      initiative: rollInitiative(10 + entity.initiativeBonus * 2),
    }))

    const initiativeOrder = entitiesWithInitiative
      .sort((a, b) => b.initiative - a.initiative)
      .map(e => e.id)

    const updatedCombat = {
      ...currentCombat,
      entities: entitiesWithInitiative,
      initiativeOrder,
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)
    get().addLog('Se ha tirado iniciativa', 'system')
  },

  nextTurn: () => {
    const { currentCombat } = get()
    if (!currentCombat || currentCombat.status !== 'active') return

    let { currentTurnIndex, currentRound } = currentCombat
    currentTurnIndex++

    if (currentTurnIndex >= currentCombat.initiativeOrder.length) {
      currentTurnIndex = 0
      currentRound++

      const newRound = {
        number: currentRound,
        startTime: new Date(),
        actions: [],
      }

      const rounds = [...currentCombat.rounds]
      if (rounds.length > 0) {
        const lastRound = rounds[rounds.length - 1]
        if (lastRound) {
          lastRound.endTime = new Date()
        }
      }
      rounds.push(newRound)

      const updatedCombat = {
        ...currentCombat,
        currentRound,
        currentTurnIndex,
        rounds,
        updatedAt: new Date(),
      }

      set({ currentCombat: updatedCombat })
      get().saveCombat(updatedCombat)
      get().addLog(`Comienza la ronda ${currentRound}`, 'system')
    } else {
      const updatedCombat = {
        ...currentCombat,
        currentTurnIndex,
        updatedAt: new Date(),
      }

      set({ currentCombat: updatedCombat })
      get().saveCombat(updatedCombat)
    }
  },

  previousTurn: () => {
    const { currentCombat } = get()
    if (!currentCombat || currentCombat.status !== 'active') return

    let { currentTurnIndex, currentRound } = currentCombat
    currentTurnIndex--

    if (currentTurnIndex < 0) {
      if (currentRound > 1) {
        currentRound--
        currentTurnIndex = currentCombat.initiativeOrder.length - 1

        const rounds = [...currentCombat.rounds]
        rounds.pop()
        if (rounds.length > 0) {
          const lastRound = rounds[rounds.length - 1]
          if (lastRound && lastRound.endTime) {
            delete lastRound.endTime
          }
        }

        const updatedCombat = {
          ...currentCombat,
          currentRound,
          currentTurnIndex,
          rounds,
          updatedAt: new Date(),
        }

        set({ currentCombat: updatedCombat })
        get().saveCombat(updatedCombat)
      } else {
        currentTurnIndex = 0
      }
    } else {
      const updatedCombat = {
        ...currentCombat,
        currentTurnIndex,
        updatedAt: new Date(),
      }

      set({ currentCombat: updatedCombat })
      get().saveCombat(updatedCombat)
    }
  },

  addAction: (action: Omit<CombatAction, 'id' | 'timestamp'>) => {
    const { currentCombat } = get()
    if (!currentCombat) return

    const newAction: CombatAction = {
      ...action,
      id: uuidv4(),
      timestamp: new Date(),
    }

    const rounds = [...currentCombat.rounds]
    if (rounds.length > 0) {
      const lastRound = rounds[rounds.length - 1]
      if (lastRound) {
        lastRound.actions.push(newAction)
      }
    }

    const updatedCombat = {
      ...currentCombat,
      rounds,
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)

    const entity = currentCombat.entities.find(e => e.id === action.entityId)
    get().addLog(
      `${entity?.name} ${action.description}`,
      'action',
      action.entityId,
      action.target
    )
  },

  moveEntity: (entityId: string, position: GridPosition) => {
    const { currentCombat } = get()
    if (!currentCombat) return

    const entityIndex = currentCombat.entities.findIndex(e => e.id === entityId)
    if (entityIndex === -1) return

    const entities = [...currentCombat.entities]
    const entity = entities[entityIndex]
    if (!entity) return

    const oldPosition = entity.position
    entities[entityIndex] = {
      ...entity,
      position,
    }

    const updatedCombat = {
      ...currentCombat,
      entities,
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)

    get().addAction({
      entityId,
      round: currentCombat.currentRound,
      actionType: 'move',
      description: `se mueve de (${oldPosition.x}, ${oldPosition.y}) a (${position.x}, ${position.y})`,
      movement: {
        from: oldPosition,
        to: position,
      },
    })
  },

  updateEntityHP: (
    entityId: string,
    currentHP: number,
    temporaryHP: number = 0
  ) => {
    const { currentCombat } = get()
    if (!currentCombat) return

    const entityIndex = currentCombat.entities.findIndex(e => e.id === entityId)
    if (entityIndex === -1) return

    const entities = [...currentCombat.entities]
    const entity = entities[entityIndex]
    if (!entity) return

    const oldHP = entity.hitPoints.current
    entities[entityIndex] = {
      ...entity,
      hitPoints: {
        ...entity.hitPoints,
        current: Math.max(0, currentHP),
        temporary: temporaryHP,
      },
    }

    const updatedCombat = {
      ...currentCombat,
      entities,
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)

    const updatedEntity = entities[entityIndex]
    if (!updatedEntity) return

    const hpChange = currentHP - oldHP
    if (hpChange < 0) {
      get().addLog(
        `${updatedEntity.name} recibe ${Math.abs(hpChange)} puntos de daño`,
        'damage',
        entityId
      )
      if (currentHP <= 0) {
        get().addLog(
          `${updatedEntity.name} cae inconsciente`,
          'death',
          entityId
        )
      }
    } else if (hpChange > 0) {
      get().addLog(
        `${updatedEntity.name} recupera ${hpChange} puntos de vida`,
        'healing',
        entityId
      )
    }
  },

  addCondition: (entityId: string, condition: string) => {
    const { currentCombat } = get()
    if (!currentCombat) return

    const entityIndex = currentCombat.entities.findIndex(e => e.id === entityId)
    if (entityIndex === -1) return

    const entities = [...currentCombat.entities]
    const entity = entities[entityIndex]
    if (!entity || entity.conditions.includes(condition)) return

    entities[entityIndex] = {
      ...entity,
      conditions: [...entity.conditions, condition],
    }

    const updatedCombat = {
      ...currentCombat,
      entities,
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)

    const updatedEntity = entities[entityIndex]
    if (updatedEntity) {
      get().addLog(
        `${updatedEntity.name} está afectado por ${condition}`,
        'condition',
        entityId
      )
    }
  },

  removeCondition: (entityId: string, condition: string) => {
    const { currentCombat } = get()
    if (!currentCombat) return

    const entityIndex = currentCombat.entities.findIndex(e => e.id === entityId)
    if (entityIndex === -1) return

    const entities = [...currentCombat.entities]
    const entity = entities[entityIndex]
    if (!entity) return

    entities[entityIndex] = {
      ...entity,
      conditions: entity.conditions.filter(c => c !== condition),
    }

    const updatedCombat = {
      ...currentCombat,
      entities,
      updatedAt: new Date(),
    }

    set({ currentCombat: updatedCombat })
    get().saveCombat(updatedCombat)

    const updatedEntity = entities[entityIndex]
    if (updatedEntity) {
      get().addLog(
        `${updatedEntity.name} ya no está afectado por ${condition}`,
        'condition',
        entityId
      )
    }
  },

  addLog: (
    message: string,
    type: CombatLog['type'],
    entityId?: string,
    targetId?: string
  ) => {
    const { currentCombat } = get()
    if (!currentCombat) return

    const log: CombatLog = {
      id: uuidv4(),
      combatId: currentCombat.id,
      round: currentCombat.currentRound,
      message,
      type,
      ...(entityId && { entityId }),
      ...(targetId && { targetId }),
      timestamp: new Date(),
      isVisible: true,
    }

    set(state => ({
      combatLogs: [...state.combatLogs, log],
    }))
  },

  clearLogs: () => {
    set({ combatLogs: [] })
  },

  generateRecap: (combatId: string) => {
    const { combats, combatLogs } = get()
    const combat = combats.find(c => c.id === combatId)
    if (!combat || !combat.startTime || !combat.endTime) return null

    const logs = combatLogs.filter(l => l.combatId === combatId)

    const participants = combat.entities.map(entity => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      survived: entity.hitPoints.current > 0,
      damageDealt:
        logs.filter(l => l.entityId === entity.id && l.type === 'damage')
          .length * 5, // Mock calculation
      damageTaken:
        logs.filter(l => l.targetId === entity.id && l.type === 'damage')
          .length * 5, // Mock calculation
      healingDone:
        logs.filter(l => l.entityId === entity.id && l.type === 'healing')
          .length * 3, // Mock calculation
      spellsUsed: logs.filter(
        l => l.entityId === entity.id && l.message.includes('hechizo')
      ).length,
      conditions: entity.conditions,
    }))

    const majorEvents = logs
      .filter(l => l.type === 'death' || l.type === 'system')
      .map(l => ({
        round: l.round,
        event: l.message,
        importance:
          l.type === 'death' ? ('high' as const) : ('medium' as const),
      }))

    const recap: CombatRecap = {
      combatId,
      combatName: combat.name,
      startTime: combat.startTime,
      endTime: combat.endTime,
      totalRounds: combat.currentRound,
      participants,
      majorEvents,
    }

    return recap
  },

  saveCombat: (combat: Combat) => {
    set(state => ({
      combats: state.combats.map(c => (c.id === combat.id ? combat : c)),
    }))
  },

  loadCombat: (combatId: string) => {
    const { combats } = get()
    return combats.find(c => c.id === combatId) || null
  },

  deleteCombat: (combatId: string) => {
    set(state => ({
      combats: state.combats.filter(c => c.id !== combatId),
      currentCombat:
        state.currentCombat?.id === combatId ? null : state.currentCombat,
      combatLogs: state.combatLogs.filter(l => l.combatId !== combatId),
    }))
  },
}))
