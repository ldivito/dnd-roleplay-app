import { z } from 'zod'

// Quest Types
export type QuestStatus =
  | 'not_started'
  | 'active'
  | 'completed'
  | 'failed'
  | 'cancelled'
export type QuestPriority = 'high' | 'medium' | 'low'
export type QuestType =
  | 'main'
  | 'side'
  | 'personal'
  | 'faction'
  | 'exploration'
  | 'other'

// Action Types for timeline steps
export type ActionType =
  | 'talk_to_npc'
  | 'visit_location'
  | 'find_item'
  | 'defeat_enemy'
  | 'trigger_event'
  | 'learn_lore'
  | 'skill_check'
  | 'wait_time'
  | 'custom'

// Timeline Action Interface
export interface QuestAction {
  id: string
  title: string
  description: string
  type: ActionType

  // Integration points with other systems
  npcId?: string // For talk_to_npc actions
  npcName?: string
  locationId?: string // For visit_location actions
  locationName?: string
  itemId?: string // For find_item actions
  itemName?: string
  loreId?: string // For learn_lore actions
  loreTitle?: string

  // Action properties
  isRequired: boolean // Whether this action is mandatory or optional
  isCompleted: boolean
  completedAt?: Date
  completedBy?: string // Player or character who completed it

  // Conditions and requirements
  prerequisites?: string[] // IDs of actions that must be completed first
  skillRequirement?: {
    skill: string
    dc: number
  }

  // Custom properties for flexibility
  customData?: Record<string, any>
  notes?: string

  // Timeline positioning
  estimatedDuration?: number // In hours/days
  order: number // Order in the timeline
}

// Quest Reward System
export interface QuestReward {
  id: string
  type: 'experience' | 'gold' | 'item' | 'reputation' | 'lore' | 'other'
  description: string
  amount?: number // For experience/gold
  itemId?: string // For item rewards
  itemName?: string
  customValue?: string // For other types
}

// Quest Connections to other systems
export interface QuestConnection {
  id: string
  type: 'npc' | 'location' | 'lore' | 'item' | 'character'
  entityId: string
  entityName: string
  relationshipType:
    | 'questgiver'
    | 'involved'
    | 'mentioned'
    | 'required'
    | 'optional'
  description?: string
}

// Main Quest Interface
export interface Quest {
  id: string
  title: string
  description: string
  summary?: string // Short one-line summary

  // Quest Classification
  type: QuestType
  priority: QuestPriority
  status: QuestStatus

  // Timeline and Actions
  actions: QuestAction[]

  // Rewards
  rewards: QuestReward[]

  // Connections to other game systems
  connections: QuestConnection[]

  // Quest Giver and Context
  questGiverId?: string // NPC who gave the quest
  questGiverName?: string
  startLocationId?: string // Where the quest was received
  startLocationName?: string

  // Progress Tracking
  startDate?: Date
  completedDate?: Date
  lastUpdated: Date

  // Player Information
  isKnownToPlayers: boolean // Whether players know about this quest
  playerNotes?: string // Notes visible to players
  dmNotes?: string // Private DM notes

  // Organization
  tags: string[]

  // Related Quests
  parentQuestId?: string // If this is a sub-quest
  relatedQuestIds: string[] // Other related quests

  // Generated Timeline (computed from actions)
  timeline?: {
    totalEstimatedDuration?: number
    completedActions: number
    totalActions: number
    progressPercentage: number
    nextAction?: QuestAction
  }

  createdAt: Date
  updatedAt: Date
}

// Quest Chain - for linking multiple related quests
export interface QuestChain {
  id: string
  title: string
  description: string
  questIds: string[]
  isLinear: boolean // Whether quests must be completed in order
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// Zod Schemas for validation
export const QuestActionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string(),
  type: z.enum([
    'talk_to_npc',
    'visit_location',
    'find_item',
    'defeat_enemy',
    'trigger_event',
    'learn_lore',
    'skill_check',
    'wait_time',
    'custom',
  ]),

  npcId: z.string().uuid().optional(),
  npcName: z.string().optional(),
  locationId: z.string().uuid().optional(),
  locationName: z.string().optional(),
  itemId: z.string().uuid().optional(),
  itemName: z.string().optional(),
  loreId: z.string().uuid().optional(),
  loreTitle: z.string().optional(),

  isRequired: z.boolean().default(true),
  isCompleted: z.boolean().default(false),
  completedAt: z.date().optional(),
  completedBy: z.string().optional(),

  prerequisites: z.array(z.string().uuid()).default([]),
  skillRequirement: z
    .object({
      skill: z.string(),
      dc: z.number().min(1).max(30),
    })
    .optional(),

  customData: z.record(z.string(), z.any()).optional(),
  notes: z.string().optional(),

  estimatedDuration: z.number().min(0).optional(),
  order: z.number().min(0),
})

export const QuestRewardSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['experience', 'gold', 'item', 'reputation', 'lore', 'other']),
  description: z.string(),
  amount: z.number().min(0).optional(),
  itemId: z.string().uuid().optional(),
  itemName: z.string().optional(),
  customValue: z.string().optional(),
})

export const QuestConnectionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['npc', 'location', 'lore', 'item', 'character']),
  entityId: z.string().uuid(),
  entityName: z.string(),
  relationshipType: z.enum([
    'questgiver',
    'involved',
    'mentioned',
    'required',
    'optional',
  ]),
  description: z.string().optional(),
})

export const QuestSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  summary: z.string().optional(),

  type: z.enum(['main', 'side', 'personal', 'faction', 'exploration', 'other']),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['not_started', 'active', 'completed', 'failed', 'cancelled']),

  actions: z.array(QuestActionSchema).default([]),
  rewards: z.array(QuestRewardSchema).default([]),
  connections: z.array(QuestConnectionSchema).default([]),

  questGiverId: z.string().uuid().optional(),
  questGiverName: z.string().optional(),
  startLocationId: z.string().uuid().optional(),
  startLocationName: z.string().optional(),

  startDate: z.date().optional(),
  completedDate: z.date().optional(),
  lastUpdated: z.date(),

  isKnownToPlayers: z.boolean().default(true),
  playerNotes: z.string().optional(),
  dmNotes: z.string().optional(),

  tags: z.array(z.string()).default([]),

  parentQuestId: z.string().uuid().optional(),
  relatedQuestIds: z.array(z.string().uuid()).default([]),

  createdAt: z.date(),
  updatedAt: z.date(),
})

export const QuestChainSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string(),
  questIds: z.array(z.string().uuid()).default([]),
  isLinear: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Constants for dropdowns and UI
export const QUEST_TYPES = [
  {
    value: 'main',
    label: 'Principal',
    color: 'bg-red-100 text-red-800',
    description: 'Historia principal de la campaña',
  },
  {
    value: 'side',
    label: 'Secundaria',
    color: 'bg-blue-100 text-blue-800',
    description: 'Misiones opcionales',
  },
  {
    value: 'personal',
    label: 'Personal',
    color: 'bg-green-100 text-green-800',
    description: 'Específica para un personaje',
  },
  {
    value: 'faction',
    label: 'Facción',
    color: 'bg-purple-100 text-purple-800',
    description: 'Relacionada con una facción',
  },
  {
    value: 'exploration',
    label: 'Exploración',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Descubrimiento de lugares',
  },
  {
    value: 'other',
    label: 'Otra',
    color: 'bg-gray-100 text-gray-800',
    description: 'Otro tipo de misión',
  },
] as const

export const QUEST_PRIORITIES = [
  { value: 'high', label: 'Alta', color: 'bg-red-100 text-red-800' },
  { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'low', label: 'Baja', color: 'bg-green-100 text-green-800' },
] as const

export const QUEST_STATUSES = [
  {
    value: 'not_started',
    label: 'No Iniciada',
    color: 'bg-gray-100 text-gray-800',
  },
  { value: 'active', label: 'Activa', color: 'bg-blue-100 text-blue-800' },
  {
    value: 'completed',
    label: 'Completada',
    color: 'bg-green-100 text-green-800',
  },
  { value: 'failed', label: 'Fallida', color: 'bg-red-100 text-red-800' },
  {
    value: 'cancelled',
    label: 'Cancelada',
    color: 'bg-gray-100 text-gray-800',
  },
] as const

export const ACTION_TYPES = [
  {
    value: 'talk_to_npc',
    label: 'Hablar con NPC',
    icon: '💬',
    description: 'Conversación con un personaje no jugador',
  },
  {
    value: 'visit_location',
    label: 'Visitar Ubicación',
    icon: '📍',
    description: 'Ir a un lugar específico',
  },
  {
    value: 'find_item',
    label: 'Encontrar Objeto',
    icon: '🎒',
    description: 'Obtener un objeto específico',
  },
  {
    value: 'defeat_enemy',
    label: 'Derrotar Enemigo',
    icon: '⚔️',
    description: 'Combatir y vencer a un oponente',
  },
  {
    value: 'trigger_event',
    label: 'Activar Evento',
    icon: '⚡',
    description: 'Desencadenar un acontecimiento',
  },
  {
    value: 'learn_lore',
    label: 'Aprender Historia',
    icon: '📚',
    description: 'Descubrir información importante',
  },
  {
    value: 'skill_check',
    label: 'Tirada de Habilidad',
    icon: '🎲',
    description: 'Realizar una prueba de habilidad',
  },
  {
    value: 'wait_time',
    label: 'Esperar Tiempo',
    icon: '⏰',
    description: 'Pasar un período de tiempo',
  },
  {
    value: 'custom',
    label: 'Personalizada',
    icon: '⚙️',
    description: 'Acción personalizada definida por el DM',
  },
] as const

export const REWARD_TYPES = [
  { value: 'experience', label: 'Experiencia', icon: '✨' },
  { value: 'gold', label: 'Oro', icon: '💰' },
  { value: 'item', label: 'Objeto', icon: '🎒' },
  { value: 'reputation', label: 'Reputación', icon: '⭐' },
  { value: 'lore', label: 'Información', icon: '📚' },
  { value: 'other', label: 'Otro', icon: '🎁' },
] as const

export const CONNECTION_TYPES = [
  {
    value: 'questgiver',
    label: 'Dador de Misión',
    description: 'Quien otorga la misión',
  },
  {
    value: 'involved',
    label: 'Involucrado',
    description: 'Participa activamente en la misión',
  },
  {
    value: 'mentioned',
    label: 'Mencionado',
    description: 'Se menciona en la misión',
  },
  {
    value: 'required',
    label: 'Requerido',
    description: 'Necesario para completar la misión',
  },
  {
    value: 'optional',
    label: 'Opcional',
    description: 'Puede ayudar pero no es necesario',
  },
] as const

// Helper functions
export function getQuestTypeInfo(type: QuestType) {
  return QUEST_TYPES.find(t => t.value === type)
}

export function getQuestPriorityInfo(priority: QuestPriority) {
  return QUEST_PRIORITIES.find(p => p.value === priority)
}

export function getQuestStatusInfo(status: QuestStatus) {
  return QUEST_STATUSES.find(s => s.value === status)
}

export function getActionTypeInfo(type: ActionType) {
  return ACTION_TYPES.find(a => a.value === type)
}

export function getRewardTypeInfo(type: string) {
  return REWARD_TYPES.find(r => r.value === type)
}

export function getConnectionTypeInfo(type: string) {
  return CONNECTION_TYPES.find(c => c.value === type)
}

// Quest progress calculations
export function calculateQuestProgress(quest: Quest): Quest['timeline'] {
  const completedActions = quest.actions.filter(a => a.isCompleted).length
  const totalActions = quest.actions.length
  const progressPercentage =
    totalActions > 0 ? (completedActions / totalActions) * 100 : 0

  const totalEstimatedDuration = quest.actions.reduce((sum, action) => {
    return sum + (action.estimatedDuration || 0)
  }, 0)

  const nextAction = quest.actions
    .filter(a => !a.isCompleted && canStartAction(a, quest.actions))
    .sort((a, b) => a.order - b.order)[0]

  const result: Quest['timeline'] = {
    totalEstimatedDuration,
    completedActions,
    totalActions,
    progressPercentage,
  }

  if (nextAction) {
    result.nextAction = nextAction
  }

  return result
}

// Check if an action can be started based on prerequisites
export function canStartAction(
  action: QuestAction,
  allActions: QuestAction[]
): boolean {
  if (action.isCompleted) return false

  if (!action.prerequisites || action.prerequisites.length === 0) {
    return true
  }

  return action.prerequisites.every(prereqId => {
    const prereqAction = allActions.find(a => a.id === prereqId)
    return prereqAction?.isCompleted || false
  })
}

// Generate a timeline view of quest actions
export function generateQuestTimeline(quest: Quest) {
  const sortedActions = [...quest.actions].sort((a, b) => a.order - b.order)

  return sortedActions.map((action, index) => ({
    ...action,
    canStart: canStartAction(action, quest.actions),
    isNext: index === 0 || (sortedActions[index - 1]?.isCompleted ?? false),
    dependencies:
      action.prerequisites
        ?.map(id => quest.actions.find(a => a.id === id)?.title)
        .filter(Boolean) || [],
  }))
}

// Quest filtering and sorting utilities
export function filterQuestsByStatus(
  quests: Quest[],
  status: QuestStatus
): Quest[] {
  return quests.filter(q => q.status === status)
}

export function filterQuestsByType(quests: Quest[], type: QuestType): Quest[] {
  return quests.filter(q => q.type === type)
}

export function sortQuestsByPriority(quests: Quest[]): Quest[] {
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  return [...quests].sort(
    (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
  )
}

export function getActiveQuests(quests: Quest[]): Quest[] {
  return quests.filter(q => q.status === 'active')
}

export function getCompletedQuests(quests: Quest[]): Quest[] {
  return quests.filter(q => q.status === 'completed')
}
