import { z } from 'zod'
import type { Character } from './character'
import type { NPC } from './npc'
import type { AnyLocation } from './location'

export type CombatEntityType = 'player' | 'npc' | 'monster'
export type CombatStatus = 'setup' | 'active' | 'paused' | 'ended'
export type TurnStatus = 'waiting' | 'active' | 'done'
export type ActionType =
  | 'attack'
  | 'move'
  | 'dash'
  | 'dodge'
  | 'help'
  | 'hide'
  | 'ready'
  | 'search'
  | 'spell'
  | 'item'
  | 'other'
export type DamageType =
  | 'slashing'
  | 'piercing'
  | 'bludgeoning'
  | 'fire'
  | 'cold'
  | 'acid'
  | 'poison'
  | 'lightning'
  | 'thunder'
  | 'necrotic'
  | 'radiant'
  | 'psychic'
  | 'force'

export interface GridPosition {
  x: number
  y: number
}

export interface CombatEntity {
  id: string
  name: string
  type: CombatEntityType
  characterId?: string
  npcId?: string

  armorClass: number
  hitPoints: {
    current: number
    maximum: number
    temporary: number
  }

  initiative: number
  initiativeBonus: number

  position: GridPosition
  speed: number

  conditions: string[]
  notes: string

  isVisible: boolean
  isPlayerControlled: boolean
}

export interface CombatAction {
  id: string
  entityId: string
  round: number
  actionType: ActionType
  description: string
  target?: string
  damage?: {
    amount: number
    type: DamageType
  }
  healing?: number
  movement?: {
    from: GridPosition
    to: GridPosition
  }
  spellSlot?: number
  timestamp: Date
}

export interface CombatMap {
  id: string
  name: string
  description: string
  imageUrl?: string
  gridSize: {
    width: number
    height: number
  }
  cellSize: number
  obstacles: GridPosition[]
  difficultTerrain: GridPosition[]
  notes?: string
}

export interface CombatRound {
  number: number
  startTime: Date
  endTime?: Date
  actions: CombatAction[]
  notes?: string
}

export interface Combat {
  id: string
  name: string
  description?: string
  status: CombatStatus

  entities: CombatEntity[]
  map?: CombatMap

  currentRound: number
  currentTurnIndex: number
  rounds: CombatRound[]

  initiativeOrder: string[]

  startTime?: Date
  endTime?: Date

  dmNotes?: string
  isVisible: boolean

  createdAt: Date
  updatedAt: Date
}

export interface CombatLog {
  id: string
  combatId: string
  round: number
  message: string
  type:
    | 'action'
    | 'damage'
    | 'healing'
    | 'condition'
    | 'death'
    | 'system'
    | 'dm_note'
  entityId?: string
  targetId?: string
  timestamp: Date
  isVisible: boolean
}

export interface CombatRecap {
  combatId: string
  combatName: string
  startTime: Date
  endTime: Date
  totalRounds: number
  participants: Array<{
    id: string
    name: string
    type: CombatEntityType
    survived: boolean
    damageDealt: number
    damageTaken: number
    healingDone: number
    spellsUsed: number
    conditions: string[]
  }>
  majorEvents: Array<{
    round: number
    event: string
    importance: 'low' | 'medium' | 'high'
  }>
  loot?: string[]
  experience?: number
  notes?: string
}

export const GridPositionSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
})

export const CombatEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(['player', 'npc', 'monster']),
  characterId: z.string().uuid().optional(),
  npcId: z.string().uuid().optional(),

  armorClass: z.number().min(1).max(30),
  hitPoints: z.object({
    current: z.number().min(0),
    maximum: z.number().min(1),
    temporary: z.number().min(0).default(0),
  }),

  initiative: z.number(),
  initiativeBonus: z.number(),

  position: GridPositionSchema,
  speed: z.number().min(0).default(30),

  conditions: z.array(z.string()).default([]),
  notes: z.string().default(''),

  isVisible: z.boolean().default(true),
  isPlayerControlled: z.boolean().default(false),
})

export const CombatActionSchema = z.object({
  id: z.string().uuid(),
  entityId: z.string().uuid(),
  round: z.number().min(1),
  actionType: z.enum([
    'attack',
    'move',
    'dash',
    'dodge',
    'help',
    'hide',
    'ready',
    'search',
    'spell',
    'item',
    'other',
  ]),
  description: z.string(),
  target: z.string().optional(),
  damage: z
    .object({
      amount: z.number().min(0),
      type: z.enum([
        'slashing',
        'piercing',
        'bludgeoning',
        'fire',
        'cold',
        'acid',
        'poison',
        'lightning',
        'thunder',
        'necrotic',
        'radiant',
        'psychic',
        'force',
      ]),
    })
    .optional(),
  healing: z.number().min(0).optional(),
  movement: z
    .object({
      from: GridPositionSchema,
      to: GridPositionSchema,
    })
    .optional(),
  spellSlot: z.number().min(1).max(9).optional(),
  timestamp: z.date(),
})

export const CombatMapSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  imageUrl: z.string().url().optional(),
  gridSize: z.object({
    width: z.number().min(1).max(100),
    height: z.number().min(1).max(100),
  }),
  cellSize: z.number().min(5).max(200).default(30),
  obstacles: z.array(GridPositionSchema).default([]),
  difficultTerrain: z.array(GridPositionSchema).default([]),
  notes: z.string().optional(),
})

export const CombatRoundSchema = z.object({
  number: z.number().min(1),
  startTime: z.date(),
  endTime: z.date().optional(),
  actions: z.array(CombatActionSchema).default([]),
  notes: z.string().optional(),
})

export const CombatSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['setup', 'active', 'paused', 'ended']),

  entities: z.array(CombatEntitySchema).default([]),
  map: CombatMapSchema.optional(),

  currentRound: z.number().min(0).default(0),
  currentTurnIndex: z.number().min(0).default(0),
  rounds: z.array(CombatRoundSchema).default([]),

  initiativeOrder: z.array(z.string().uuid()).default([]),

  startTime: z.date().optional(),
  endTime: z.date().optional(),

  dmNotes: z.string().optional(),
  isVisible: z.boolean().default(true),

  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CombatLogSchema = z.object({
  id: z.string().uuid(),
  combatId: z.string().uuid(),
  round: z.number().min(0),
  message: z.string(),
  type: z.enum([
    'action',
    'damage',
    'healing',
    'condition',
    'death',
    'system',
    'dm_note',
  ]),
  entityId: z.string().uuid().optional(),
  targetId: z.string().uuid().optional(),
  timestamp: z.date(),
  isVisible: z.boolean().default(true),
})

export const CombatRecapSchema = z.object({
  combatId: z.string().uuid(),
  combatName: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  totalRounds: z.number().min(1),
  participants: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      type: z.enum(['player', 'npc', 'monster']),
      survived: z.boolean(),
      damageDealt: z.number().min(0),
      damageTaken: z.number().min(0),
      healingDone: z.number().min(0),
      spellsUsed: z.number().min(0),
      conditions: z.array(z.string()),
    })
  ),
  majorEvents: z.array(
    z.object({
      round: z.number().min(1),
      event: z.string(),
      importance: z.enum(['low', 'medium', 'high']),
    })
  ),
  loot: z.array(z.string()).optional(),
  experience: z.number().min(0).optional(),
  notes: z.string().optional(),
})

export const ACTION_TYPES = [
  { value: 'attack', label: 'Ataque', icon: '⚔️' },
  { value: 'move', label: 'Movimiento', icon: '🏃' },
  { value: 'dash', label: 'Carrera', icon: '💨' },
  { value: 'dodge', label: 'Esquivar', icon: '🛡️' },
  { value: 'help', label: 'Ayudar', icon: '🤝' },
  { value: 'hide', label: 'Esconderse', icon: '👻' },
  { value: 'ready', label: 'Preparar', icon: '⏳' },
  { value: 'search', label: 'Buscar', icon: '🔍' },
  { value: 'spell', label: 'Hechizo', icon: '✨' },
  { value: 'item', label: 'Objeto', icon: '🎒' },
  { value: 'other', label: 'Otro', icon: '❓' },
] as const

export const DAMAGE_TYPES = [
  { value: 'slashing', label: 'Cortante', icon: '🗡️' },
  { value: 'piercing', label: 'Perforante', icon: '🏹' },
  { value: 'bludgeoning', label: 'Contundente', icon: '🔨' },
  { value: 'fire', label: 'Fuego', icon: '🔥' },
  { value: 'cold', label: 'Frío', icon: '❄️' },
  { value: 'acid', label: 'Ácido', icon: '☣️' },
  { value: 'poison', label: 'Veneno', icon: '☠️' },
  { value: 'lightning', label: 'Rayo', icon: '⚡' },
  { value: 'thunder', label: 'Trueno', icon: '🌩️' },
  { value: 'necrotic', label: 'Necrótico', icon: '💀' },
  { value: 'radiant', label: 'Radiante', icon: '☀️' },
  { value: 'psychic', label: 'Psíquico', icon: '🧠' },
  { value: 'force', label: 'Fuerza', icon: '💫' },
] as const

export const COMBAT_CONDITIONS = [
  'Blinded',
  'Charmed',
  'Deafened',
  'Frightened',
  'Grappled',
  'Incapacitated',
  'Invisible',
  'Paralyzed',
  'Petrified',
  'Poisoned',
  'Prone',
  'Restrained',
  'Stunned',
  'Unconscious',
  'Exhaustion 1',
  'Exhaustion 2',
  'Exhaustion 3',
  'Exhaustion 4',
  'Exhaustion 5',
  'Exhaustion 6',
] as const

export function getActionTypeInfo(type: ActionType) {
  return ACTION_TYPES.find(a => a.value === type)
}

export function getDamageTypeInfo(type: DamageType) {
  return DAMAGE_TYPES.find(d => d.value === type)
}

export function calculateInitiativeBonus(dexterity: number): number {
  return Math.floor((dexterity - 10) / 2)
}

export function rollInitiative(dexterity: number): number {
  const bonus = calculateInitiativeBonus(dexterity)
  const roll = Math.floor(Math.random() * 20) + 1
  return roll + bonus
}

export function isAdjacent(pos1: GridPosition, pos2: GridPosition): boolean {
  const dx = Math.abs(pos1.x - pos2.x)
  const dy = Math.abs(pos1.y - pos2.y)
  return dx <= 1 && dy <= 1 && dx + dy > 0
}

export function calculateDistance(
  pos1: GridPosition,
  pos2: GridPosition
): number {
  return Math.max(Math.abs(pos1.x - pos2.x), Math.abs(pos1.y - pos2.y))
}

export function canMoveTo(
  position: GridPosition,
  obstacles: GridPosition[]
): boolean {
  return !obstacles.some(obs => obs.x === position.x && obs.y === position.y)
}

export function getMovementCost(
  position: GridPosition,
  difficultTerrain: GridPosition[]
): number {
  return difficultTerrain.some(dt => dt.x === position.x && dt.y === position.y)
    ? 2
    : 1
}

export type CombatEntityInput = Character | NPC
