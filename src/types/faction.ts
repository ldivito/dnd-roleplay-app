import { z } from 'zod'

// Faction Types
export type FactionType =
  | 'guild'
  | 'religious'
  | 'political'
  | 'military'
  | 'criminal'
  | 'mercantile'
  | 'scholarly'
  | 'noble_house'
  | 'cult'
  | 'adventuring_party'
  | 'monster_group'
  | 'tribal'
  | 'other'

export type FactionSize = 'tiny' | 'small' | 'medium' | 'large' | 'massive'

export type FactionInfluence =
  | 'none'
  | 'local'
  | 'regional'
  | 'national'
  | 'continental'
  | 'planar'

export type FactionAlignment =
  | 'lawful_good'
  | 'neutral_good'
  | 'chaotic_good'
  | 'lawful_neutral'
  | 'true_neutral'
  | 'chaotic_neutral'
  | 'lawful_evil'
  | 'neutral_evil'
  | 'chaotic_evil'

export type FactionStatus =
  | 'active'
  | 'inactive'
  | 'disbanded'
  | 'hidden'
  | 'destroyed'

export type RelationshipType =
  | 'allied'
  | 'friendly'
  | 'neutral'
  | 'rival'
  | 'enemy'
  | 'unknown'

// Faction Resource Types
export interface FactionResource {
  id: string
  type:
    | 'wealth'
    | 'military'
    | 'political'
    | 'magical'
    | 'information'
    | 'territory'
    | 'other'
  name: string
  description: string
  amount?: number
  quality?: 'poor' | 'average' | 'good' | 'excellent' | 'legendary'
}

// Faction Goals and Motivations
export interface FactionGoal {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'planning' | 'active' | 'completed' | 'failed' | 'abandoned'
  deadline?: Date
  progress: number // 0-100
}

// Relationships with other factions
export interface FactionRelationship {
  id: string
  factionId: string
  factionName: string
  relationshipType: RelationshipType
  description?: string
  history?: string
  isPublic: boolean // Whether this relationship is known to others
  lastUpdated: Date
}

// Connections to other game systems
export interface FactionConnection {
  id: string
  type: 'npc' | 'location' | 'lore' | 'item' | 'character' | 'quest'
  entityId: string
  entityName: string
  relationshipType:
    | 'leader'
    | 'member'
    | 'ally'
    | 'enemy'
    | 'base'
    | 'territory'
    | 'artifact'
    | 'related'
  description?: string
  importance: 'minor' | 'significant' | 'major' | 'critical'
}

// Faction Structure/Hierarchy
export interface FactionRank {
  id: string
  name: string
  level: number // 1 = lowest, higher numbers = higher ranks
  description: string
  permissions: string[]
  requirements?: string
}

// Main Faction Interface
export interface Faction {
  id: string
  name: string
  shortName?: string // Acronym or short version
  description: string

  // Core Properties
  type: FactionType
  size: FactionSize
  influence: FactionInfluence
  alignment?: FactionAlignment
  status: FactionStatus

  // Organization Details
  foundedDate?: Date
  foundedBy?: string
  headquarters?: string
  headquartersId?: string // Location ID
  territory: string[] // Array of location IDs or descriptions

  // Leadership and Structure
  leader?: string
  leaderId?: string // NPC ID
  secondInCommand?: string
  secondInCommandId?: string // NPC ID
  ranks: FactionRank[]
  totalMembers?: number

  // Goals and Motivations
  goals: FactionGoal[]
  motivations: string[]
  methods: string[] // How they operate
  secrets: string[] // Hidden information

  // Resources and Assets
  resources: FactionResource[]
  wealth?: number
  militaryStrength?: number
  politicalPower?: number

  // Relationships
  relationships: FactionRelationship[]
  connections: FactionConnection[]

  // Public Information
  isKnownToPlayers: boolean
  publicReputation?: string
  publicGoals?: string[]
  rumors: string[]

  // Campaign Integration
  tags: string[]
  plotHooks: string[]

  // Internal Notes
  dmNotes?: string

  // Metadata
  createdAt: Date
  updatedAt: Date
}

// Zod Schemas for validation
export const FactionResourceSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'wealth',
    'military',
    'political',
    'magical',
    'information',
    'territory',
    'other',
  ]),
  name: z.string().min(1),
  description: z.string(),
  amount: z.number().min(0).optional(),
  quality: z
    .enum(['poor', 'average', 'good', 'excellent', 'legendary'])
    .optional(),
})

export const FactionGoalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['planning', 'active', 'completed', 'failed', 'abandoned']),
  deadline: z.date().optional(),
  progress: z.number().min(0).max(100),
})

export const FactionRelationshipSchema = z.object({
  id: z.string().uuid(),
  factionId: z.string().uuid(),
  factionName: z.string(),
  relationshipType: z.enum([
    'allied',
    'friendly',
    'neutral',
    'rival',
    'enemy',
    'unknown',
  ]),
  description: z.string().optional(),
  history: z.string().optional(),
  isPublic: z.boolean(),
  lastUpdated: z.date(),
})

export const FactionConnectionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['npc', 'location', 'lore', 'item', 'character', 'quest']),
  entityId: z.string().uuid(),
  entityName: z.string(),
  relationshipType: z.enum([
    'leader',
    'member',
    'ally',
    'enemy',
    'base',
    'territory',
    'artifact',
    'related',
  ]),
  description: z.string().optional(),
  importance: z.enum(['minor', 'significant', 'major', 'critical']),
})

export const FactionRankSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  level: z.number().min(1),
  description: z.string(),
  permissions: z.array(z.string()),
  requirements: z.string().optional(),
})

export const FactionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  shortName: z.string().optional(),
  description: z.string().min(1),

  type: z.enum([
    'guild',
    'religious',
    'political',
    'military',
    'criminal',
    'mercantile',
    'scholarly',
    'noble_house',
    'cult',
    'adventuring_party',
    'monster_group',
    'tribal',
    'other',
  ]),
  size: z.enum(['tiny', 'small', 'medium', 'large', 'massive']),
  influence: z.enum([
    'none',
    'local',
    'regional',
    'national',
    'continental',
    'planar',
  ]),
  alignment: z
    .enum([
      'lawful_good',
      'neutral_good',
      'chaotic_good',
      'lawful_neutral',
      'true_neutral',
      'chaotic_neutral',
      'lawful_evil',
      'neutral_evil',
      'chaotic_evil',
    ])
    .optional(),
  status: z.enum(['active', 'inactive', 'disbanded', 'hidden', 'destroyed']),

  foundedDate: z.date().optional(),
  foundedBy: z.string().optional(),
  headquarters: z.string().optional(),
  headquartersId: z.string().uuid().optional(),
  territory: z.array(z.string()),

  leader: z.string().optional(),
  leaderId: z.string().uuid().optional(),
  secondInCommand: z.string().optional(),
  secondInCommandId: z.string().uuid().optional(),
  ranks: z.array(FactionRankSchema),
  totalMembers: z.number().min(0).optional(),

  goals: z.array(FactionGoalSchema),
  motivations: z.array(z.string()),
  methods: z.array(z.string()),
  secrets: z.array(z.string()),

  resources: z.array(FactionResourceSchema),
  wealth: z.number().min(0).optional(),
  militaryStrength: z.number().min(0).optional(),
  politicalPower: z.number().min(0).optional(),

  relationships: z.array(FactionRelationshipSchema),
  connections: z.array(FactionConnectionSchema),

  isKnownToPlayers: z.boolean(),
  publicReputation: z.string().optional(),
  publicGoals: z.array(z.string()).optional(),
  rumors: z.array(z.string()),

  tags: z.array(z.string()),
  plotHooks: z.array(z.string()),

  dmNotes: z.string().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
})

// Constants for dropdowns and UI
export const FACTION_TYPES = [
  {
    value: 'guild',
    label: 'Gremio',
    description: 'Asociación de artesanos o profesionales',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'religious',
    label: 'Religioso',
    description: 'Orden religiosa o iglesia',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'political',
    label: 'Político',
    description: 'Organización política o gubernamental',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    value: 'military',
    label: 'Militar',
    description: 'Ejército u organización militar',
    color: 'bg-red-100 text-red-800',
  },
  {
    value: 'criminal',
    label: 'Criminal',
    description: 'Organización criminal o ilegal',
    color: 'bg-gray-100 text-gray-800',
  },
  {
    value: 'mercantile',
    label: 'Mercantil',
    description: 'Compañía comercial o mercantil',
    color: 'bg-green-100 text-green-800',
  },
  {
    value: 'scholarly',
    label: 'Academia',
    description: 'Institución académica o de investigación',
    color: 'bg-indigo-100 text-indigo-800',
  },
  {
    value: 'noble_house',
    label: 'Casa Noble',
    description: 'Casa noble o familia aristocrática',
    color: 'bg-pink-100 text-pink-800',
  },
  {
    value: 'cult',
    label: 'Culto',
    description: 'Culto secreto o grupo fanático',
    color: 'bg-red-100 text-red-800',
  },
  {
    value: 'adventuring_party',
    label: 'Grupo Aventurero',
    description: 'Grupo de aventureros',
    color: 'bg-orange-100 text-orange-800',
  },
  {
    value: 'monster_group',
    label: 'Grupo de Monstruos',
    description: 'Tribu o clan de criaturas',
    color: 'bg-gray-100 text-gray-800',
  },
  {
    value: 'tribal',
    label: 'Tribal',
    description: 'Tribu o clan primitivo',
    color: 'bg-brown-100 text-brown-800',
  },
  {
    value: 'other',
    label: 'Otro',
    description: 'Otro tipo de organización',
    color: 'bg-gray-100 text-gray-800',
  },
] as const

export const FACTION_SIZES = [
  {
    value: 'tiny',
    label: 'Diminuto',
    description: '1-5 miembros',
    memberRange: '1-5',
  },
  {
    value: 'small',
    label: 'Pequeño',
    description: '6-25 miembros',
    memberRange: '6-25',
  },
  {
    value: 'medium',
    label: 'Mediano',
    description: '26-100 miembros',
    memberRange: '26-100',
  },
  {
    value: 'large',
    label: 'Grande',
    description: '101-1000 miembros',
    memberRange: '101-1000',
  },
  {
    value: 'massive',
    label: 'Masivo',
    description: '1000+ miembros',
    memberRange: '1000+',
  },
] as const

export const FACTION_INFLUENCES = [
  {
    value: 'none',
    label: 'Ninguna',
    description: 'Sin influencia política o social',
  },
  {
    value: 'local',
    label: 'Local',
    description: 'Influencia en una ciudad o región pequeña',
  },
  {
    value: 'regional',
    label: 'Regional',
    description: 'Influencia en varias ciudades o provincia',
  },
  {
    value: 'national',
    label: 'Nacional',
    description: 'Influencia a nivel de reino o nación',
  },
  {
    value: 'continental',
    label: 'Continental',
    description: 'Influencia en múltiples naciones',
  },
  {
    value: 'planar',
    label: 'Planar',
    description: 'Influencia que trasciende planos',
  },
] as const

export const FACTION_ALIGNMENTS = [
  { value: 'lawful_good', label: 'Legal Bueno', short: 'LB' },
  { value: 'neutral_good', label: 'Neutral Bueno', short: 'NB' },
  { value: 'chaotic_good', label: 'Caótico Bueno', short: 'CB' },
  { value: 'lawful_neutral', label: 'Legal Neutral', short: 'LN' },
  { value: 'true_neutral', label: 'Neutral Verdadero', short: 'N' },
  { value: 'chaotic_neutral', label: 'Caótico Neutral', short: 'CN' },
  { value: 'lawful_evil', label: 'Legal Malvado', short: 'LM' },
  { value: 'neutral_evil', label: 'Neutral Malvado', short: 'NM' },
  { value: 'chaotic_evil', label: 'Caótico Malvado', short: 'CM' },
] as const

export const FACTION_STATUSES = [
  { value: 'active', label: 'Activa', color: 'bg-green-100 text-green-800' },
  {
    value: 'inactive',
    label: 'Inactiva',
    color: 'bg-yellow-100 text-yellow-800',
  },
  { value: 'disbanded', label: 'Disuelta', color: 'bg-gray-100 text-gray-800' },
  { value: 'hidden', label: 'Oculta', color: 'bg-purple-100 text-purple-800' },
  { value: 'destroyed', label: 'Destruida', color: 'bg-red-100 text-red-800' },
] as const

export const RELATIONSHIP_TYPES = [
  {
    value: 'allied',
    label: 'Aliada',
    color: 'bg-green-100 text-green-800',
    description: 'Alianza formal o informal',
  },
  {
    value: 'friendly',
    label: 'Amistosa',
    color: 'bg-blue-100 text-blue-800',
    description: 'Relación positiva pero no alianza',
  },
  {
    value: 'neutral',
    label: 'Neutral',
    color: 'bg-gray-100 text-gray-800',
    description: 'Sin relación especial',
  },
  {
    value: 'rival',
    label: 'Rival',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Competencia o rivalidad',
  },
  {
    value: 'enemy',
    label: 'Enemiga',
    color: 'bg-red-100 text-red-800',
    description: 'Enemistad activa',
  },
  {
    value: 'unknown',
    label: 'Desconocida',
    color: 'bg-purple-100 text-purple-800',
    description: 'Relación no establecida',
  },
] as const

export const RESOURCE_TYPES = [
  { value: 'wealth', label: 'Riqueza', icon: '💰' },
  { value: 'military', label: 'Militar', icon: '⚔️' },
  { value: 'political', label: 'Político', icon: '🏛️' },
  { value: 'magical', label: 'Mágico', icon: '✨' },
  { value: 'information', label: 'Información', icon: '📊' },
  { value: 'territory', label: 'Territorio', icon: '🗺️' },
  { value: 'other', label: 'Otro', icon: '📦' },
] as const

export const GOAL_PRIORITIES = [
  { value: 'low', label: 'Baja', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Crítica', color: 'bg-red-100 text-red-800' },
] as const

export const GOAL_STATUSES = [
  {
    value: 'planning',
    label: 'Planificando',
    color: 'bg-blue-100 text-blue-800',
  },
  { value: 'active', label: 'Activo', color: 'bg-green-100 text-green-800' },
  {
    value: 'completed',
    label: 'Completado',
    color: 'bg-green-100 text-green-800',
  },
  { value: 'failed', label: 'Fallido', color: 'bg-red-100 text-red-800' },
  {
    value: 'abandoned',
    label: 'Abandonado',
    color: 'bg-gray-100 text-gray-800',
  },
] as const

export const CONNECTION_RELATIONSHIP_TYPES = [
  { value: 'leader', label: 'Líder', description: 'Lidera la facción' },
  {
    value: 'member',
    label: 'Miembro',
    description: 'Es miembro de la facción',
  },
  {
    value: 'ally',
    label: 'Aliado',
    description: 'Aliado externo de la facción',
  },
  { value: 'enemy', label: 'Enemigo', description: 'Enemigo de la facción' },
  {
    value: 'base',
    label: 'Base',
    description: 'Ubicación de la base o cuartel',
  },
  {
    value: 'territory',
    label: 'Territorio',
    description: 'Territorio controlado',
  },
  {
    value: 'artifact',
    label: 'Artefacto',
    description: 'Objeto importante para la facción',
  },
  { value: 'related', label: 'Relacionado', description: 'Otra relación' },
] as const

// Helper functions
export function getFactionTypeInfo(type: FactionType) {
  return FACTION_TYPES.find(t => t.value === type)
}

export function getFactionSizeInfo(size: FactionSize) {
  return FACTION_SIZES.find(s => s.value === size)
}

export function getFactionInfluenceInfo(influence: FactionInfluence) {
  return FACTION_INFLUENCES.find(i => i.value === influence)
}

export function getFactionAlignmentInfo(alignment: FactionAlignment) {
  return FACTION_ALIGNMENTS.find(a => a.value === alignment)
}

export function getFactionStatusInfo(status: FactionStatus) {
  return FACTION_STATUSES.find(s => s.value === status)
}

export function getRelationshipTypeInfo(type: RelationshipType) {
  return RELATIONSHIP_TYPES.find(r => r.value === type)
}

export function getResourceTypeInfo(type: string) {
  return RESOURCE_TYPES.find(r => r.value === type)
}

export function getGoalPriorityInfo(priority: string) {
  return GOAL_PRIORITIES.find(p => p.value === priority)
}

export function getGoalStatusInfo(status: string) {
  return GOAL_STATUSES.find(s => s.value === status)
}

export function getConnectionRelationshipTypeInfo(type: string) {
  return CONNECTION_RELATIONSHIP_TYPES.find(c => c.value === type)
}

// Utility functions
export function calculateFactionPower(faction: Faction): number {
  const sizeMultiplier =
    FACTION_SIZES.findIndex(s => s.value === faction.size) + 1
  const influenceMultiplier =
    FACTION_INFLUENCES.findIndex(i => i.value === faction.influence) + 1
  const wealthScore = faction.wealth || 0
  const militaryScore = faction.militaryStrength || 0
  const politicalScore = faction.politicalPower || 0

  return (
    sizeMultiplier * influenceMultiplier +
    (wealthScore + militaryScore + politicalScore) / 3
  )
}

export function getFactionsByType(
  factions: Faction[],
  type: FactionType
): Faction[] {
  return factions.filter(f => f.type === type)
}

export function getFactionsByStatus(
  factions: Faction[],
  status: FactionStatus
): Faction[] {
  return factions.filter(f => f.status === status)
}

export function getActiveFactions(factions: Faction[]): Faction[] {
  return factions.filter(f => f.status === 'active')
}

export function getFactionsByInfluence(
  factions: Faction[],
  influence: FactionInfluence
): Faction[] {
  return factions.filter(f => f.influence === influence)
}

export function sortFactionsByPower(factions: Faction[]): Faction[] {
  return [...factions].sort(
    (a, b) => calculateFactionPower(b) - calculateFactionPower(a)
  )
}
